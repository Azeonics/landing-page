/**
 * Security utilities for the contact form API
 * Includes rate limiting, input validation, spam detection, and advanced protection
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
const emailStore: Map<string, { count: number; resetTime: number }> = new Map();
const submissionHashStore: Map<string, { timestamp: number }> = new Map();
const ipBurstStore: Map<string, number[]> = new Map();

// List of disposable/spam email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwaway.email', '10minutemail.info', 'temp-mail.org', 'trashmail.com',
  'yopmail.com', 'maildrop.cc', 'fakeinbox.com', 'fakemail.net'
];

/**
 * Configuration constants
 */
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
  
  // Spam detection thresholds
  SPAM_KEYWORDS: ['viagra', 'casino', 'lottery', 'prize', 'click here', 'buy now'],
  MAX_URLS_IN_MESSAGE: 3,
  
  // Advanced security
  MIN_MESSAGE_LENGTH: 10,
  MAX_SUBMISSION_SIMILARITY: 0.85, // 85% similarity = likely spam
  IP_BURST_THRESHOLD: 10, // requests in 10 seconds = suspicious
  DISPOSABLE_EMAIL_ALLOW: false, // Reject disposable emails
  REQUIRE_VALID_INTEREST: true, // Strict interest validation
  DETECT_FORM_SCRAPING: true, // Detect automated form scraping
};

/**
 * Extract IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwardedFor?.split(',')[0] || realIP || 'unknown';
}

/**
 * Check rate limit by IP per minute
 */
export function checkRateLimitPerMinute(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = `ip:${ip}:minute`;
  let record = rateLimitStore.get(key);

  // Initialize or reset if time window expired
  if (!record || record.resetTime < now) {
    record = { count: 0, resetTime: now + 60000 };
    rateLimitStore.set(key, record);
  }

  const remaining = SECURITY_CONFIG.IP_REQUESTS_PER_MINUTE - record.count;
  const allowed = record.count < SECURITY_CONFIG.IP_REQUESTS_PER_MINUTE;

  if (allowed) {
    record.count++;
  }

  return {
    allowed,
    remaining: Math.max(0, remaining),
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Check rate limit by email per day
 */
export function checkRateLimitPerEmail(email: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = `email:${email}:day`;
  let record = emailStore.get(key);

  // Initialize or reset if time window expired (24 hours)
  if (!record || record.resetTime < now) {
    record = { count: 0, resetTime: now + 86400000 };
    emailStore.set(key, record);
  }

  const remaining = SECURITY_CONFIG.EMAIL_SUBMISSIONS_PER_DAY - record.count;
  const allowed = record.count < SECURITY_CONFIG.EMAIL_SUBMISSIONS_PER_DAY;

  if (allowed) {
    record.count++;
  }

  return {
    allowed,
    remaining: Math.max(0, remaining),
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Validate input lengths and format
 */
export function validateInput(
  name: string,
  email: string,
  interest: string,
  message: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
    errors.push(`Name must be under ${SECURITY_CONFIG.MAX_NAME_LENGTH} characters`);
  } else if (!/^[a-zA-Z\s\-'.]+$/.test(name)) {
    errors.push('Name contains invalid characters');
  }

  // Email validation (more strict)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  } else if (email.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
    errors.push('Email is too long');
  }

  // Interest validation (prevent invalid options)
  const validInterests = [
    'Manufacturing as a Service',
    'Test & Qualification campaign',
    'Cleanroom & integration slot',
    'Ground Station as a Service',
    'Skilling program (1-week bootcamp)',
    'Skilling program (12-week advanced)',
    'ISRO POEM / SMiLE capstone',
    'Idea-to-Orbit student bundle',
    'Partnership / Other',
  ];
  if (!interest || !validInterests.includes(interest)) {
    errors.push('Invalid interest category selected');
  }

  // Message validation
  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
    errors.push(`Message must be under ${SECURITY_CONFIG.MAX_MESSAGE_LENGTH} characters`);
  } else if (message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Detect spam in message
 */
export function detectSpam(name: string, email: string, message: string): { isSpam: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const combined = `${name} ${email} ${message}`.toLowerCase();

  // Check for spam keywords
  for (const keyword of SECURITY_CONFIG.SPAM_KEYWORDS) {
    if (combined.includes(keyword)) {
      reasons.push(`Contains spam keyword: "${keyword}"`);
    }
  }

  // Check for excessive URLs
  const urlCount = (message.match(/https?:\/\/[^\s]+/g) || []).length;
  if (urlCount > SECURITY_CONFIG.MAX_URLS_IN_MESSAGE) {
    reasons.push(`Too many URLs (${urlCount}, max ${SECURITY_CONFIG.MAX_URLS_IN_MESSAGE})`);
  }

  // Check for repeated characters (common spam pattern)
  if (/(.)\1{9,}/.test(message)) {
    reasons.push('Contains excessive repeated characters');
  }

  // Check for ALL CAPS (common spam pattern, allow if name/email only)
  if (message.length > 50 && message === message.toUpperCase() && !/[0-9]/.test(message)) {
    reasons.push('Message is in ALL CAPS');
  }

  // Check for suspicious email patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    reasons.push('Suspicious email format');
  }

  return {
    isSpam: reasons.length > 0,
    reasons,
  };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Generate secure log entry
 */
export function logSecurityEvent(
  event: 'RATE_LIMIT_EXCEEDED' | 'SPAM_DETECTED' | 'INVALID_INPUT' | 'SUCCESS' | 'ERROR',
  ip: string,
  email: string,
  details: string = ''
): void {
  const timestamp = new Date().toISOString();
  // Structured server-side log; warn/error severity for anything non-success.
  const emit = event === 'ERROR' ? console.error : event === 'SUCCESS' ? console.info : console.warn;
  emit(
    JSON.stringify({
      timestamp,
      event,
      ip: ip.substring(0, 10) + '***', // Partial IP for privacy
      email: email.split('@')[0] + '@***', // Partial email for privacy
      details,
    })
  );
}

/**
 * Cleanup old rate limit entries (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  for (const [key, record] of emailStore.entries()) {
    if (record.resetTime < now) {
      emailStore.delete(key);
    }
  }

  // Cleanup old submission hashes (24 hour retention)
  for (const [key, record] of submissionHashStore.entries()) {
    if (now - record.timestamp > 86400000) {
      submissionHashStore.delete(key);
    }
  }
}

/**
 * Check if email is from a disposable/temporary email service
 */
export function isDisposableEmail(email: string): boolean {
  if (!SECURITY_CONFIG.DISPOSABLE_EMAIL_ALLOW) {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain || '');
  }
  return false;
}

/**
 * Check for IP burst (multiple requests in very short time)
 */
export function checkIPBurst(ip: string): { isBurst: boolean; reason: string } {
  const now = Date.now();
  const key = `burst:${ip}`;
  
  if (!ipBurstStore.has(key)) {
    ipBurstStore.set(key, [now]);
    return { isBurst: false, reason: '' };
  }

  const timestamps = ipBurstStore.get(key)!;
  
  // Remove timestamps older than 10 seconds
  const recentTimestamps = timestamps.filter(t => now - t < 10000);
  recentTimestamps.push(now);
  ipBurstStore.set(key, recentTimestamps);

  if (recentTimestamps.length > SECURITY_CONFIG.IP_BURST_THRESHOLD) {
    return { 
      isBurst: true, 
      reason: `Too many requests in short time (${recentTimestamps.length} in 10s)` 
    };
  }

  return { isBurst: false, reason: '' };
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}

/**
 * Detect duplicate or near-duplicate submissions (form scraping)
 */
export function checkDuplicateSubmission(
  name: string,
  email: string,
  message: string
): { isDuplicate: boolean; reason: string } {
  // Create hash of submission
  const submissionContent = `${name}|${email}|${message}`;
  const hash = crypto
    .createHash('sha256')
    .update(submissionContent)
    .digest('hex');

  // Check for exact duplicate in last 24 hours
  for (const [storedHash, record] of submissionHashStore.entries()) {
    const age = Date.now() - record.timestamp;
    
    if (age < 86400000) { // Within 24 hours
      if (hash === storedHash) {
        return { isDuplicate: true, reason: 'Exact duplicate submission detected' };
      }

      // Check for near-duplicate (high similarity = likely spam)
      if (storedHash.startsWith('msg:')) {
        const storedMessage = storedHash.replace('msg:', '');
        const similarity = calculateStringSimilarity(message.toLowerCase(), storedMessage.toLowerCase());
        
        if (similarity > SECURITY_CONFIG.MAX_SUBMISSION_SIMILARITY) {
          return { 
            isDuplicate: true, 
            reason: `Duplicate submission with ${Math.round(similarity * 100)}% similarity` 
          };
        }
      }
    }
  }

  // Store this submission's hash
  submissionHashStore.set(hash, { timestamp: Date.now() });
  submissionHashStore.set(`msg:${message.toLowerCase()}`, { timestamp: Date.now() });

  return { isDuplicate: false, reason: '' };
}

/**
 * Detect form scraping patterns (User-Agent analysis)
 */
export function detectFormScraping(userAgent: string | null): { isSuspicious: boolean; reason: string } {
  if (!SECURITY_CONFIG.DETECT_FORM_SCRAPING || !userAgent) {
    return { isSuspicious: false, reason: '' };
  }

  const scraperPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i,
    /java(?!script)/i, /node/i, /axios/i, /postman/i, /insomnia/i, /thunder/i
  ];

  const suspiciousPatterns = [
    /^$/,  // Empty user agent
    /^-$/, // Just a dash
    /^default user agent$/i, // Default placeholder
  ];

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return { isSuspicious: true, reason: 'Suspicious or missing User-Agent' };
    }
  }

  // Check for known scraper patterns (but allow legitimate tools)
  for (const pattern of scraperPatterns) {
    if (pattern.test(userAgent)) {
      return { isSuspicious: true, reason: `Detected scraper/automation tool: ${userAgent.substring(0, 50)}` };
    }
  }

  return { isSuspicious: false, reason: '' };
}

/**
 * Validate interest category strictly
 */
export function validateInterestCategory(interest: string): boolean {
  const validInterests = [
    'Manufacturing as a Service',
    'Test & Qualification campaign',
    'Cleanroom & integration slot',
    'Ground Station as a Service',
    'Skilling program (1-week bootcamp)',
    'Skilling program (12-week advanced)',
    'ISRO POEM / SMiLE capstone',
    'Idea-to-Orbit student bundle',
    'Partnership / Other',
  ];

  if (SECURITY_CONFIG.REQUIRE_VALID_INTEREST) {
    return validInterests.includes(interest);
  }

  return !!interest;
}

/**
 * Detect potential SQL injection or advanced injection attacks
 */
export function detectInjectionAttack(input: string): { isAttack: boolean; reason: string } {
  const injectionPatterns = [
    // SQL injection patterns
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|JAVASCRIPT|EVAL)\b)/i,
    // Command injection
    /[;&|`$(){}[\]<>]/,
    // LDAP injection
    /[*()\\]/,
    // NoSQL injection
    /[\$\{]/,
    // Path traversal
    /\.\.\//,
    // XXE/XML attacks
    /<!ENTITY|<!DOCTYPE/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(input)) {
      return { 
        isAttack: true, 
        reason: `Potential injection attack detected: ${pattern.source.substring(0, 30)}` 
      };
    }
  }

  return { isAttack: false, reason: '' };
}

/**
 * Check email domain reputation (basic DNS check)
 */
export async function checkEmailDomain(email: string): Promise<{ valid: boolean; reason: string }> {
  try {
    const domain = email.split('@')[1];
    
    if (!domain) {
      return { valid: false, reason: 'Invalid email domain' };
    }

    // Check for suspicious domains (in production, use real DNS validation)
    const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (suspiciousDomains.includes(domain)) {
      return { valid: false, reason: 'Email domain is not valid' };
    }

    // Check for obviously fake domains
    if (!/\./.test(domain) || domain.length < 3) {
      return { valid: false, reason: 'Email domain format is invalid' };
    }

    return { valid: true, reason: '' };
  } catch (error) {
    return { valid: false, reason: 'Unable to validate email domain' };
  }
}
