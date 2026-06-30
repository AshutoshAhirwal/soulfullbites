import { NextResponse } from 'next/server';
import { getUserFromCookies, sanitizeUser, hashPassword, verifyPassword, issueUserToken, setUserCookie } from '@/lib/user-auth';
import { dbQuery, ensureUsersTable } from '@/lib/db';
import { cleanText } from '@/lib/http';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUsersTable();

    const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [user.sub]);
    if (!rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: sanitizeUser(rows[0]) });
  } catch (err) {
    console.error('Failed to get customer profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userPayload = await getUserFromCookies();
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, name, phone, currentPassword, newPassword } = body;
    await ensureUsersTable();

    if (section === 'password') {
      if (!cleanText(currentPassword) || !cleanText(newPassword)) {
        return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
      }
      if (cleanText(newPassword).length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [userPayload.sub]);
      const user = rows[0];
      if (!user) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      const valid = await verifyPassword(cleanText(currentPassword), user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
      }

      const newHash = await hashPassword(cleanText(newPassword));
      await dbQuery('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userPayload.sub]);
      return NextResponse.json({ success: true });
    }

    // General profile update
    const updates = [];
    const values = [];

    if (cleanText(name)) {
      values.push(cleanText(name));
      updates.push(`name = $${values.length}`);
    }
    if (phone !== undefined) {
      values.push(cleanText(phone));
      updates.push(`phone = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided.' }, { status: 400 });
    }

    values.push(userPayload.sub);
    const rows = await dbQuery(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Re-issue JWT with fresh name so the cookie stays current
    const newToken = issueUserToken(rows[0]);
    await setUserCookie(newToken);

    return NextResponse.json({ success: true, user: sanitizeUser(rows[0]) });
  } catch (err) {
    console.error('Failed to update customer profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
