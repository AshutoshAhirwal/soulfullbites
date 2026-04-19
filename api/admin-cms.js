import { requireAdmin } from './_lib/auth.js';
import { batchUpdateContent } from './_lib/content.js';
import { getFaqs, upsertFaq, deleteFaq } from './_lib/faq.js';

/**
 * Admin CMS: content + FAQ management in one function.
 *
 * POST   /api/admin-cms                  - update site content (body: { updates: {...} })
 * GET    /api/admin-cms?section=faq      - list all FAQs
 * POST   /api/admin-cms?section=faq      - upsert a FAQ
 * DELETE /api/admin-cms?section=faq&id=X - delete a FAQ
 */
export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    // Determine section from query string
    const url = new URL(req.url || '/', `http://localhost`);
    const section = url.searchParams.get('section');

    // --- FAQ routes ---
    if (section === 'faq') {
      if (req.method === 'GET') {
        const faqs = await getFaqs(true);
        return res.status(200).json(faqs);
      }
      if (req.method === 'POST') {
        await upsertFaq(req.body);
        return res.status(200).json({ success: true });
      }
      if (req.method === 'DELETE') {
        const id = url.searchParams.get('id') || req.query?.id;
        await deleteFaq(id);
        return res.status(200).json({ success: true });
      }
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- Site Content routes (default) ---
    if (req.method === 'POST') {
      const { updates } = req.body || {};
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'Invalid updates payload' });
      }
      await batchUpdateContent(updates);
      return res.status(200).json({ success: true, message: 'Content updated successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('admin-cms error:', err);
    return res.status(500).json({ error: err.message || 'Operation failed' });
  }
}
