// GET   /api/admin-permissions  → Get all permission definitions + role defaults
// PATCH /api/admin-permissions  → Update a specific user's permission overrides

import { requireAdmin } from './_lib/auth.js';
import { json, cleanText, getRequestUrl } from './_lib/http.js';
import { dbQuery, ensureUsersTable } from './_lib/db.js';
import { ALL_PERMISSIONS, ROLE_DEFAULTS } from './_lib/permissions.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  await ensureUsersTable();

  // GET — return permission schema + role defaults
  if (req.method === 'GET') {
    return json(res, 200, {
      permissions: ALL_PERMISSIONS,
      roleDefaults: ROLE_DEFAULTS,
    });
  }

  // PATCH — update a staff user's permission_overrides
  // Body: { userId: string, permissionOverrides: { 'orders.delete': true, 'cms.edit': false } }
  if (req.method === 'PATCH') {
    const { userId, permissionOverrides } = req.body || {};
    if (!cleanText(userId)) return json(res, 400, { error: 'userId is required.' });
    if (typeof permissionOverrides !== 'object' || permissionOverrides === null) {
      return json(res, 400, { error: 'permissionOverrides must be an object.' });
    }

    // Validate keys
    const validKeys = new Set(ALL_PERMISSIONS.map((p) => p.key));
    for (const key of Object.keys(permissionOverrides)) {
      if (!validKeys.has(key)) {
        return json(res, 400, { error: `Unknown permission key: ${key}` });
      }
    }

    const rows = await dbQuery(
      'UPDATE users SET permission_overrides = $1, updated_at = NOW() WHERE id = $2 RETURNING id, role, permission_overrides',
      [JSON.stringify(permissionOverrides), cleanText(userId)]
    );

    if (!rows[0]) return json(res, 404, { error: 'User not found.' });
    return json(res, 200, { success: true, user: rows[0] });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
