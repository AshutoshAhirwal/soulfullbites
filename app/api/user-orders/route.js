import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/user-auth';
import { dbQuery, ensureOrdersTable, ensureUsersTable } from '@/lib/db';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.sub;
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';
    const isStaffOrOwner = user.role === 'ashu' || user.role === 'staff';

    await ensureUsersTable();
    await ensureOrdersTable();

    // If owner (ashu) or staff, show all orders so they see all shop orders in dashboard.
    // For regular customers, match by user_id or customer_email (case-insensitive).
    let query = `
      SELECT *
      FROM orders
      WHERE user_id = $1 OR LOWER(customer_email) = $2
      ORDER BY created_at DESC
      LIMIT 50
    `;
    let params = [userId, userEmail];

    if (isStaffOrOwner) {
      query = `
        SELECT *
        FROM orders
        ORDER BY created_at DESC
        LIMIT 50
      `;
      params = [];
    }

    const rows = await dbQuery(query, params);

    const orders = rows.map((r) => ({
      id: r.id,
      status: r.status,
      paymentStatus: r.payment_status,
      itemsText: r.items_text,
      items: (() => { try { return JSON.parse(r.items_json); } catch { return []; } })(),
      totalDisplay: r.total_display,
      totalAmount: Number(r.total_amount),
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Failed to get customer orders:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
