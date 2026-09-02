import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import ContactEmailTemplate from '@/app/api/contact/email-template';
import {
  getClientIP,
  checkRateLimitPerMinute,
  checkRateLimitPerEmail,
  validateInput,
  detectSpam,
  sanitizeInput,
  logSecurityEvent,
  SECURITY_CONFIG,
  isDisposableEmail,
  checkIPBurst,
  checkDuplicateSubmission,
  detectFormScraping,
  validateInterestCategory,
  detectInjectionAttack,
  checkEmailDomain,
} from './security';

// Instantiate lazily: constructing at module scope throws "Missing API key"
// during `next build` (page-data collection) in any environment without the
// key set. Deferring to request time keeps the build resilient.
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function POST(request: NextRequest) {
  try {
    // ========== SECURITY CHECKS ==========

    // 1. Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // 2. Check request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      );
    }

    // 3. Get client IP
    const clientIP = getClientIP(request);

    // 4. Check IP-based rate limit (per minute)
    const ipRateLimit = checkRateLimitPerMinute(clientIP);
    if (!ipRateLimit.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', clientIP, 'unknown', 'IP rate limit exceeded');
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: ipRateLimit.resetIn,
        },
        { 
          status: 429,
          headers: { 'Retry-After': ipRateLimit.resetIn.toString() },
        }
      );
    }

    // 4.5 Check IP burst (multiple requests in 10 seconds)
    const burstCheck = checkIPBurst(clientIP);
    if (burstCheck.isBurst) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', clientIP, 'unknown', `IP burst detected: ${burstCheck.reason}`);
      return NextResponse.json(
        { error: 'Too many requests in a short time. Please slow down.' },
        { status: 429 }
      );
    }

    // 4.6 Check User-Agent for form scraping
    const userAgent = request.headers.get('user-agent');
    const scrapingCheck = detectFormScraping(userAgent);
    if (scrapingCheck.isSuspicious) {
      logSecurityEvent('SPAM_DETECTED', clientIP, 'unknown', `Form scraping detected: ${scrapingCheck.reason}`);
      return NextResponse.json(
        { error: 'Your request could not be processed.' },
        { status: 403 }
      );
    }

    // 5. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      logSecurityEvent('INVALID_INPUT', clientIP, 'unknown', 'Invalid JSON');
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { name, email, interest, message } = body;

    // ========== INPUT VALIDATION ==========

    // 6. Validate required fields and format
    const validation = validateInput(name, email, interest, message);
    if (!validation.valid) {
      logSecurityEvent('INVALID_INPUT', clientIP, email || 'unknown', validation.errors.join('; '));
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // 6.5 Detect injection attacks (SQL, Command, LDAP, NoSQL, XXE)
    const injectionCheck = detectInjectionAttack(name + ' ' + email + ' ' + message);
    if (injectionCheck.isAttack) {
      logSecurityEvent('SPAM_DETECTED', clientIP, email, `Injection attack detected: ${injectionCheck.reason}`);
      return NextResponse.json(
        { error: 'Your submission contains invalid characters.' },
        { status: 400 }
      );
    }

    // 6.6 Validate interest category strictly
    if (!validateInterestCategory(interest)) {
      logSecurityEvent('INVALID_INPUT', clientIP, email, 'Invalid interest category');
      return NextResponse.json(
        { error: 'Invalid interest category selected' },
        { status: 400 }
      );
    }

    // 6.7 Check for disposable email addresses
    if (isDisposableEmail(email)) {
      logSecurityEvent('SPAM_DETECTED', clientIP, email, 'Disposable email address detected');
      return NextResponse.json(
        { error: 'Please use a valid business or personal email address.' },
        { status: 400 }
      );
    }

    // 6.8 Validate email domain (basic check)
    const domainCheck = await checkEmailDomain(email);
    if (!domainCheck.valid) {
      logSecurityEvent('INVALID_INPUT', clientIP, email, `Email domain invalid: ${domainCheck.reason}`);
      return NextResponse.json(
        { error: 'Email address domain is not valid' },
        { status: 400 }
      );
    }

    // 7. Check email-based rate limit (per day)
    const emailRateLimit = checkRateLimitPerEmail(email);
    if (!emailRateLimit.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', clientIP, email, 'Email rate limit exceeded');
      return NextResponse.json(
        { 
          error: 'You have reached the maximum number of inquiries per day. Please try again tomorrow.',
          retryAfter: emailRateLimit.resetIn,
        },
        { 
          status: 429,
          headers: { 'Retry-After': emailRateLimit.resetIn.toString() },
        }
      );
    }

    // 7.5 Check for duplicate or near-duplicate submissions
    const duplicateCheck = checkDuplicateSubmission(name, email, message);
    if (duplicateCheck.isDuplicate) {
      logSecurityEvent('SPAM_DETECTED', clientIP, email, `Duplicate submission: ${duplicateCheck.reason}`);
      return NextResponse.json(
        { error: 'This inquiry appears to have been submitted recently. Please try again later.' },
        { status: 400 }
      );
    }

    // ========== SPAM DETECTION ==========

    // 8. Detect spam
    const spam = detectSpam(name, email, message);
    if (spam.isSpam) {
      logSecurityEvent('SPAM_DETECTED', clientIP, email, `Reasons: ${spam.reasons.join('; ')}`);
      // Don't reveal it's spam detection to avoid helping attackers
      return NextResponse.json(
        { error: 'Your submission could not be processed. Please try again.' },
        { status: 400 }
      );
    }

    // ========== SANITIZE INPUTS ==========

    // 9. Sanitize inputs (XSS prevention)
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);
    // Email doesn't need sanitizing as it's already validated

    // ========== SEND EMAILS ==========

    // 10. Dynamic subject line based on interest category
    const subjectMap: Record<string, string> = {
      'Manufacturing as a Service': 'MaaS Inquiry — Let\'s Build Together',
      'Test & Qualification campaign': 'Test Campaign Request — Qualification Ready',
      'Cleanroom & integration slot': 'Cleanroom Integration Inquiry',
      'Ground Station as a Service': 'GSaaS Inquiry — Ground Segment Access',
      'Skilling program (1-week bootcamp)': 'Bootcamp Application — Start Your Journey',
      'Skilling program (12-week advanced)': 'Advanced Skilling Program Interest',
      'ISRO POEM / SMiLE capstone': 'ISRO POEM/SMiLE Payload Inquiry',
      'Idea-to-Orbit student bundle': 'Student Bundle Inquiry',
      'Partnership / Other': 'Partnership Inquiry — Let\'s Collaborate'
    };

    const subject = subjectMap[interest] || `New Inquiry from ${sanitizedName}`;
    const timestamp = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });

    // 11. Send email to Azeonics team
    const result = await getResend().emails.send({
      from: 'contactform@send.azeonics.com',
      to: 'info@azeonics.com',
      subject: subject,
      react: ContactEmailTemplate({
        name: sanitizedName,
        email: email,
        interest: interest,
        message: sanitizedMessage,
        receivedAt: timestamp,
      }) as React.ReactElement,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      logSecurityEvent('ERROR', clientIP, email, `Resend API error: ${result.error.message}`);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    // 12. Send confirmation email to user
    try {
      await getResend().emails.send({
        from: 'contactform@send.azeonics.com',
        to: email,
        subject: 'We Received Your Inquiry — Azeonics',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; padding: 20px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              .header { background: #0D1117; padding: 40px 30px; text-align: center; border-bottom: none; }
              .header h1 { color: #ffffff; margin: 0 0 12px 0; font-size: 28px; }
              .header p { color: #888; margin: 0; font-size: 14px; letter-spacing: 1px; }
              .content { padding: 40px 30px; }
              .content h2 { color: #0D1117; font-size: 24px; margin-bottom: 16px; }
              .content p { color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
              .highlight-box { background: #ecf7ff; border: 1px solid #3E6AE1; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
              .highlight-box p { color: #1e40af; margin: 0 0 12px 0; font-weight: 600; }
              .contact-info { background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; }
              .contact-info p { color: #6b7280; font-size: 14px; margin: 0 0 4px 0; }
              .contact-info a { color: #3E6AE1; text-decoration: none; }
              .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 30px; text-align: center; }
              .footer p { color: #6b7280; font-size: 12px; margin: 0 0 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 Azeonics</h1>
                <p>IDEA TO ORBIT INNOVATION HUB</p>
              </div>
              <div class="content">
                <h2>Thank You, ${sanitizedName}!</h2>
                <p>We've received your inquiry regarding <strong>${interest}</strong>.</p>
                <p>Our team will review your request and get back to you within <strong>one working day</strong> with a feasibility note and available slots.</p>
                <div class="highlight-box">
                  <p>📧 Check your email for updates from our team at info@azeonics.com</p>
                </div>
                <p>In the meantime, explore more about our capabilities at <a href="https://azeonics.com">azeonics.com</a></p>
              </div>
              <div class="contact-info">
                <p><strong>Follow up contact:</strong></p>
                <p>📧 <a href="mailto:info@azeonics.com">info@azeonics.com</a></p>
                <p>📱 <a href="tel:+91-9668913303">+91-9668913303</a></p>
              </div>
              <div class="footer">
                <p>Azeonics Private Limited | ISRO-grade Manufacturing & Testing Hub</p>
                <p>Thane, Maharashtra · India | <a href="https://azeonics.com">azeonics.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (confirmError) {
      // Log but don't fail if confirmation email fails
      console.error('Confirmation email error:', confirmError);
      logSecurityEvent('ERROR', clientIP, email, 'Failed to send confirmation email');
    }

    // 13. Log successful submission
    logSecurityEvent('SUCCESS', clientIP, email, 'Form submitted successfully');

    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for reaching out! We will be in touch within one working day.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    const clientIP = getClientIP(request);
    logSecurityEvent('ERROR', clientIP, 'unknown', `Unexpected error: ${String(error)}`);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
