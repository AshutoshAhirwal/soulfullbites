// Admin — Users CRUD
// GET    /api/admin-users         → list all users       (users.view)
// POST   /api/admin-users         → create user          (users.create)
// PATCH  /api/admin-users?id=     → edit role/status     (users.edit)
// DELETE /api/admin-users?id=     → delete user          (users.delete)

import { requireAdmin } from './_lib/auth.js';
import { json, cleanText, getRequestUrl } from './_lib/http.js';
import { dbQuery, ensureUsersTable } from './_lib/db.js';
import { hashPassword, sanitizeUser } from './_lib/user-auth.js';
import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  await ensureUsersTable();

  const url = getRequestUrl(req);
  const id = url.searchParams.get('id');

  // ── GET: list all users ─────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const search = cleanText(url.searchParams.get('search'));
    const roleFilter = cleanText(url.searchParams.get('role'));
    const statusFilter = cleanText(url.searchParams.get('status'));
    const sort = cleanText(url.searchParams.get('sort')) || 'created_at:desc';
    const dateFilter = cleanText(url.searchParams.get('dateFilter'));

    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }
    if (roleFilter && roleFilter !== 'all') {
      values.push(roleFilter);
      conditions.push(`role = $${values.length}`);
    }
    if (statusFilter && statusFilter !== 'all') {
      values.push(statusFilter === 'active');
      conditions.push(`is_active = $${values.length}`);
    }
    if (dateFilter && dateFilter !== 'all') {
      if (dateFilter === 'today') {
        conditions.push(`created_at >= CURRENT_DATE`);
      } else if (dateFilter === 'week') {
        conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
      } else if (dateFilter === 'month') {
        conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);
      }
    }

    let orderBy = 'created_at DESC';
    if (sort === 'created_at:asc') orderBy = 'created_at ASC';
    else if (sort === 'name:asc') orderBy = 'name ASC';

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await dbQuery(
      `SELECT id, email, name, phone, role, is_active, avatar_url, created_at, updated_at FROM users ${where} ORDER BY ${orderBy} LIMIT 200`,
      values
    );
    return json(res, 200, { users: rows });
  }

  // ── POST: create a new user account ─────────────────────────────────────────
  if (req.method === 'POST') {
    const { name, email, password, role = 'user', phone } = req.body || {};
    if (!cleanText(name) || !cleanText(email) || !cleanText(password)) {
      return json(res, 400, { error: 'Name, email, and password are required.' });
    }

    const allowed = ['ashu', 'staff', 'user'];
    if (!allowed.includes(cleanText(role))) {
      return json(res, 400, { error: 'Invalid role.' });
    }

    const existing = await dbQuery('SELECT id FROM users WHERE email = $1 LIMIT 1', [cleanText(email).toLowerCase()]);
    if (existing.length > 0) return json(res, 409, { error: 'Email already exists.' });

    const newId = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    const passwordHash = await hashPassword(cleanText(password));

    const rows = await dbQuery(`
      INSERT INTO users (id, email, name, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, phone, role, is_active, created_at
    `, [newId, cleanText(email).toLowerCase(), cleanText(name), cleanText(phone), passwordHash, cleanText(role)]);

    return json(res, 201, { user: rows[0] });
  }

  // ── PATCH: update role, status, or permission overrides ─────────────────────
  if (req.method === 'PATCH') {
    if (!id) return json(res, 400, { error: 'User ID is required.' });
    const { role, isActive, permissionOverrides } = req.body || {};

    const fields = [];
    const values = [];

    const allowed = ['ashu', 'staff', 'user'];
    if (role && allowed.includes(cleanText(role))) {
      values.push(cleanText(role));
      fields.push(`role = $${values.length}`);
    }
    if (isActive !== undefined) {
      values.push(Boolean(isActive));
      fields.push(`is_active = $${values.length}`);
    }
    if (permissionOverrides !== undefined) {
      values.push(JSON.stringify(permissionOverrides));
      fields.push(`permission_overrides = $${values.length}`);
    }

    if (fields.length === 0) return json(res, 400, { error: 'No updates provided.' });
    values.push(id);

    const rows = await dbQuery(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING id, email, name, role, is_active, permission_overrides, created_at`,
      values
    );
    if (!rows[0]) return json(res, 404, { error: 'User not found.' });
    return json(res, 200, { user: rows[0] });
  }

  // ── DELETE ───────────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!id) return json(res, 400, { error: 'User ID is required.' });
    await dbQuery('DELETE FROM users WHERE id = $1', [id]);
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
