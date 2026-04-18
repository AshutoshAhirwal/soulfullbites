import { requireAdmin } from './_lib/auth.js';
import { getFaqs, upsertFaq, deleteFaq } from './_lib/faq.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    if (req.method === 'GET') {
      const faqs = await getFaqs(true);
      return res.status(200).json(faqs);
    }

    if (req.method === 'POST') {
      await upsertFaq(req.body);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await deleteFaq(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Operation failed' });
  }
}
