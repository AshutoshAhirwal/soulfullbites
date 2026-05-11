// GET /api/user-orders — fetch orders belonging to logged-in user

import { requireUser } from './_lib/user-auth.js';
import { dbQuery, ensureOrdersTable, ensureUsersTable } from './_lib/db.js';
import { json } from './_lib/http.js';

export default async function handler(req, res) {
  if (!requireUser(req, res)) return;
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  const userId = req._user.sub;
  const userEmail = req._user.email;

  await ensureUsersTable();
  await ensureOrdersTable();

  // Fetch by user_id (for orders placed while logged in) OR by email (legacy orders)
  const rows = await dbQuery(`
    SELECT *
    FROM orders
    WHERE user_id = $1 OR customer_email = $2
    ORDER BY created_at DESC
    LIMIT 50
  `, [userId, userEmail]);

  const orders = rows.map((r) => ({
    id: r.id,
    status: r.status,
    paymentStatus: r.payment_status,
    itemsText: r.items_text,
    items: (() => { try { return JSON.parse(r.items_json); } catch { return []; } })(),
    totalDisplay: r.total_display,
    totalAmount: Number(r.total_amount),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  return json(res, 200, { orders });
}
