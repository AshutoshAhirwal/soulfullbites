// POST /api/user-auth      → Login      (rate limited: 5/min per IP)
// PUT  /api/user-auth      → Register   (rate limited: 3/min per IP + honeypot + hCaptcha)
// DELETE /api/user-auth   → Logout
// GET   /api/user-auth    → Get current user (from JWT cookie)

import {
  handleUserLogin,
  handleUserRegister,
  handleUserLogout,
  handleGetCurrentUser,
} from './_lib/user-auth.js';
import { json } from './_lib/http.js';
import {
  requireRateLimit,
  checkHoneypot,
  verifyHCaptcha,
  setSecurityHeaders,
  checkOrigin,
} from './_lib/security.js';

export default async function handler(req, res) {
  setSecurityHeaders(res);

  // GET — session check (no rate limit needed)
  if (req.method === 'GET') return handleGetCurrentUser(req, res);

  // DELETE — logout (no rate limit needed)
  if (req.method === 'DELETE') return handleUserLogout(res);

  // POST — Login: strict rate limit (5 attempts per minute per IP)
  if (req.method === 'POST') {
    if (!requireRateLimit(req, res, 5, 60_000)) return;
    if (!checkOrigin(req)) return json(res, 403, { error: 'Forbidden' });
    return handleUserLogin(req, res);
  }

  // PUT — Register: tighter rate limit + honeypot + hCaptcha
  if (req.method === 'PUT') {
    if (!requireRateLimit(req, res, 3, 60_000)) return;
    if (!checkOrigin(req)) return json(res, 403, { error: 'Forbidden' });

    // Honeypot check (bots fill hidden fields)
    if (!checkHoneypot(req.body)) {
      // Silently succeed to confuse bots (don't reveal detection)
      return json(res, 201, { success: true, _bot: true });
    }

    // hCaptcha verification (if configured)
    const captchaToken = req.body?.hcaptchaToken;
    const captchaValid = await verifyHCaptcha(captchaToken);
    if (!captchaValid) {
      return json(res, 400, { error: 'CAPTCHA verification failed. Please try again.' });
    }

    return handleUserRegister(req, res);
  }

  return json(res, 405, { error: 'Method not allowed' });
}
