import { dbQuery, ensureOrdersTable } from './db.js';
import { cleanText } from './http.js';
import { getOrderById } from './orders.js';

const normalizeName = (value) => cleanText(value).replace(/\s+/g, ' ').toLowerCase();

export async function submitReview({ orderId, customerName, rating, comment }) {
  await ensureOrdersTable();

  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error('Invalid Order ID');
  }

  if (order.paymentStatus !== 'paid') {
    throw new Error('Only paid orders can be reviewed');
  }

  if (order.status !== 'delivered') {
    throw new Error('You can review your order after it is marked delivered');
  }

  if (normalizeName(customerName) !== normalizeName(order.customerName)) {
    throw new Error('Reviewer name must match the order name');
  }

  const safeRating = Number(rating);
  if (!Number.isInteger(safeRating) || safeRating < 1 || safeRating > 5) {
    throw new Error('Please choose a valid rating');
  }

  const safeComment = cleanText(comment);
  if (safeComment.length < 12) {
    throw new Error('Please share a slightly longer review');
  }

  const existing = await dbQuery(`
    SELECT id
    FROM reviews
    WHERE order_id = $1
    LIMIT 1
  `, [order.id]);

  if (existing.length > 0) {
    throw new Error('A review has already been submitted for this order');
  }

  const rows = await dbQuery(`
    INSERT INTO reviews (order_id, customer_name, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [order.id, cleanText(customerName), safeRating, safeComment]);

  return {
    ...rows[0],
    is_verified: true,
  };
}

export async function getPublicReviews() {
  await ensureOrdersTable();

  const rows = await dbQuery(`
    SELECT
      reviews.id,
      reviews.customer_name,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      (
        reviews.order_id IS NOT NULL
        AND orders.payment_status = 'paid'
        AND orders.status = 'delivered'
        AND LOWER(TRIM(reviews.customer_name)) = LOWER(TRIM(orders.customer_name))
      ) AS is_verified
    FROM reviews
    LEFT JOIN orders
      ON orders.id = reviews.order_id
    ORDER BY reviews.created_at DESC
    LIMIT 50
  `);

  return rows;
}
