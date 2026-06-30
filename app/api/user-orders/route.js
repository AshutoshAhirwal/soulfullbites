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
    const userEmail = user.email;

    await ensureUsersTable();
    await ensureOrdersTable();

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

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Failed to get customer orders:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
