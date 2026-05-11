import { NextResponse } from 'next/server';
import { dbQuery, ensureUsersTable } from '@/lib/db';
import { hashPassword } from '@/lib/user-auth';
import { hasPermission } from '@/lib/permissions';
import crypto from 'node:crypto';

// ── GET: List Users ──────────────────────────────────────────────────────────
export async function GET(request) {
  if (!(await hasPermission('users.view'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || 'all';
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'created_at:desc';
  const dateFilter = searchParams.get('dateFilter') || 'all';

  try {
    await ensureUsersTable();
    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search.trim()}%`);
      conditions.push(`(name ILIKE $${values.length} OR email ILIKE $${values.length})`);
    }
    if (role && role !== 'all') {
      values.push(role);
      conditions.push(`role = $${values.length}`);
    }
    if (status && status !== 'all') {
      values.push(status === 'active');
      conditions.push(`is_active = $${values.length}`);
    }
    if (dateFilter && dateFilter !== 'all') {
      if (dateFilter === 'today') conditions.push(`created_at >= CURRENT_DATE`);
      else if (dateFilter === 'week') conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
      else if (dateFilter === 'month') conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);
    }

    let orderBy = 'created_at DESC';
    const [sortField, sortDir] = sort.split(':');
    if (sortField === 'name') orderBy = `name ${sortDir === 'asc' ? 'ASC' : 'DESC'}`;
    else if (sortField === 'created_at') orderBy = `created_at ${sortDir === 'asc' ? 'ASC' : 'DESC'}`;

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await dbQuery(
      `SELECT id, email, name, phone, role, is_active, avatar_url, created_at, updated_at FROM users ${where} ORDER BY ${orderBy} LIMIT 200`,
      values
    );

    return NextResponse.json({ success: true, users: rows });
  } catch (err) {
    console.error('List users error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// ── POST: Create User ────────────────────────────────────────────────────────
export async function POST(request) {
  if (!(await hasPermission('users.create'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role = 'user', phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await ensureUsersTable();
    const existing = await dbQuery('SELECT id FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newId = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    const passwordHash = await hashPassword(password.trim());

    const rows = await dbQuery(`
      INSERT INTO users (id, email, name, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, phone, role, is_active, created_at
    `, [newId, email.toLowerCase().trim(), name.trim(), phone?.trim() || '', passwordHash, role]);

    return NextResponse.json({ success: true, user: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// ── PATCH: Update User ───────────────────────────────────────────────────────
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

  // Permissions check: must be admin OR editing own profile (but role changes are admin-only)
  const isEditingRoles = (await request.clone().json()).role !== undefined;
  if (isEditingRoles && !(await hasPermission('users.manage_roles'))) {
     return NextResponse.json({ error: 'Permission denied for role updates' }, { status: 403 });
  }
  
  if (!(await hasPermission('users.edit'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { role, isActive, permissionOverrides } = body;

    const fields = [];
    const values = [];

    if (role) {
      values.push(role);
      fields.push(`role = $${values.length}`);
    }
    if (isActive !== undefined) {
      values.push(Boolean(isActive));
      fields.push(`is_active = $${values.length}`);
    }
    if (permissionOverrides !== undefined) {
      values.push(JSON.stringify(permissionOverrides));
      fields.push(`permission_overrides = $${values.length}`);
    }

    if (fields.length === 0) return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    
    values.push(id);
    const rows = await dbQuery(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING id, email, name, role, is_active, permission_overrides, created_at`,
      values
    );

    if (!rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Update user error:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// ── DELETE: Remove User ──────────────────────────────────────────────────────
export async function DELETE(request) {
  if (!(await hasPermission('users.delete'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

  try {
    await dbQuery('DELETE FROM users WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
