import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, filename } = req.body;

    if (!imageData || !filename) {
      return res.status(400).json({ error: 'Missing imageData or filename' });
    }

    // Validate base64 data
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Extract base64 string
    const base64String = imageData.split(',')[1];
    if (!base64String) {
      return res.status(400).json({ error: 'Invalid base64 data' });
    }

    // Convert base64 to buffer to get actual size
    const buffer = Buffer.from(base64String, 'base64');

    // Validate image size (max 1.5MB)
    const MAX_SIZE = 1.5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(413).json({ error: `Image too large (${Math.round(buffer.length / 1024 / 1024)}MB, max 1.5MB)` });
    }

    // Return the optimized data URL - for Vercel, we can't write files
    // but we can store data URLs in the database (PostgreSQL TEXT is unlimited)
    return res.status(200).json({ 
      success: true, 
      filename: `image_${Date.now()}`,
      url: imageData, // Return the compressed data URL
      size: buffer.length
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
