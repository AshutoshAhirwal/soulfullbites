import { requireAdmin } from './_lib/auth.js';

// This endpoint is deprecated. Use /api/admin-upload instead.
export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  return res.status(410).json({ error: 'This endpoint is deprecated. Use /api/admin-upload.' });
}
