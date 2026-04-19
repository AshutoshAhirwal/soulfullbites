import { requireAdmin } from './_lib/auth.js';
import { json, getRequestUrl, cleanText } from './_lib/http.js';
import { listOrders, updateOrder } from './_lib/orders.js';

// GET  /api/admin-orders          - list orders
// PATCH /api/admin-orders         - update an order (replaces admin-order-update)
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) {
    return;
  }

  try {
    if (req.method === 'GET') {
      const url = getRequestUrl(req);
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || 'all';
      const paymentStatus = url.searchParams.get('paymentStatus') || 'all';
      const sort = url.searchParams.get('sort') || 'created_at:desc';
      const orders = await listOrders({ search, status, paymentStatus, sort });
      return json(res, 200, { success: true, orders });
    }

    if (req.method === 'PATCH') {
      const orderId = cleanText(req?.body?.id);
      if (!orderId) return json(res, 400, { error: 'Order id is required' });
      const order = await updateOrder(orderId, {
        status: req?.body?.status,
        adminNote: req?.body?.admin_note,
      });
      if (!order) return json(res, 404, { error: 'Order not found' });
      return json(res, 200, { success: true, order });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('admin-orders failed', error);
    return json(res, 500, { error: 'Unable to process order request' });
  }
}
