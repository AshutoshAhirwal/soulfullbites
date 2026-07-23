import { NextResponse } from 'next/server';
import { dbQuery, ensureOrdersTable, ensureUsersTable } from '@/lib/db';
import { batchUpdateContent } from '@/lib/content';
import { hasPermission } from '@/lib/permissions';
import { hashPassword } from '@/lib/user-auth';
import { sanitizeError } from '@/lib/security';
import crypto from 'node:crypto';

// ── Utility: wraps permission check + try/catch into a single call ────────────
// Eliminates the repeated boilerplate across every module handler.
async function withHandler(permKey, context, handler) {
  if (!(await hasPermission(permKey))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    return await handler();
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err, context) }, { status: 500 });
  }
}

// ── Utility: builds an orders query from URL search params ───────────────────
function buildOrdersQuery(searchParams) {
  const status      = searchParams.get('status')        || 'all';
  const payment     = searchParams.get('paymentStatus') || 'all';
  const sort        = searchParams.get('sort')          || 'created_at:desc';
  const dateFilter  = searchParams.get('dateFilter')    || 'all';

  const conditions = [];
  const values = [];

  if (status !== 'all')  { values.push(status);  conditions.push(`status = $${values.length}`); }
  if (payment !== 'all') { values.push(payment);  conditions.push(`payment_status = $${values.length}`); }

  if (dateFilter === 'today') conditions.push(`created_at >= CURRENT_DATE`);
  else if (dateFilter === 'week')  conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
  else if (dateFilter === 'month') conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);

  const [sortField, sortDir] = sort.split(':');
  const dir = sortDir === 'asc' ? 'ASC' : 'DESC';
  const orderBy = sortField === 'total_amount' ? `total_amount ${dir}` : `created_at ${dir}`;
  const where   = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return { sql: `SELECT * FROM orders ${where} ORDER BY ${orderBy} LIMIT 500`, values };
}

// ── Utility: maps a raw orders DB row to the API shape ──────────────────────
function mapOrder(r) {
  return {
    id: r.id,
    customerName:    r.customer_name,
    customerEmail:   r.customer_email,
    customerPhone:   r.customer_phone,
    customerAddress: r.customer_address,
    totalAmount:     r.total_amount,
    status:          r.status,
    paymentStatus:   r.payment_status,
    items:           typeof r.items_json === 'string' ? JSON.parse(r.items_json) : (r.items_json || []),
    createdAt:       r.created_at,
  };
}

// ── Utility: upserts a product record ────────────────────────────────────────
async function upsertProduct(p) {
  const existing = await dbQuery('SELECT id FROM products WHERE id = $1', [p.id]);
  if (existing.length > 0) {
    await dbQuery(
      `UPDATE products SET name=$1, price=$2, is_active=$3, description=$4, image_slug=$5, ingredients=$6 WHERE id=$7`,
      [p.name, p.price, p.is_active, p.description, p.image_slug, p.ingredients || '', p.id]
    );
  } else {
    await dbQuery(
      `INSERT INTO products (id, name, price, is_active, description, image_slug, ingredients) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [p.id, p.name, p.price, p.is_active, p.description, p.image_slug, p.ingredients || '']
    );
  }
}

// ── Utility: upserts a FAQ item ──────────────────────────────────────────────
async function upsertFaq(f) {
  const existing = await dbQuery('SELECT id FROM faq_items WHERE id = $1', [f.id]);
  if (existing.length > 0) {
    await dbQuery(
      `UPDATE faq_items SET category=$1, question=$2, answer=$3, sort_order=$4 WHERE id=$5`,
      [f.category, f.question, f.answer, f.sort_order, f.id]
    );
  } else {
    await dbQuery(
      `INSERT INTO faq_items (id, category, question, answer, sort_order) VALUES ($1,$2,$3,$4,$5)`,
      [f.id, f.category, f.question, f.answer, f.sort_order]
    );
  }
}

// ── GET HANDLER ──────────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  const { module } = await params;
  const { searchParams } = new URL(request.url);

  if (module === 'orders') {
    return withHandler('orders.view', 'admin-orders-get', async () => {
      await ensureOrdersTable();
      const { sql, values } = buildOrdersQuery(searchParams);
      const rows = await dbQuery(sql, values);
      return NextResponse.json({ success: true, orders: rows.map(mapOrder) });
    });
  }

  if (module === 'products') {
    return withHandler('products.edit', 'admin-products-get', async () => {
      const rows = await dbQuery('SELECT * FROM products ORDER BY name ASC');
      return NextResponse.json(rows);
    });
  }

  if (module === 'users') {
    return withHandler('users.view', 'admin-users-get', async () => {
      await ensureUsersTable();
      const rows = await dbQuery('SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC');
      return NextResponse.json({ success: true, users: rows.map(u => ({ ...u, createdAt: u.created_at })) });
    });
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── POST HANDLER ─────────────────────────────────────────────────────────────
export async function POST(request, { params }) {
  const { module } = await params;

  if (module === 'content') {
    return withHandler('cms.edit', 'admin-content-post', async () => {
      const { updates } = await request.json();
      await batchUpdateContent(updates);
      return NextResponse.json({ success: true });
    });
  }

  if (module === 'products') {
    return withHandler('products.edit', 'admin-products-post', async () => {
      const p = await request.json();
      await upsertProduct(p);
      return NextResponse.json({ success: true });
    });
  }

  if (module === 'upload') {
    return withHandler('media.upload', 'admin-upload-post', async () => {
      const { base64, name } = await request.json();
      const result  = await dbQuery('INSERT INTO media (original_name, data) VALUES ($1, $2) RETURNING id', [name || 'upload', base64]);
      const mediaId = result[0]?.id;
      return NextResponse.json({ success: true, path: `/api/media/${mediaId}`, mediaId });
    });
  }

  if (module === 'faq') {
    return withHandler('cms.edit', 'admin-faq-post', async () => {
      const f = await request.json();
      await upsertFaq(f);
      return NextResponse.json({ success: true });
    });
  }

  if (module === 'users') {
    return withHandler('users.create', 'admin-users-post', async () => {
      const { email, name, password, role } = await request.json();
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
      await ensureUsersTable();
      const id           = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
      const passwordHash = await hashPassword(password);
      await dbQuery(
        `INSERT INTO users (id, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5)`,
        [id, email.toLowerCase().trim(), name || 'Staff', passwordHash, role || 'staff']
      );
      return NextResponse.json({ success: true, id });
    });
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── PATCH HANDLER ────────────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  const { module } = await params;

  if (module === 'orders') {
    return withHandler('orders.edit', 'admin-orders-patch', async () => {
      const { id, status } = await request.json();
      await dbQuery('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
      return NextResponse.json({ success: true });
    });
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── DELETE HANDLER ───────────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  const { module } = await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (module === 'products') {
    return withHandler('products.delete', 'admin-products-delete', async () => {
      await dbQuery('DELETE FROM products WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    });
  }

  if (module === 'faq') {
    return withHandler('cms.edit', 'admin-faq-delete', async () => {
      await dbQuery('DELETE FROM faq_items WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    });
  }

  if (module === 'users') {
    return withHandler('users.delete', 'admin-users-delete', async () => {
      await dbQuery('DELETE FROM users WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    });
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}
