import { NextResponse } from 'next/server';
import { getProducts, upsertProduct, deleteProduct } from '@/lib/products';
import { hasPermission } from '@/lib/permissions';

// ── GET: List Products ───────────────────────────────────────────────────────
export async function GET(request) {
  if (!(await hasPermission('products.view'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'name:asc';

  try {
    const products = await getProducts({ status, sort });
    return NextResponse.json(products);
  } catch (err) {
    console.error('List products error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// ── POST: Create/Update Product ──────────────────────────────────────────────
export async function POST(request) {
  if (!(await hasPermission('products.create')) && !(await hasPermission('products.edit'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const product = await upsertProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error('Upsert product error:', err);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

// ── DELETE: Delete Product ───────────────────────────────────────────────────
export async function DELETE(request) {
  if (!(await hasPermission('products.delete'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
