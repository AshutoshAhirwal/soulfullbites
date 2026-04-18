import { requireAdmin } from './_lib/auth.js';
import { batchUpdateContent } from './_lib/content.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updates } = req.body || {};
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Invalid updates payload' });
    }

    await batchUpdateContent(updates);
    return res.status(200).json({ success: true, message: 'Content updated successfully' });
  } catch (err) {
    console.error('Failed to update content:', err);
    return res.status(500).json({ error: err.message || 'Failed to update content' });
  }
}
