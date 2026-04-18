import { dbQuery, ensureOrdersTable } from './db.js';

export async function submitReview({ orderId, customerName, rating, comment }) {
  await ensureOrdersTable();

  // 1. Verify that order exists and is delivered
  const orderRows = await dbQuery('SELECT status FROM orders WHERE id = $1', [orderId]);
  if (orderRows.length === 0) {
    throw new Error('Invalid Order ID');
  }

  // Optional: Only allow reviews for delivered orders
  // if (orderRows[0].status !== 'delivered') {
  //   throw new Error('You can only review after receiving the product');
  // }

  const rows = await dbQuery(`
    INSERT INTO reviews (order_id, customer_name, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [orderId, customerName, rating, comment]);

  return rows[0];
}

export async function getPublicReviews() {
  await ensureOrdersTable();

  const rows = await dbQuery(`
    SELECT id, customer_name, rating, comment, created_at, order_id IS NOT NULL as is_verified
    FROM reviews
    ORDER BY created_at DESC
    LIMIT 50
  `);

  return rows;
}
