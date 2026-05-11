// GET    /api/user-wishlist             → get wishlist items
// POST   /api/user-wishlist             → add product { productId }
// DELETE /api/user-wishlist?productId=  → remove product

import { requireUser } from './_lib/user-auth.js';
import { dbQuery, ensureUsersTable, ensureOrdersTable } from './_lib/db.js';
import { json, cleanText, getRequestUrl } from './_lib/http.js';

export default async function handler(req, res) {
  if (!requireUser(req, res)) return;
  await ensureUsersTable();
  await ensureOrdersTable(); // ensures products table exists

  const userId = req._user.sub;
  const url = getRequestUrl(req);

  if (req.method === 'GET') {
    const rows = await dbQuery(`
      SELECT w.product_id, w.added_at, p.name, p.price, p.image_slug, p.description
      FROM user_wishlist w
      LEFT JOIN products p ON p.id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `, [userId]);
    return json(res, 200, { wishlist: rows });
  }

  if (req.method === 'POST') {
    const { productId } = req.body || {};
    if (!cleanText(productId)) return json(res, 400, { error: 'productId is required.' });

    await dbQuery(`
      INSERT INTO user_wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [userId, cleanText(productId)]);

    return json(res, 201, { success: true });
  }

  if (req.method === 'DELETE') {
    const productId = url.searchParams.get('productId');
    if (!productId) return json(res, 400, { error: 'productId is required.' });

    await dbQuery(
      'DELETE FROM user_wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, cleanText(productId)]
    );
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
}
