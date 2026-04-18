import { submitReview, getPublicReviews } from './_lib/reviews.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reviews = await getPublicReviews();
      return res.status(200).json({ success: true, reviews });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { orderId, customerName, rating, comment } = req.body;

      if (!orderId || !customerName || !rating || !comment) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const review = await submitReview({ orderId, customerName, rating, comment });
      return res.status(201).json({ success: true, review });
    } catch (error) {
      return res.status(error.message === 'Invalid Order ID' ? 404 : 500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
