import { requireAdmin } from './_lib/auth.js';
import { json, cleanText } from './_lib/http.js';
import { updateOrder } from './_lib/orders.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  const orderId = cleanText(req?.body?.id);

  if (!orderId) {
    return json(res, 400, { error: 'Order id is required' });
  }

  try {
    const order = await updateOrder(orderId, {
      status: req?.body?.status,
      adminNote: req?.body?.admin_note,
    });

    if (!order) {
      return json(res, 404, { error: 'Order not found' });
    }

    return json(res, 200, { success: true, order });
  } catch (error) {
    console.error('admin-order-update failed', error);
    return json(res, 500, { error: 'Unable to update order right now' });
  }
}
