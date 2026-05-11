import { NextResponse } from 'next/server';
import { dbQuery, ensureOrdersTable, ensureUsersTable } from '@/lib/db';
import { batchUpdateContent } from '@/lib/content';
import { hasPermission } from '@/lib/permissions';
import { hashPassword } from '@/lib/user-auth';
import crypto from 'node:crypto';

// ── GET HANDLER ─────────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  const { module } = await params;

  // 1. ORDERS MODULE
  if (module === 'orders') {
    if (!(await hasPermission('orders.view'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      await ensureOrdersTable();
      const { searchParams } = new URL(request.url);
      const status = searchParams.get('status') || 'all';
      const paymentStatus = searchParams.get('paymentStatus') || 'all';
      const sort = searchParams.get('sort') || 'created_at:desc';
      const dateFilter = searchParams.get('dateFilter') || 'all';

      const conditions = [];
      const values = [];

      if (status !== 'all') {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }
      if (paymentStatus !== 'all') {
        values.push(paymentStatus);
        conditions.push(`payment_status = $${values.length}`);
      }
      if (dateFilter === 'today') conditions.push(`created_at >= CURRENT_DATE`);
      else if (dateFilter === 'week') conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
      else if (dateFilter === 'month') conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);

      const [sortField, sortDir] = sort.split(':');
      const orderBy = sortField === 'total_amount' ? `total_amount ${sortDir === 'asc' ? 'ASC' : 'DESC'}` : `created_at ${sortDir === 'asc' ? 'ASC' : 'DESC'}`;
      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      
      const rows = await dbQuery(`SELECT * FROM orders ${where} ORDER BY ${orderBy} LIMIT 500`, values);
      const orders = rows.map(r => ({
        id: r.id,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        customerPhone: r.customer_phone,
        customerAddress: r.customer_address,
        totalAmount: r.total_amount,
        status: r.status,
        paymentStatus: r.payment_status,
        items: typeof r.items_json === 'string' ? JSON.parse(r.items_json) : (r.items_json || []),
        createdAt: r.created_at
      }));
      return NextResponse.json({ success: true, orders });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  // 2. PRODUCTS MODULE
  if (module === 'products') {
    if (!(await hasPermission('products.view'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const rows = await dbQuery('SELECT * FROM products ORDER BY name ASC');
      return NextResponse.json(rows);
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  // 3. USERS MODULE
  if (module === 'users') {
    if (!(await hasPermission('users.view'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      await ensureUsersTable();
      const rows = await dbQuery('SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC');
      return NextResponse.json({ success: true, users: rows });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── POST HANDLER ────────────────────────────────────────────────────────────
export async function POST(request, { params }) {
  const { module } = await params;

  // 1. CONTENT MODULE
  if (module === 'content') {
    if (!(await hasPermission('cms.edit'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const { updates } = await request.json();
      await batchUpdateContent(updates);
      return NextResponse.json({ success: true });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  // 2. PRODUCTS MODULE (SAVE)
  if (module === 'products') {
    if (!(await hasPermission('products.edit'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const p = await request.json();
      const existing = await dbQuery('SELECT id FROM products WHERE id = $1', [p.id]);
      if (existing.length > 0) {
        await dbQuery(`UPDATE products SET name=$1, price=$2, is_active=$3, description=$4, image_slug=$5, ingredients=$6 WHERE id=$7`,
          [p.name, p.price, p.is_active, p.description, p.image_slug, p.ingredients || '', p.id]);
      } else {
        await dbQuery(`INSERT INTO products (id, name, price, is_active, description, image_slug, ingredients) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [p.id, p.name, p.price, p.is_active, p.description, p.image_slug, p.ingredients || '']);
      }
      return NextResponse.json({ success: true });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  // 3. UPLOAD MODULE
  if (module === 'upload') {
    if (!(await hasPermission('media.upload'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const { base64, name } = await request.json();
      const result = await dbQuery('INSERT INTO media (original_name, data) VALUES ($1, $2) RETURNING id', [name || 'upload', base64]);
      const mediaId = result[0]?.id;
      return NextResponse.json({ success: true, path: `/api/media/${mediaId}`, mediaId });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  // 4. FAQ MODULE
  if (module === 'faq') {
    if (!(await hasPermission('cms.edit'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const f = await request.json();
      const existing = await dbQuery('SELECT id FROM faq_items WHERE id = $1', [f.id]);
      if (existing.length > 0) {
        await dbQuery(`UPDATE faq_items SET category=$1, question=$2, answer=$3, sort_order=$4 WHERE id=$5`, [f.category, f.question, f.answer, f.sort_order, f.id]);
      } else {
        await dbQuery(`INSERT INTO faq_items (id, category, question, answer, sort_order) VALUES ($1,$2,$3,$4,$5)`, [f.id, f.category, f.question, f.answer, f.sort_order]);
      }
      return NextResponse.json({ success: true });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── PATCH HANDLER ───────────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  const { module } = await params;

  if (module === 'orders') {
    if (!(await hasPermission('orders.edit'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    try {
      const { id, status } = await request.json();
      await dbQuery('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
      return NextResponse.json({ success: true });
    } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}

// ── DELETE HANDLER ──────────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  const { module } = await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (module === 'products') {
    if (!(await hasPermission('products.delete'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    await dbQuery('DELETE FROM products WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  }

  if (module === 'faq') {
    if (!(await hasPermission('cms.edit'))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    await dbQuery('DELETE FROM faq_items WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Module not found' }, { status: 404 });
}
