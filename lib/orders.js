import crypto from 'node:crypto';
import { cleanText } from './http';
import { dbQuery, ensureOrdersTable, hasDatabase } from './db';

const normalizeItem = (item = {}) => {
  const quantity = Math.max(0, Number(item.quantity ?? item.qty ?? 0) || 0);
  const price = Number(item.price || 0);

  return {
    id: cleanText(item.id),
    name: cleanText(item.name),
    quantity,
    qty: quantity,
    price,
    lineTotal: Number(item.lineTotal ?? price * quantity),
  };
};

const parseItems = (value) => {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed.map(normalizeItem).filter((item) => item.quantity > 0) : [];
  } catch { return []; }
};

const normalizeOrder = (row) => ({
  id: row.id,
  source: row.source,
  status: row.status,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  customerAddress: row.customer_address,
  customerCity: row.customer_city || '',
  customerZip: row.customer_zip || '',
  customerNote: row.customer_note || '',
  itemsText: row.items_text,
  items: parseItems(row.items_json),
  totalAmount: Number(row.total_amount || 0),
  totalDisplay: row.total_display,
  customerEmailSkipped: Boolean(row.customer_email_skipped),
  adminNote: row.admin_note || '',
  paymentStatus: row.payment_status || 'unpaid',
  razorpayOrderId: row.razorpay_order_id || '',
  razorpayPaymentId: row.razorpay_payment_id || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export function buildOrderRecord(payload) {
  const orderLines = Array.isArray(payload.order_lines)
    ? payload.order_lines.map(normalizeItem).filter((item) => item.quantity > 0)
    : [];

  return {
    id: `SB-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`,
    source: cleanText(payload.source) || 'SoulfullBites Order',
    customerName: cleanText(payload.user_name),
    customerEmail: cleanText(payload.user_email),
    customerPhone: cleanText(payload.user_phone),
    customerAddress: cleanText(payload.user_address),
    customerCity: cleanText(payload.user_city),
    customerZip: cleanText(payload.user_zip),
    customerNote: cleanText(payload.user_note),
    itemsText: cleanText(payload.order_items),
    items: orderLines,
    totalAmount: Number(payload.order_total_value || 0),
    totalDisplay: cleanText(payload.order_total),
    razorpayOrderId: cleanText(payload.razorpay_order_id),
    paymentStatus: cleanText(payload.payment_status) || 'unpaid',
  };
}

export async function createOrder(order) {
  if (!hasDatabase()) return null;
  await ensureOrdersTable();

  const rows = await dbQuery(`
    INSERT INTO orders (
      id, source, customer_name, customer_email, customer_phone, customer_address, 
      customer_city, customer_zip, customer_note, items_text, items_json, 
      total_amount, total_display, razorpay_order_id, payment_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `, [
    order.id, order.source, order.customerName, order.customerEmail, order.customerPhone, 
    order.customerAddress, order.customerCity, order.customerZip, order.customerNote, 
    order.itemsText, JSON.stringify(order.items || []), order.totalAmount, 
    order.totalDisplay, order.razorpayOrderId, order.paymentStatus,
  ]);

  return rows[0] ? normalizeOrder(rows[0]) : null;
}

export async function markOrderCustomerEmail(orderId, customerEmailSkipped) {
  if (!hasDatabase()) return null;
  await ensureOrdersTable();
  const rows = await dbQuery(`
    UPDATE orders SET customer_email_skipped = $1, updated_at = NOW() WHERE id = $2 RETURNING *
  `, [Boolean(customerEmailSkipped), orderId]);
  return rows[0] ? normalizeOrder(rows[0]) : null;
}

export async function updatePaymentStatus(orderId, {
  expectedRazorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  status = 'paid',
}) {
  if (!hasDatabase()) return null;
  await ensureOrdersTable();
  const rows = await dbQuery(`
    UPDATE orders
    SET razorpay_payment_id = $1, razorpay_signature = $2, payment_status = $3, updated_at = NOW()
    WHERE id = $4 AND razorpay_order_id = $5
    RETURNING *
  `, [razorpayPaymentId, razorpaySignature, status, cleanText(orderId), cleanText(expectedRazorpayOrderId)]);
  return rows[0] ? normalizeOrder(rows[0]) : null;
}
