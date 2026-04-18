import { requireAdmin } from './_lib/auth.js';
import { json, getRequestUrl } from './_lib/http.js';
import { listOrders } from './_lib/orders.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  try {
    const url = getRequestUrl(req);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';
    const paymentStatus = url.searchParams.get('paymentStatus') || 'all';
    const sort = url.searchParams.get('sort') || 'created_at:desc';

    const orders = await listOrders({ search, status, paymentStatus, sort });

    return json(res, 200, { success: true, orders });
  } catch (error) {
    console.error('admin-orders failed', error);
    return json(res, 500, { error: 'Unable to load orders right now' });
  }
}
