import { NextResponse } from 'next/server';
import { listOrders, updateOrder } from '@/lib/orders';
import { hasPermission } from '@/lib/permissions';

// ── GET: List Orders ─────────────────────────────────────────────────────────
export async function GET(request) {
  if (!(await hasPermission('orders.view'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const paymentStatus = searchParams.get('paymentStatus') || 'all';
  const sort = searchParams.get('sort') || 'created_at:desc';
  const dateFilter = searchParams.get('dateFilter') || 'all';

  try {
    const orders = await listOrders({ search, status, paymentStatus, sort, dateFilter });
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error('List orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ── PATCH: Update Order ──────────────────────────────────────────────────────
export async function PATCH(request) {
  if (!(await hasPermission('orders.update_status'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status, admin_note } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await updateOrder(id, {
      status,
      adminNote: admin_note,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
