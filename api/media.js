import { dbQuery, ensureOrdersTable } from './_lib/db.js';

/**
 * GET /api/media/[id]
 * Serves a stored media item from the database.
 * The data is stored as a data: URL — we extract the binary and serve it as an image.
 */
export default async function handler(req, res) {
  const url = req.url || '';
  const segments = url.split('/').filter(Boolean);
  const id = segments[segments.length - 1]?.split('?')[0];

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid media ID' });
  }

  try {
    await ensureOrdersTable();

    const result = await dbQuery('SELECT data FROM media WHERE id = $1', [Number(id)]);
    const row = result[0] || result.rows?.[0];

    if (!row) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const dataUrl = row.data;
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return res.status(500).json({ error: 'Invalid stored media format' });
    }

    const [, mimeType, base64Data] = matches;
    const buffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', buffer.length);
    res.status(200).end(buffer);
  } catch (err) {
    console.error('Media fetch error:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch media' });
  }
}
