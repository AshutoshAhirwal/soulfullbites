// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — User JWT Auth Library
// Stateless JWT stored in HttpOnly cookie (no DB session table needed)
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { json, parseCookies, serializeCookie, cleanText } from './http.js';
import { dbQuery, ensureUsersTable } from './db.js';

const USER_COOKIE_NAME = 'soulfull_user_session';
const JWT_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getJwtSecret() {
  const secret = cleanText(process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET);
  if (!secret) throw new Error('JWT_SECRET env var is not configured');
  return secret;
}

function setUserCookie(res, token, maxAge = 60 * 60 * 24 * 7) {
  res.setHeader('Set-Cookie', serializeCookie(USER_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  }));
}

// ─── Password ────────────────────────────────────────────────────────────────

export async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

/**
 * Issue a JWT for a user row fetched from DB.
 * The JWT embeds: id, email, name, role, permissionOverrides
 * so most permission checks need zero extra DB queries.
 */
export function issueUserToken(userRow) {
  const payload = {
    sub: userRow.id,
    email: userRow.email,
    name: userRow.name,
    role: userRow.role,
    permissionOverrides: userRow.permission_overrides
      ? JSON.parse(userRow.permission_overrides)
      : {},
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode a JWT. Returns null if invalid/expired.
 */
export function decodeUserToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

// ─── Request Helpers ─────────────────────────────────────────────────────────

/**
 * Extract and decode the user JWT from the request cookie.
 * Returns null if not authenticated.
 */
export function getUserFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[USER_COOKIE_NAME];
  if (!token) return null;
  return decodeUserToken(token);
}

/**
 * Attach user to req._user and return true. Send 401 and return false if not authed.
 */
export function requireUser(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    json(res, 401, { error: 'Authentication required. Please log in.' });
    return false;
  }
  req._user = user;
  return true;
}

// ─── Auth Handlers ───────────────────────────────────────────────────────────

export async function handleUserRegister(req, res) {
  const { name, email, password, phone } = req.body || {};

  if (!cleanText(name) || !cleanText(email) || !cleanText(password)) {
    return json(res, 400, { error: 'Name, email, and password are required.' });
  }

  if (cleanText(password).length < 8) {
    return json(res, 400, { error: 'Password must be at least 8 characters.' });
  }

  await ensureUsersTable();

  // Check duplicate email
  const existing = await dbQuery('SELECT id FROM users WHERE email = $1 LIMIT 1', [cleanText(email).toLowerCase()]);
  if (existing.length > 0) {
    return json(res, 409, { error: 'An account with this email already exists.' });
  }

  const id = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
  const passwordHash = await hashPassword(cleanText(password));

  const rows = await dbQuery(`
    INSERT INTO users (id, email, name, phone, password_hash, role)
    VALUES ($1, $2, $3, $4, $5, 'user')
    RETURNING id, email, name, phone, role, is_active, created_at
  `, [id, cleanText(email).toLowerCase(), cleanText(name), cleanText(phone), passwordHash]);

  const user = rows[0];
  const token = issueUserToken({ ...user, permission_overrides: null });

  setUserCookie(res, token);
  return json(res, 201, { success: true, user: sanitizeUser(user) });
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body || {};

  if (!cleanText(email) || !cleanText(password)) {
    return json(res, 400, { error: 'Email and password are required.' });
  }

  await ensureUsersTable();

  const rows = await dbQuery(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [cleanText(email).toLowerCase()]
  );

  const user = rows[0];
  if (!user) {
    return json(res, 401, { error: 'Invalid email or password.' });
  }

  if (!user.is_active) {
    return json(res, 403, { error: 'Your account has been deactivated. Contact support.' });
  }

  const valid = await verifyPassword(cleanText(password), user.password_hash);
  if (!valid) {
    return json(res, 401, { error: 'Invalid email or password.' });
  }

  const token = issueUserToken(user);
  setUserCookie(res, token);

  return json(res, 200, { success: true, user: sanitizeUser(user) });
}

export function handleUserLogout(res) {
  setUserCookie(res, '', 0);
  return json(res, 200, { success: true });
}

export async function handleGetCurrentUser(req, res) {
  const userPayload = getUserFromRequest(req);
  if (!userPayload) {
    return json(res, 200, { user: null });
  }

  // Re-fetch fresh data from DB to ensure user is still active
  await ensureUsersTable();
  const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [userPayload.sub]);
  if (!rows[0] || !rows[0].is_active) {
    setUserCookie(res, '', 0);
    return json(res, 200, { user: null });
  }

  return json(res, 200, { user: sanitizeUser(rows[0]) });
}

// ─── Utils ───────────────────────────────────────────────────────────────────

/** Strip sensitive fields before sending user object to client. */
export function sanitizeUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone || '',
    role: row.role,
    avatarUrl: row.avatar_url || null,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}
