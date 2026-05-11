/**
 * SoulfullBites — User Seed Script
 * Creates / updates the 3 test accounts.
 * 
 * Run:  node api/seed-users.mjs
 */

// Load .env.local manually (dotenv not installed)
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  });
} catch (e) { console.warn('Could not load .env.local:', e.message); }

import { neon, neonConfig } from '@neondatabase/serverless';
import { Resolver } from 'node:dns/promises';
import https from 'node:https';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

// ── DNS Patch (bypass ISP DNS) ─────────────────────────────────────────────────
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const dnsCache = new Map();

async function resolveHostname(hostname) {
  const cached = dnsCache.get(hostname);
  if (cached && Date.now() - cached.cachedAt < 300_000) return cached.ip;
  const addrs = await resolver.resolve4(hostname);
  const ip = addrs[0];
  dnsCache.set(hostname, { ip, cachedAt: Date.now() });
  return ip;
}

function nodeFetch(url, sni, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, port: 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      servername: sni, rejectUnauthorized: true,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ ok: res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve(JSON.parse(body)), text: () => Promise.resolve(body) });
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

async function patchedFetch(url, options = {}) {
  const u = new URL(url);
  if (!u.hostname.endsWith('.neon.tech')) return fetch(url, options);
  const ip = await resolveHostname(u.hostname);
  return nodeFetch(url.toString().replace(u.hostname, ip), u.hostname, options);
}

neonConfig.fetchFunction = patchedFetch;
// ─────────────────────────────────────────────────────────────────────────────

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error('❌ DATABASE_URL not set in .env.local'); process.exit(1); }

const sql = neon(DB_URL);
const BCRYPT_ROUNDS = 10; // 10 is fast enough for seeding; production uses 12

const USERS = [
  {
    role: 'ashu',
    name: 'Ashutosh',
    email: 'soulfullbites@yopmail.com',
    password: 'ashu#15798!.',
    note: '👑 Owner / Ashu role — full access',
  },
  {
    role: 'staff',
    name: 'Staff Demo',
    email: 'staff@soulfullbites.dev',
    password: 'Staff@Demo2026',
    note: '🔧 Staff role — limited permissions',
  },
  {
    role: 'user',
    name: 'Customer Demo',
    email: 'customer@soulfullbites.dev',
    password: 'User@Demo2026',
    note: '🛍️  Regular user/customer role',
  },
];

async function seed() {
  console.log('🔌 Connecting to Neon database...\n');

  // Ensure users table exists
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id              TEXT PRIMARY KEY,
      email           TEXT UNIQUE NOT NULL,
      name            TEXT NOT NULL,
      phone           TEXT,
      password_hash   TEXT NOT NULL,
      role            TEXT NOT NULL DEFAULT 'user',
      is_active       BOOLEAN NOT NULL DEFAULT TRUE,
      avatar_url      TEXT,
      permission_overrides TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  for (const u of USERS) {
    process.stdout.write(`  Hashing password for ${u.email}... `);
    const passwordHash = await bcrypt.hash(u.password, BCRYPT_ROUNDS);
    process.stdout.write('done.\n');

    const existing = await sql`SELECT id FROM users WHERE email = ${u.email} LIMIT 1`;
    if (existing.length > 0) {
      await sql`
        UPDATE users SET password_hash = ${passwordHash}, role = ${u.role}, is_active = TRUE, updated_at = NOW()
        WHERE email = ${u.email}
      `;
      console.log(`  ✅ Updated: ${u.role.padEnd(6)} | ${u.email}`);
    } else {
      const id = `USR-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
      await sql`
        INSERT INTO users (id, email, name, password_hash, role)
        VALUES (${id}, ${u.email}, ${u.name}, ${passwordHash}, ${u.role})
      `;
      console.log(`  ✅ Created: ${u.role.padEnd(6)} | ${u.email}`);
    }
  }

  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│               TEST CREDENTIALS                              │');
  console.log('├──────────┬──────────────────────────────────┬───────────────┤');
  console.log('│ Role     │ Email                            │ Password      │');
  console.log('├──────────┼──────────────────────────────────┼───────────────┤');
  USERS.forEach(u => {
    const role = u.role.padEnd(8);
    const email = u.email.padEnd(32);
    const pw = u.password.padEnd(13);
    console.log(`│ ${role} │ ${email} │ ${pw} │`);
  });
  console.log('└──────────┴──────────────────────────────────┴───────────────┘');
  console.log('\n✨ Seed complete!');
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
