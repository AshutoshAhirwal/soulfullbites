import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/user-auth';
import { dbQuery, ensureUsersTable } from '@/lib/db';
import { cleanText } from '@/lib/http';
import { checkRateLimit, sanitizeError } from '@/lib/security';
import { validateText } from '@/lib/validation';

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
    return NextResponse.json({ error: sanitizeError(err, 'addresses-get') }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: max 10 new addresses per hour per user
    if (!checkRateLimit(`addr_create_${user.sub}`, 10, 60 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { label, address, city, zip, isDefault } = body;

    // Validate field lengths
    const addressResult = validateText(address, 300);
    const cityResult    = validateText(city || '', 100);
    const zipResult     = validateText(zip || '', 20);
    const labelResult   = validateText(label || 'Home', 50);

    if (!addressResult.valid || !addressResult.value) {
      return NextResponse.json({ error: 'Address is required and must be 300 characters or fewer.' }, { status: 400 });
    }
    if (!cityResult.valid)  return NextResponse.json({ error: 'City must be 100 characters or fewer.' }, { status: 400 });
    if (!zipResult.valid)   return NextResponse.json({ error: 'ZIP code must be 20 characters or fewer.' }, { status: 400 });
    if (!labelResult.valid) return NextResponse.json({ error: 'Label must be 50 characters or fewer.' }, { status: 400 });

    await ensureUsersTable();

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.sub]);
    }

    const rows = await dbQuery(`
      INSERT INTO user_addresses (user_id, label, address, city, zip, is_default)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user.sub, labelResult.value || 'Home', addressResult.value, cityResult.value, zipResult.value, Boolean(isDefault)]);

    return NextResponse.json({ address: rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err, 'addresses-post') }, { status: 500 });
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

    // user_id = $2 enforces ownership — no IDOR possible
    await dbQuery('DELETE FROM user_addresses WHERE id = $1 AND user_id = $2', [id, user.sub]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err, 'addresses-delete') }, { status: 500 });
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

    const body = await request.json();
    const { label, address, city, zip, isDefault } = body;

    // Validate field lengths
    const addressResult = validateText(address || '', 300);
    const cityResult    = validateText(city || '', 100);
    const zipResult     = validateText(zip || '', 20);
    const labelResult   = validateText(label || '', 50);

    if (!addressResult.valid) return NextResponse.json({ error: 'Address must be 300 characters or fewer.' }, { status: 400 });
    if (!cityResult.valid)    return NextResponse.json({ error: 'City must be 100 characters or fewer.' }, { status: 400 });
    if (!zipResult.valid)     return NextResponse.json({ error: 'ZIP code must be 20 characters or fewer.' }, { status: 400 });
    if (!labelResult.valid)   return NextResponse.json({ error: 'Label must be 50 characters or fewer.' }, { status: 400 });

    await ensureUsersTable();

    if (isDefault) {
      await dbQuery('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.sub]);
    }

    // user_id = $7 enforces ownership — no IDOR possible
    const rows = await dbQuery(`
      UPDATE user_addresses
      SET label = $1, address = $2, city = $3, zip = $4, is_default = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [labelResult.value, addressResult.value, cityResult.value, zipResult.value, Boolean(isDefault), id, user.sub]);

    return NextResponse.json({ address: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err, 'addresses-patch') }, { status: 500 });
  }
}
