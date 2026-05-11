import { NextResponse } from 'next/server';
import { dbQuery, ensureUsersTable } from '@/lib/db';
import { 
  hashPassword, 
  verifyPassword, 
  issueUserToken, 
  setUserCookie, 
  getUserFromCookies, 
  sanitizeUser 
} from '@/lib/user-auth';
import { 
  checkRateLimit, 
  getClientIp, 
  checkHoneypot, 
  verifyHCaptcha, 
  checkOrigin 
} from '@/lib/security';
import crypto from 'node:crypto';

// ── GET: Check Session ───────────────────────────────────────────────────────
export async function GET() {
  const userPayload = await getUserFromCookies();
  if (!userPayload) return NextResponse.json({ user: null });

  try {
    await ensureUsersTable();
    const rows = await dbQuery('SELECT * FROM users WHERE id = $1 LIMIT 1', [userPayload.sub]);
    const user = rows[0];

    if (!user || !user.is_active) {
      await setUserCookie(null); // Clear invalid session
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (err) {
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 });
  }
}

// ── POST: Login ──────────────────────────────────────────────────────────────
export async function POST(request) {
  const ip = await getClientIp();
  if (!checkRateLimit(`login_${ip}`, 5)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await ensureUsersTable();
    const rows = await dbQuery('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase().trim()]);
    const user = rows[0];

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password.trim(), user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await issueUserToken(user);
    await setUserCookie(token);

    return NextResponse.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// ── PUT: Register ────────────────────────────────────────────────────────────
export async function PUT(request) {
  const ip = await getClientIp();
  if (!checkRateLimit(`reg_${ip}`, 3)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    // 1. Honeypot check
    if (!checkHoneypot(body)) {
      return NextResponse.json({ success: true, _bot: true }, { status: 201 });
    }

    // 2. hCaptcha check
    const captchaValid = await verifyHCaptcha(body.hcaptchaToken);
    if (!captchaValid) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
    }

    const { name, email, password, phone } = body;
    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json({ error: 'Invalid registration data' }, { status: 400 });
    }

    await ensureUsersTable();
    const existing = await dbQuery('SELECT id FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const id = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    const passwordHash = await hashPassword(password.trim());

    const rows = await dbQuery(`
      INSERT INTO users (id, email, name, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, 'user')
      RETURNING id, email, name, phone, role, is_active, created_at
    `, [id, email.toLowerCase().trim(), name.trim(), phone?.trim() || '', passwordHash]);

    const user = rows[0];
    const token = await issueUserToken({ ...user, permission_overrides: null });
    await setUserCookie(token);

    return NextResponse.json({ success: true, user: sanitizeUser(user) }, { status: 201 });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

// ── DELETE: Logout ───────────────────────────────────────────────────────────
export async function DELETE() {
  await setUserCookie(null);
  return NextResponse.json({ success: true });
}
