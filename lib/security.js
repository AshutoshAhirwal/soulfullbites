// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Security Middleware (Next.js 16 Async Version)
// ─────────────────────────────────────────────────────────────────────────────

import { headers } from 'next/headers';

const rateLimitStore = new Map();

export async function getClientIp() {
  const headerStore = await headers(); // NEXT.js 16 REQUIREMENT: Await headers()
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export function checkRateLimit(key, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count += 1;
  return entry.count <= limit;
}

export function checkHoneypot(body) {
  const honeypot = body?.website || body?._hp || body?.phone_confirm;
  return !honeypot;
}

export async function verifyHCaptcha(token) {
  const secret = (process.env.HCAPTCHA_SECRET || '').trim();
  if (!secret || secret === 'disabled') return true;
  if (!token) return false;

  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[Security] hCaptcha error:', err.message);
    return false;
  }
}

export function checkOrigin(request) {
  const origin = request.headers.get('origin') || '';
  const host = request.headers.get('host') || '';

  if (!origin) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (origin.includes(host)) return true;
  return origin.includes('soulfullbites');
}

export function hasFilledHoneypot(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function verifyTurnstile(token) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Permissive in dev if not set
  if (!token) return false;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });
    const outcome = await response.json();
    return outcome.success === true;
  } catch (err) {
    console.error('[Security] Turnstile error:', err.message);
    return false;
  }
}

// ─── Error Sanitization ───────────────────────────────────────────────────────

/**
 * Returns a safe, generic error message for the client while logging the real
 * error with a unique request ID for server-side tracing.
 *
 * Usage:
 *   return NextResponse.json({ error: sanitizeError(err, 'checkout') }, { status: 500 });
 */
export function sanitizeError(err, context = 'api') {
  const requestId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  console.error(`[${context.toUpperCase()}] Error [req:${requestId}]:`, err?.message ?? err);
  return `An unexpected error occurred. (ref: ${requestId})`;
}
