// GET   /api/user-profile   → Get own profile
// PATCH /api/user-profile   → Update name/phone/avatar OR change password
//   PATCH with body { section: 'password', currentPassword, newPassword }

import { requireUser, hashPassword, verifyPassword, issueUserToken, sanitizeUser } from './_lib/user-auth.js';
import { dbQuery, ensureUsersTable } from './_lib/db.js';
import { json, cleanText, serializeCookie } from './_lib/http.js';

const USER_COOKIE = 'soulfull_user_session';

export default async function handler(req, res) {
  if (!requireUser(req, res)) return;
  const userId = req._user.sub;
  await ensureUsersTable();

  // GET — fetch own profile
  if (req.method === 'GET') {
    const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
    if (!rows[0]) return json(res, 404, { error: 'User not found' });
    return json(res, 200, { user: sanitizeUser(rows[0]) });
  }

  // PATCH — update profile fields or password
  if (req.method === 'PATCH') {
    const { section, name, phone, currentPassword, newPassword } = req.body || {};

    if (section === 'password') {
      if (!cleanText(currentPassword) || !cleanText(newPassword)) {
        return json(res, 400, { error: 'Current and new passwords are required.' });
      }
      if (cleanText(newPassword).length < 8) {
        return json(res, 400, { error: 'New password must be at least 8 characters.' });
      }

      const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
      const user = rows[0];
      if (!user) return json(res, 404, { error: 'User not found.' });

      const valid = await verifyPassword(cleanText(currentPassword), user.password_hash);
      if (!valid) return json(res, 401, { error: 'Current password is incorrect.' });

      const newHash = await hashPassword(cleanText(newPassword));
      await dbQuery('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);
      return json(res, 200, { success: true });
    }

    // General profile update
    const updates = [];
    const values = [];

    if (cleanText(name)) {
      values.push(cleanText(name));
      updates.push(`name = $${values.length}`);
    }
    if (phone !== undefined) {
      values.push(cleanText(phone));
      updates.push(`phone = $${values.length}`);
    }

    if (updates.length === 0) return json(res, 400, { error: 'No updates provided.' });

    values.push(userId);
    const rows = await dbQuery(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows[0]) return json(res, 404, { error: 'User not found' });

    // Re-issue JWT with fresh name so the cookie stays current
    const newToken = issueUserToken(rows[0]);
    res.setHeader('Set-Cookie', serializeCookie(USER_COOKIE, newToken, {
      httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    }));

    return json(res, 200, { success: true, user: sanitizeUser(rows[0]) });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
