import { handleAdminLogin, handleAdminLogout } from './_lib/auth.js';
import { json } from './_lib/http.js';

// Handles both login (POST /api/admin-auth) and logout (DELETE /api/admin-auth)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleAdminLogin(req, res);
  }

  if (req.method === 'DELETE') {
    return handleAdminLogout(res);
  }

  return json(res, 405, { error: 'Method not allowed' });
}
