import { NextResponse } from 'next/server';
import { getProducts, seedProducts } from '@/lib/products';

export async function GET(request) {
  try {
    await seedProducts(); // Ensure defaults exist
    const products = await getProducts({ status: 'active' });
    
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
