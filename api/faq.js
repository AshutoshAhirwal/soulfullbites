import { getFaqs, seedFaqs } from './_lib/faq.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await seedFaqs();
    const faqs = await getFaqs();
    return res.status(200).json(faqs);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
}
