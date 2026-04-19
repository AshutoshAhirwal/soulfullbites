import { requireAdmin } from './_lib/auth.js';
import { dbQuery, ensureOrdersTable } from './_lib/db.js';

/**
 * POST /api/admin-upload
 * Accepts: { base64: "data:image/jpeg;base64,...", name: "filename.jpg" }
 * Returns: { success: true, filename: "product_xyz_123.jpeg", path: "/api/media/123" }
 *
 * Images are stored in the `media` table in the database.
 * This avoids Vercel's read-only filesystem limitation.
 */
export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64, name } = req.body || {};
    if (!base64 || !base64.startsWith('data:image/')) {
      return res.status(400).json({ error: 'No valid image data provided' });
    }

    // Validate size — compressed images should be well under 300KB
    const base64Data = base64.split(',')[1] || '';
    const sizeBytes = Math.ceil((base64Data.length * 3) / 4);
    const MAX_BYTES = 400 * 1024; // 400KB limit after client-side compression
    if (sizeBytes > MAX_BYTES) {
      return res.status(413).json({ error: `Image too large after compression (${Math.round(sizeBytes / 1024)}KB). Please use a smaller image.` });
    }

    await ensureOrdersTable();

    // Ensure media table exists
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        original_name TEXT,
        data TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Insert and return the new ID
    const result = await dbQuery(
      'INSERT INTO media (original_name, data) VALUES ($1, $2) RETURNING id',
      [name || 'upload', base64]
    );

    const mediaId = result[0]?.id || result.rows?.[0]?.id;
    const cleanName = (name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const filename = `media_${mediaId}_${cleanName}`;

    return res.status(200).json({
      success: true,
      filename,
      path: `/api/media/${mediaId}`,
      mediaId,
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
