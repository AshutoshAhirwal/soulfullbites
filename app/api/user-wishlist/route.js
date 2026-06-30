import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/user-auth';
import { dbQuery, ensureUsersTable, ensureOrdersTable } from '@/lib/db';
import { cleanText } from '@/lib/http';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUsersTable();
    await ensureOrdersTable(); // ensures products table exists

    const rows = await dbQuery(`
      SELECT w.product_id, w.added_at, p.name, p.price, p.image_slug, p.description
      FROM user_wishlist w
      LEFT JOIN products p ON p.id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `, [user.sub]);

    return NextResponse.json({ wishlist: rows });
  } catch (err) {
    console.error('Failed to get wishlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!cleanText(productId)) {
      return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
    }

    await ensureUsersTable();
    await ensureOrdersTable();

    await dbQuery(`
      INSERT INTO user_wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [user.sub, cleanText(productId)]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Failed to add to wishlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
    }

    await ensureUsersTable();

    await dbQuery(
      'DELETE FROM user_wishlist WHERE user_id = $1 AND product_id = $2',
      [user.sub, cleanText(productId)]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete from wishlist:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
