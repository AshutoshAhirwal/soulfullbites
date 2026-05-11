import { NextResponse } from 'next/server';
import { dbQuery, ensureOrdersTable } from '@/lib/db';
import { hasPermission } from '@/lib/permissions';

export async function POST(request) {
  if (!(await hasPermission('media.upload'))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    const { base64, name } = await request.json();
    if (!base64 || !base64.startsWith('data:image/')) {
      return NextResponse.json({ error: 'No valid image data provided' }, { status: 400 });
    }

    const base64Data = base64.split(',')[1] || '';
    const sizeBytes = Math.ceil((base64Data.length * 3) / 4);
    const MAX_BYTES = 4 * 1024 * 1024; // 4MB

    if (sizeBytes > MAX_BYTES) {
      return NextResponse.json({ error: `Image too large (${Math.round(sizeBytes / 1024)}KB). Max 4MB.` }, { status: 413 });
    }

    await ensureOrdersTable();
    const result = await dbQuery(
      'INSERT INTO media (original_name, data) VALUES ($1, $2) RETURNING id',
      [name || 'upload', base64]
    );

    const mediaId = result[0]?.id || result.id || (result.rows && result.rows[0]?.id);

    if (!mediaId && mediaId !== 0) {
      throw new Error('Database did not return a valid Media ID');
    }

    const cleanName = (name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const filename = `media_${mediaId}_${cleanName}`;

    return NextResponse.json({
      success: true,
      filename,
      path: `/api/media/${mediaId}`,
      mediaId,
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
