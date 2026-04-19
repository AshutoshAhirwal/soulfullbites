import fs from 'fs';
import path from 'path';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64, name } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Extract the actual base64 data
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 string' });
    }

    const data = Buffer.from(matches[2], 'base64');
    const extension = matches[1].split('/')[1] || 'jpg';
    
    // Generate a clean, unique filename
    const cleanName = (name || 'upload').replace(/[^a-z0-0]/gi, '_').toLowerCase();
    const filename = `product_${cleanName}_${Date.now()}.${extension}`;
    
    // Define the path (target the public/assets directory)
    // In local dev, we write to the actual filesystem
    const targetDir = path.join(process.cwd(), 'public', 'assets');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, data);

    return res.status(200).json({ 
      success: true, 
      filename: filename,
      path: `/assets/${filename}` 
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: err.message || 'File write failed' });
  }
}
