import { getContent } from './_lib/content.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getContent();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch content:', err);
    return res.status(500).json({ error: 'Failed to fetch site content' });
  }
}
