// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — User JWT Auth Library (Node.js Version)
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { dbQuery, ensureUsersTable } from './db.js';
import { decodeUserToken, issueUserToken } from './auth-core.js';

const USER_COOKIE_NAME = 'soulfull_user_session';
const BCRYPT_ROUNDS = 12;

export { decodeUserToken, issueUserToken };

// ─── Cookie Management ───────────────────────────────────────────────────────

export async function setUserCookie(token, maxAge = 60 * 60 * 24 * 7) {
  const cookieStore = await cookies();
  if (!token) {
    cookieStore.delete(USER_COOKIE_NAME);
  } else {
    cookieStore.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

// ─── Request Auth ────────────────────────────────────────────────────────────

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  return await decodeUserToken(token);
}

/**
 * Strips sensitive fields before sending user object to client.
 */
export function sanitizeUser(row) {
  if (!row) return null;
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

// ─── Password Logic ──────────────────────────────────────────────────────────

export async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

export async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}
