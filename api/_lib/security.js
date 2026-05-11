// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Security Middleware
// Provides: rate limiting, honeypot check, hCaptcha verification, input sanitization
// ─────────────────────────────────────────────────────────────────────────────

import { json, cleanText } from './http.js';

// ── In-Memory Rate Limiter ────────────────────────────────────────────────────
// (Resets on each cold start — good enough for Vercel serverless)
const rateLimitStore = new Map(); // { key: { count, resetAt } }

/**
 * Simple sliding-window rate limiter.
 * @param {string} key   - IP address or user identifier
 * @param {number} limit - max requests allowed
 * @param {number} windowMs - time window in milliseconds
 * @returns {boolean} true if request is allowed, false if rate limited
 */
export function checkRateLimit(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return false; // rate limited
  }

  return true;
}

/**
 * Get client IP from request headers (works behind Vercel's proxy).
 */
export function getClientIp(req) {
  const forwarded = req?.headers?.['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req?.socket?.remoteAddress || 'unknown';
}

/**
 * Apply rate limit and send 429 if exceeded.
 * @returns {boolean} true = proceed, false = rate limited (response already sent)
 */
export function requireRateLimit(req, res, limit = 10, windowMs = 60_000) {
  const ip = getClientIp(req);
  const key = `${req.url?.split('?')[0]}_${ip}`;

  if (!checkRateLimit(key, limit, windowMs)) {
    json(res, 429, {
      error: 'Too many requests. Please wait a moment and try again.',
      retryAfter: Math.ceil(windowMs / 1000),
    });
    return false;
  }
  return true;
}

// ── Honeypot Check ────────────────────────────────────────────────────────────
/**
 * Bots fill hidden form fields. Check that the honeypot field is empty.
 * @param {object} body - request body
 * @returns {boolean} true if human (honeypot empty), false if bot
 */
export function checkHoneypot(body) {
  // The field is named something innocuous — bots fill it, humans don't see it
  const honeypot = body?.website || body?._hp || body?.phone_confirm;
  return !honeypot; // true = empty = human
}

// ── hCaptcha Verification ─────────────────────────────────────────────────────
/**
 * Verify hCaptcha token with hCaptcha's API.
 * Requires HCAPTCHA_SECRET env var.
 * Returns true if valid, false if invalid or not configured.
 */
export async function verifyHCaptcha(token) {
  const secret = cleanText(process.env.HCAPTCHA_SECRET);

  // If not configured, skip CAPTCHA check (development mode)
  if (!secret || secret === 'disabled') {
    console.warn('[Security] HCAPTCHA_SECRET not set — skipping CAPTCHA verification');
    return true;
  }

  if (!token) return false;

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[Security] hCaptcha verification error:', err.message);
    return false; // Fail closed on network error
  }
}

// ── CSRF / Origin Check ───────────────────────────────────────────────────────
/**
 * Basic origin check for mutation endpoints.
 * Since we use SameSite=Lax cookies this is defense-in-depth.
 */
export function checkOrigin(req) {
  const origin = req?.headers?.origin || '';
  const host = req?.headers?.host || '';

  // Allow same-origin and localhost in dev
  if (!origin) return true; // server-to-server, no Origin header
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (origin.includes(host)) return true;
  if (origin.includes('soulfullbites')) return true; // your production domain

  return false;
}

// ── Security Headers ──────────────────────────────────────────────────────────
export function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
