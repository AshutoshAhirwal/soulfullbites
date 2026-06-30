import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/user-auth';
import { dbQuery, ensureUsersTable } from '@/lib/db';
import { cleanText } from '@/lib/http';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUsersTable();

    const rows = await dbQuery(
      'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, id ASC',
      [user.sub]
    );
    return NextResponse.json({ addresses: rows });
  } catch (err) {
    console.error('Failed to get customer addresses:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { label, address, city, zip, isDefault } = await request.json();
    if (!cleanText(address)) {
      return NextResponse.json({ error: 'Address is required.' }, { status: 400 });
    }

    await ensureUsersTable();

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.sub]);
    }

    const rows = await dbQuery(`
      INSERT INTO user_addresses (user_id, label, address, city, zip, is_default)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user.sub, cleanText(label) || 'Home', cleanText(address), cleanText(city), cleanText(zip), Boolean(isDefault)]);

    return NextResponse.json({ address: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Failed to add address:', err);
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required.' }, { status: 400 });
    }

    await ensureUsersTable();

    await dbQuery('DELETE FROM user_addresses WHERE id = $1 AND user_id = $2', [id, user.sub]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete address:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Address ID is required.' }, { status: 400 });
    }

    const { label, address, city, zip, isDefault } = await request.json();
    await ensureUsersTable();

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.sub]);
    }

    const rows = await dbQuery(`
      UPDATE user_addresses
      SET label = $1, address = $2, city = $3, zip = $4, is_default = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [cleanText(label), cleanText(address), cleanText(city), cleanText(zip), Boolean(isDefault), id, user.sub]);

    return NextResponse.json({ address: rows[0] });
  } catch (err) {
    console.error('Failed to update address:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
