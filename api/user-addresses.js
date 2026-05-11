// GET    /api/user-addresses          → list addresses
// POST   /api/user-addresses          → add address
// PATCH  /api/user-addresses?id=      → update address
// DELETE /api/user-addresses?id=      → delete address

import { requireUser } from './_lib/user-auth.js';
import { dbQuery, ensureUsersTable } from './_lib/db.js';
import { json, cleanText, getRequestUrl } from './_lib/http.js';

export default async function handler(req, res) {
  if (!requireUser(req, res)) return;
  await ensureUsersTable();

  const userId = req._user.sub;
  const url = getRequestUrl(req);
  const id = url.searchParams.get('id');

  if (req.method === 'GET') {
    const rows = await dbQuery(
      'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, id ASC',
      [userId]
    );
    return json(res, 200, { addresses: rows });
  }

  if (req.method === 'POST') {
    const { label, address, city, zip, isDefault } = req.body || {};
    if (!cleanText(address)) return json(res, 400, { error: 'Address is required.' });

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
    }

    const rows = await dbQuery(`
      INSERT INTO user_addresses (user_id, label, address, city, zip, is_default)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userId, cleanText(label) || 'Home', cleanText(address), cleanText(city), cleanText(zip), Boolean(isDefault)]);

    return json(res, 201, { address: rows[0] });
  }

  if (req.method === 'DELETE') {
    if (!id) return json(res, 400, { error: 'Address ID is required.' });
    await dbQuery('DELETE FROM user_addresses WHERE id = $1 AND user_id = $2', [id, userId]);
    return json(res, 200, { success: true });
  }

  if (req.method === 'PATCH') {
    if (!id) return json(res, 400, { error: 'Address ID is required.' });
    const { label, address, city, zip, isDefault } = req.body || {};

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
    }

    const rows = await dbQuery(`
      UPDATE user_addresses
      SET label = $1, address = $2, city = $3, zip = $4, is_default = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [cleanText(label), cleanText(address), cleanText(city), cleanText(zip), Boolean(isDefault), id, userId]);

    return json(res, 200, { address: rows[0] });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
