import { requireAdmin } from './_lib/auth.js';
import { getProducts, upsertProduct, deleteProduct } from './_lib/products.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  // Prevent caching of product data
  res.setHeader('Cache-Control', 'no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const url = new URL(req.url || '/', 'http://localhost');

    if (req.method === 'GET') {
      const status = url.searchParams.get('status') || 'all';
      const sort = url.searchParams.get('sort') || 'name:asc';
      const products = await getProducts({ status, sort });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = await upsertProduct(req.body);
      return res.status(200).json({ success: true, product });
    }

    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id') || req.query?.id;
      if (!id) {
        return res.status(400).json({ error: 'Product id is required' });
      }

      await deleteProduct(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin product error:', err);
    return res.status(500).json({ error: err.message || 'Operation failed' });
  }
}
