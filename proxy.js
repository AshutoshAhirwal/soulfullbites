import { NextResponse } from 'next/server';
import { decodeUserToken } from './lib/auth-core';

const ADMIN_ROUTES = ['/admin', '/api/admin'];
const PUBLIC_API_ROUTES = ['/api/user-auth', '/api/content', '/api/products'];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow public API routes
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Protect Admin & Management Routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('soulfull_user_session')?.value;
    const user = token ? await decodeUserToken(token) : null;

    // Redirect to login if not authenticated (except for the login page itself)
    if (!user && pathname !== '/admin/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Check for admin/staff roles
    if (user && !['ashu', 'staff'].includes(user.role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/'; // Kick back to home if no permission
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
  ],
};
