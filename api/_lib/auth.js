import crypto from 'node:crypto';
import { SESSION_COOKIE_NAME, cleanText, json, parseCookies, serializeCookie } from './http.js';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const getAdminConfig = () => {
  const password = cleanText(process.env.ADMIN_PASSWORD);
  const sessionSecret = cleanText(process.env.ADMIN_SESSION_SECRET) || password;

  if (!password || !sessionSecret) {
    return null;
  }

  return { password, sessionSecret };
};

const toBuffer = (value) => Buffer.from(value, 'utf8');

const safeEqual = (left, right) => {
  const leftBuffer = toBuffer(left);
  const rightBuffer = toBuffer(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

function signPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionValue(secret) {
  const payload = Buffer.from(JSON.stringify({ issuedAt: Date.now() })).toString('base64url');
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

function verifySessionValue(value, secret) {
  if (!value || !value.includes('.')) {
    return false;
  }

  const [payload, signature] = value.split('.');
  const expected = signPayload(payload, secret);

  if (!safeEqual(signature, expected)) {
    return false;
  }

  try {
    const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const issuedAt = Number(parsedPayload?.issuedAt || 0);

    return Number.isFinite(issuedAt) && Date.now() - issuedAt < SESSION_TTL_SECONDS * 1000;
  } catch {
    return false;
  }
}

function setSessionCookie(res, value, maxAge) {
  res.setHeader('Set-Cookie', serializeCookie(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  }));
}

export function isAdminAuthenticated(req) {
  const config = getAdminConfig();
  if (!config) {
    return false;
  }

  const cookies = parseCookies(req);
  return verifySessionValue(cookies[SESSION_COOKIE_NAME], config.sessionSecret);
}

export function requireAdmin(req, res) {
  const config = getAdminConfig();

  if (!config) {
    json(res, 500, { error: 'Admin auth is not configured' });
    return false;
  }

  if (!isAdminAuthenticated(req)) {
    json(res, 401, { error: 'Unauthorized' });
    return false;
  }

  return true;
}

export function handleAdminLogin(req, res) {
  const config = getAdminConfig();

  if (!config) {
    return json(res, 500, { error: 'Admin auth is not configured' });
  }

  const submittedPassword = cleanText(req?.body?.password);

  if (!submittedPassword || !safeEqual(submittedPassword, config.password)) {
    return json(res, 401, { error: 'Invalid password' });
  }

  setSessionCookie(res, createSessionValue(config.sessionSecret), SESSION_TTL_SECONDS);
  return json(res, 200, { success: true });
}

export function handleAdminLogout(res) {
  setSessionCookie(res, '', 0);
  return json(res, 200, { success: true });
}
