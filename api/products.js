import { getProducts, seedProducts } from './_lib/products.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await seedProducts(); // Ensure defaults exist
    const products = await getProducts();
    return res.status(200).json(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
