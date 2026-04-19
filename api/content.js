import { getContent } from './_lib/content.js';
import { getFaqs, seedFaqs } from './_lib/faq.js';

/**
 * Public data endpoint — no auth required.
 * GET /api/content           - site content (CMS)
 * GET /api/content?section=faq  - FAQ list
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const section = url.searchParams.get('section');

    if (section === 'faq') {
      await seedFaqs();
      const faqs = await getFaqs();
      return res.status(200).json(faqs);
    }

    const data = await getContent();
    return res.status(200).json(data);
  } catch (err) {
    console.error('content handler error:', err);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}
