// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Auth Core (Edge Compatible)
// ─────────────────────────────────────────────────────────────────────────────

import * as jose from 'jose';

const USER_COOKIE_NAME = 'soulfull_user_session';
const JWT_EXPIRY = '7d';

function getJwtSecret() {
  // Use a fallback for build-time or if env is missing
  const secret = (process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET || 'fallback-secret-for-dev-only').trim();
  return secret;
}

export async function decodeUserToken(token) {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function issueUserToken(userRow) {
  const secret = new TextEncoder().encode(getJwtSecret());
  const payload = {
    sub: userRow.id,
    email: userRow.email,
    name: userRow.name,
    role: userRow.role,
    permissionOverrides: userRow.permission_overrides
      ? (typeof userRow.permission_overrides === 'string' ? JSON.parse(userRow.permission_overrides) : userRow.permission_overrides)
      : {},
  };

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret);
}
