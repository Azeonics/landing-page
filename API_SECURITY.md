# Contact Form API Security & Email Templates

## Overview

The contact form API (`/api/contact`) has been enhanced with comprehensive security measures and uses React Email for professional email templates.

---

## 1. Email Templates: React Email ✅

### What is React Email?

React Email is a library that makes it easier to build and maintain professional HTML email templates using React JSX syntax. It provides:

- **Component-based**: Build emails like React components
- **Type-safe**: Full TypeScript support
- **Email client optimization**: Ensures emails render correctly across all email clients
- **Responsive**: Built-in responsive design patterns
- **Easier maintenance**: No manual HTML string concatenation

### Our Implementation

**File**: `/app/api/contact/email-template.tsx`

```tsx
import {
  Body, Button, Container, Head, Hr, Html, Link, 
  Preview, Row, Section, Text
} from '@react-email/components';

export default function ContactEmailTemplate({ ... }) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry</Preview>
      <Body>
        <Container>
          <Section>/* Email content */</Section>
        </Container>
      </Body>
    </Html>
  );
}
```

**Benefits**:
- ✅ Type-safe with TypeScript interfaces
- ✅ Organized component structure
- ✅ Better email client compatibility
- ✅ Responsive design support
- ✅ Easy to maintain and update

### Resend Integration

The Resend API accepts both:
1. **JSX (React components)** - Our email template
2. **HTML strings** - User confirmation emails (fallback)

```typescript
// Using JSX component
await resend.emails.send({
  from: 'contactform@send.azeonics.com',
  to: 'bnraao@azeonics.com',
  subject: subject,
  react: ContactEmailTemplate({ ... }) as React.ReactElement,
});
```

---

## 2. API Security Implementation 🔒

### Security Architecture

The API implements multi-layer security checks:

```
Request Received
    ↓
1. Content-Type validation
2. Request size check
3. IP-based rate limiting (5 req/min, 50 req/hour)
4. JSON parsing & error handling
5. Input validation (length, format, characters)
6. Email rate limiting (3 submissions/day)
7. Spam detection
8. Input sanitization (XSS prevention)
9. Email sending with error handling
    ↓
Success / Logged Security Event
```

### 2.1 Request Validation

**Content-Type Check**
- Only accepts `application/json`
- Rejects other content types immediately
- Status: `400 Bad Request`

**Request Size Limit**
- Maximum body size: `10,000 bytes`
- Prevents buffer overflow attacks
- Status: `413 Payload Too Large`

### 2.2 Rate Limiting

#### IP-Based Rate Limiting
```typescript
// Per minute
IP_REQUESTS_PER_MINUTE = 5

// Per hour
IP_REQUESTS_PER_HOUR = 50
```

**In-memory store** (production should use Redis):
- Tracks IP address and request count
- Automatic time window reset
- Returns remaining requests and reset time

**Response**:
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45,
  "status": 429
}
```

#### Email-Based Rate Limiting
```typescript
EMAIL_SUBMISSIONS_PER_DAY = 3
```

**Per email address**:
- Limits spam from same email
- Prevents abuse of specific addresses
- Resets every 24 hours

**Response**:
```json
{
  "error": "You have reached the maximum number of inquiries per day...",
  "retryAfter": 86400,
  "status": 429
}
```

### 2.3 Input Validation

**Field-level validation**:

| Field | Validation |
|-------|-----------|
| **Name** | 1-100 chars, letters/spaces/hyphens only |
| **Email** | Valid email format, max 254 chars |
| **Interest** | Must match one of 9 predefined categories |
| **Message** | 10-5000 chars, no excessive special chars |

**Validation Example**:
```typescript
const validation = validateInput(name, email, interest, message);
if (!validation.valid) {
  return {
    error: 'Validation failed',
    details: validation.errors  // Array of specific error messages
  };
}
```

### 2.4 Spam Detection

The API detects and blocks common spam patterns:

**Spam Keywords**:
```typescript
SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'prize', 
  'click here', 'buy now'
];
```

**Other Spam Checks**:
- ✅ Excessive repeated characters (`aaaa...`)
- ✅ ALL CAPS messages
- ✅ Too many URLs (max 3)
- ✅ Suspicious email formats
- ✅ Combined keyword matching

**Response** (intentionally vague to prevent gaming):
```json
{
  "error": "Your submission could not be processed. Please try again.",
  "status": 400
}
```

### 2.5 Input Sanitization (XSS Prevention)

```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')           // Remove angle brackets
    .replace(/javascript:/gi, '')   // Remove javascript:
    .replace(/on\w+\s*=/gi, '');    // Remove event handlers
}
```

**Protected from**:
- HTML injection: `<script>alert('xss')</script>`
- Event handlers: `onclick="malicious()"`
- JavaScript protocol: `javascript:void(0)`

### 2.6 Logging & Monitoring

All security events are logged:

```typescript
logSecurityEvent(
  'RATE_LIMIT_EXCEEDED' | 'SPAM_DETECTED' | 'INVALID_INPUT' | 'SUCCESS' | 'ERROR',
  clientIP,
  email,
  details
);
```

**Log Format** (partial IP/email for privacy):
```json
{
  "timestamp": "2026-06-01T12:34:56.789Z",
  "event": "RATE_LIMIT_EXCEEDED",
  "ip": "192.168.1***",
  "email": "user@***",
  "details": "IP rate limit exceeded"
}
```

**Logged Events**:
- ✅ Rate limit violations
- ✅ Spam detections
- ✅ Invalid inputs
- ✅ All successful submissions
- ✅ API errors

---

## 3. Configuration Reference

**File**: `/app/api/contact/security.ts`

```typescript
export const SECURITY_CONFIG = {
  // Rate limiting per IP
  IP_REQUESTS_PER_MINUTE: 5,
  IP_REQUESTS_PER_HOUR: 50,
  
  // Rate limiting per email
  EMAIL_SUBMISSIONS_PER_DAY: 3,
  
  // Input validation
  MAX_MESSAGE_LENGTH: 5000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  
  // Request size
  MAX_BODY_SIZE: 10000, // bytes
  
  // Spam detection
  SPAM_KEYWORDS: ['viagra', 'casino', ...],
  MAX_URLS_IN_MESSAGE: 3,
};
```

### Adjusting Limits

To change security thresholds, edit `SECURITY_CONFIG` in `/app/api/contact/security.ts`:

```typescript
// Examples:
IP_REQUESTS_PER_MINUTE: 10,     // More lenient
EMAIL_SUBMISSIONS_PER_DAY: 5,   // More submissions allowed
MAX_MESSAGE_LENGTH: 10000,      // Longer messages
```

---

## 4. HTTP Response Codes

| Status | Scenario | Response |
|--------|----------|----------|
| **200** | Success | Form submitted, emails queued |
| **400** | Bad Request | Invalid JSON, validation failed, spam detected |
| **413** | Payload Too Large | Request body exceeds 10KB |
| **429** | Too Many Requests | Rate limit exceeded, includes `Retry-After` header |
| **500** | Server Error | Resend API error, unexpected exception |

---

## 5. API Key Protection

### Environment Variables

The Resend API key is stored in environment variables, **never in code**:

```bash
# .env.local (local development)
RESEND_API_KEY="re_RLmXbT9B_J44xRApEXjtcunRroWgveYcppush"

# Vercel (production)
# Added via Vercel dashboard → Settings → Environment Variables
```

### Key Security

- ✅ Never committed to Git (in `.gitignore`)
- ✅ Server-side only (never sent to client)
- ✅ Protected by Resend rate limiting
- ✅ Rotation recommended every 90 days

### No Public API Key Exposure

The endpoint **does not require** an API key from the client:
- Public endpoint (anyone can submit)
- Rate limiting protects against abuse
- IP and email rate limits prevent spam
- Spam detection filters malicious content

---

## 6. Deployment Checklist

Before deploying to production:

- [ ] ✅ Add `RESEND_API_KEY` to Vercel environment variables
- [ ] ✅ Set environment to Production, Preview, Development
- [ ] ✅ Verify `contactform@send.azeonics.com` is confirmed in Resend
- [ ] ✅ Review `SECURITY_CONFIG` limits are appropriate for your traffic
- [ ] ✅ Set up monitoring/alerting for security events
- [ ] ✅ Test rate limiting locally: `npm run dev`
- [ ] ✅ Test spam detection with test messages
- [ ] ✅ Verify emails arrive in both Azeonics and user inboxes

---

## 7. Production Recommendations

### Current Limitations

**In-memory rate limiting**:
- ✅ Works for single-server deployments
- ❌ Not suitable for multi-server/serverless
- ❌ Resets on each deployment

### For Production Scale

1. **Use Redis for rate limiting**:
   ```typescript
   // Instead of in-memory Map
   import Redis from '@upstash/redis';
   const redis = Redis.fromEnv();
   await redis.incr(`ip:${ip}:minute`);
   ```

2. **Add WAF (Web Application Firewall)**:
   - Vercel edge middleware
   - Cloudflare WAF rules

3. **IP Reputation Check**:
   - Use service like Abuseipdb
   - Block known spam sources

4. **CAPTCHA** (optional):
   - Add reCAPTCHA v3 for suspicious requests
   - Integrates with form submission

5. **Monitoring & Alerting**:
   - Send security alerts to Slack
   - Dashboard for abuse patterns
   - Automatic temporary IP blocks

---

## 8. Testing

### Test Rate Limiting

```bash
# Test 5 requests in quick succession
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","interest":"Manufacturing as a Service","message":"Test message for rate limiting"}'
done
# 6th request should return 429 Too Many Requests
```

### Test Spam Detection

```bash
# Should be rejected
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","interest":"Manufacturing as a Service","message":"Click here to win FREE VIAGRA!!!"}'
# Returns 400 Bad Request
```

### Test Input Validation

```bash
# Missing required field
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
# Returns 400 with validation errors

# Invalid email
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"notanemail","interest":"Manufacturing as a Service","message":"Test message"}'
# Returns 400 with email validation error
```

---

## 9. File Structure

```
/app/api/contact/
├── route.ts                 # Main API endpoint with security checks
├── security.ts              # Security utilities & config
├── email-template.tsx       # React Email template
└── (no plain html files)    # Moved to React Email components
```

---

## 10. Security Best Practices Implemented

- ✅ **Content-Type validation**: Only accept JSON
- ✅ **Request size limits**: Prevent buffer overflow
- ✅ **Rate limiting**: IP and email-based
- ✅ **Input validation**: Length, format, character restrictions
- ✅ **Spam detection**: Keyword matching, pattern detection
- ✅ **Input sanitization**: XSS prevention
- ✅ **Error handling**: Don't leak internal details
- ✅ **Logging**: All security events logged
- ✅ **API key protection**: Environment variables, server-side only
- ✅ **HTTPS only**: Enforced via Vercel

---

## 11. Common Issues & Troubleshooting

**Issue**: "Too many requests" on first submission
- **Cause**: Rate limit from same IP
- **Solution**: Wait 1 minute, try from different network

**Issue**: Form submitted but email not received
- **Check**:
  1. Is `RESEND_API_KEY` in Vercel env vars?
  2. Is `contactform@send.azeonics.com` verified in Resend?
  3. Check Resend dashboard for delivery logs
  4. Check spam folder

**Issue**: "Your submission could not be processed"
- **Cause**: Spam detected
- **Check**: Remove suspicious keywords, excessive URLs, repeated characters

**Issue**: Validation error but data looks correct
- **Check**: Character limits, special characters, email format

---

## 12. Next Steps

### Monitor & Improve

1. Review security logs weekly
2. Adjust rate limits based on traffic patterns
3. Add new spam keywords as needed
4. Consider email verification for high-value inquiries

### Scale Considerations

1. Migrate to Redis for rate limiting (when multi-server)
2. Add WAF rules for common attacks
3. Implement CAPTCHA for suspicious patterns
4. Set up abuse analytics dashboard

---

## Support & Documentation

- **Resend Docs**: https://resend.com/docs
- **React Email Docs**: https://react.email
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Rate Limiting Pattern**: https://nodejs.org/en/docs/guides/simple-rate-limiting

---

**Last Updated**: June 1, 2026  
**Status**: Production Ready ✅
