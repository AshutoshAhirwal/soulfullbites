export const SESSION_COOKIE_NAME = 'soulfull_admin_session';

export const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

export const json = (res, statusCode, payload) => res.status(statusCode).json(payload);

export function parseCookies(req) {
  const cookieHeader = req?.headers?.cookie || '';

  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) {
        return cookies;
      }

      const key = decodeURIComponent(part.slice(0, separatorIndex).trim());
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      cookies[key] = value;
      return cookies;
    }, {});
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.httpOnly) {
    parts.push('HttpOnly');
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  if (options.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function getRequestUrl(req) {
  const host = req?.headers?.host || 'localhost';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return new URL(req?.url || '/', `${protocol}://${host}`);
}
