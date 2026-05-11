import { NextResponse } from 'next/server';
import { dbQuery, ensureOrdersTable } from '@/lib/db';

/**
 * Public route to serve images stored in the DB.
 * GET /api/media/[id]
 */
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    await ensureOrdersTable();
    const rows = await dbQuery('SELECT data FROM media WHERE id = $1 LIMIT 1', [id]);
    const row = rows[0];

    if (!row || !row.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // data is stored as "data:image/jpeg;base64,..."
    const [header, base64Data] = row.data.split(',');
    const contentType = header.split(':')[1].split(';')[0];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (err) {
    console.error('Media fetch error:', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
