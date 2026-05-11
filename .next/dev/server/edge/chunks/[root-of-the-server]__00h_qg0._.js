(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__00h_qg0._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'stream', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`stream`));
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'crypto', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`crypto`));
}),
"[project]/soulfullbites/lib/http.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SESSION_COOKIE_NAME",
    ()=>SESSION_COOKIE_NAME,
    "cleanText",
    ()=>cleanText,
    "getRequestUrl",
    ()=>getRequestUrl,
    "json",
    ()=>json,
    "parseCookies",
    ()=>parseCookies,
    "serializeCookie",
    ()=>serializeCookie
]);
const SESSION_COOKIE_NAME = 'soulfull_admin_session';
const cleanText = (value)=>typeof value === 'string' ? value.trim() : '';
const json = (res, statusCode, payload)=>res.status(statusCode).json(payload);
function parseCookies(req) {
    const cookieHeader = req?.headers?.cookie || '';
    return cookieHeader.split(';').map((part)=>part.trim()).filter(Boolean).reduce((cookies, part)=>{
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
function serializeCookie(name, value, options = {}) {
    const parts = [
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    ];
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
function getRequestUrl(req) {
    const host = req?.headers?.host || 'localhost';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return new URL(req?.url || '/', `${protocol}://${host}`);
}
}),
"[project]/soulfullbites/lib/dns-patch.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "patchedFetch",
    ()=>patchedFetch
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
/**
 * DNS Patcher for @neondatabase/serverless
 * 
 * Problem: Some ISPs (common in India) block/refuse to resolve AWS hostnames
 * like *.neon.tech via their DNS servers. The global fetch() in Node 18+ uses
 * libuv's getaddrinfo which respects /etc/resolv.conf set by the ISP.
 *
 * Solution: Intercept fetch() calls to Neon endpoints and resolve the hostname
 * manually using dns.Resolver (which we can configure to use Google DNS 8.8.8.8),
 * then rewrite the URL to use the resolved IP while sending the correct Host header.
 *
 * Usage: import './dns-patch.js' at the top of any file that uses the Neon client.
 */ var __TURBOPACK__url__external__node$3a$dns$2f$promises__ = __turbopack_context__.x("node:dns/promises", ()=>require("node:dns/promises"), true);
var __TURBOPACK__url__external__node$3a$https__ = __turbopack_context__.x("node:https", ()=>require("node:https"), true);
var __TURBOPACK__url__external__node$3a$http__ = __turbopack_context__.x("node:http", ()=>require("node:http"), true);
;
;
;
const resolver = new __TURBOPACK__url__external__node$3a$dns$2f$promises__["Resolver"]();
resolver.setServers([
    '8.8.8.8',
    '8.8.4.4',
    '1.1.1.1'
]);
const dnsCache = new Map(); // hostname -> { ip, cachedAt }
const DNS_TTL_MS = 5 * 60 * 1000; // 5 minutes
async function resolveHostname(hostname) {
    const cached = dnsCache.get(hostname);
    if (cached && Date.now() - cached.cachedAt < DNS_TTL_MS) {
        return cached.ip;
    }
    const addrs = await resolver.resolve4(hostname);
    if (!addrs || !addrs.length) throw new Error(`DNS resolution failed for ${hostname}`);
    const ip = addrs[0];
    dnsCache.set(hostname, {
        ip,
        cachedAt: Date.now()
    });
    return ip;
}
/**
 * A fetch() implementation that manually resolves DNS via Google DNS
 * before making the request. Falls back to native fetch on error.
 */ async function patchedFetch(url, options = {}) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        // Only patch Neon-related hostnames
        if (!hostname.endsWith('.neon.tech') && !hostname.endsWith('.aws.neon.tech')) {
            return fetch(url, options);
        }
        const ip = await resolveHostname(hostname);
        const patchedUrl = url.toString().replace(hostname, ip);
        // Keep the original hostname in the Host header for TLS SNI + virtual hosting
        const patchedOptions = {
            ...options,
            headers: {
                ...options.headers || {},
                'Host': hostname
            }
        };
        // Use Node's native https module to bypass undici DNS issues
        return await nodeFetch(patchedUrl, hostname, patchedOptions);
    } catch (err) {
        // Fall back to native fetch if patching fails
        console.warn('[DNS Patch] Falling back to native fetch:', err.message);
        return fetch(url, options);
    }
}
/**
 * Low-level HTTPS fetch using Node's native https module
 * (bypasses undici and its DNS resolver entirely)
 */ function nodeFetch(url, sniHostname, options = {}) {
    return new Promise((resolve, reject)=>{
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const agent = isHttps ? __TURBOPACK__url__external__node$3a$https__["default"] : __TURBOPACK__url__external__node$3a$http__["default"];
        const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers || {}
            },
            servername: sniHostname,
            rejectUnauthorized: true
        };
        const req = agent.request(reqOptions, (res)=>{
            const chunks = [];
            res.on('data', (chunk)=>chunks.push(chunk));
            res.on('end', ()=>{
                const body = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].concat(chunks).toString('utf8');
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    headers: res.headers,
                    json: ()=>Promise.resolve(JSON.parse(body)),
                    text: ()=>Promise.resolve(body),
                    arrayBuffer: ()=>Promise.resolve(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].concat(chunks).buffer)
                });
            });
            res.on('error', reject);
        });
        req.on('error', reject);
        if (options.body) {
            req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
        }
        req.end();
    });
}
;
const __TURBOPACK__default__export__ = patchedFetch;
}),
"[project]/soulfullbites/lib/db.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dbQuery",
    ()=>dbQuery,
    "ensureOrdersTable",
    ()=>ensureOrdersTable,
    "ensureUsersTable",
    ()=>ensureUsersTable,
    "getDatabaseUrl",
    ()=>getDatabaseUrl,
    "hasDatabase",
    ()=>hasDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/@neondatabase/serverless/index.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/http.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$dns$2d$patch$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/dns-patch.js [middleware-edge] (ecmascript)");
;
;
;
// ── DNS Fix: ISP DNS may block AWS/Neon hostnames ─────────────────────────────
// Configure Neon's HTTP driver to use our custom fetch that resolves via
// Google DNS (8.8.8.8) using Node's native https module (bypasses undici).
__TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["neonConfig"].fetchFunction = __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$dns$2d$patch$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["patchedFetch"];
// ─────────────────────────────────────────────────────────────────────────────
let sqlClient;
let ordersTableReady = false;
let usersTableReady = false;
function getDatabaseUrl() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cleanText"])(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);
}
function hasDatabase() {
    return Boolean(getDatabaseUrl());
}
function getSql() {
    if (!sqlClient) {
        const connectionString = getDatabaseUrl();
        if (!connectionString) {
            throw new Error('DATABASE_URL is not configured');
        }
        sqlClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["neon"])(connectionString, {
            fetchOptions: {
                cache: 'no-store'
            }
        });
    }
    return sqlClient;
}
async function dbQuery(query, params = []) {
    const sql = getSql();
    return sql.query(query, params);
}
async function ensureOrdersTable() {
    if (ordersTableReady) {
        return;
    }
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT,
      customer_zip TEXT,
      customer_note TEXT,
      items_text TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount INTEGER NOT NULL DEFAULT 0,
      total_display TEXT NOT NULL,
      customer_email_skipped BOOLEAN NOT NULL DEFAULT FALSE,
      admin_note TEXT NOT NULL DEFAULT '',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    // Ensure new columns exist for existing tables
    try {
        await dbQuery('ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT');
        await dbQuery('ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT');
        await dbQuery('ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT');
        await dbQuery("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'");
    } catch (err) {
        console.warn('Migration warning:', err.message);
    }
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      order_id TEXT REFERENCES orders(id),
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await dbQuery(`
    CREATE UNIQUE INDEX IF NOT EXISTS reviews_order_unique
    ON reviews(order_id)
    WHERE order_id IS NOT NULL
  `);
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      image_slug TEXT NOT NULL DEFAULT 'chocolate_bar.png',
      images_json TEXT NOT NULL DEFAULT '["chocolate_bar.png"]',
      flavor_note TEXT,
      ingredients TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    try {
        await dbQuery("ALTER TABLE products ADD COLUMN IF NOT EXISTS images_json TEXT NOT NULL DEFAULT '[\"chocolate_bar.png\"]'");
        await dbQuery("ALTER TABLE products ADD COLUMN IF NOT EXISTS flavor_note TEXT");
        await dbQuery("ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT");
    } catch (e) {
        console.warn('Products migration warning:', e.message);
    }
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL DEFAULT 'General',
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      original_name TEXT,
      data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    // Link orders to registered users
    try {
        await dbQuery('ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id)');
    } catch (e) {
        console.warn('orders.user_id migration warning:', e.message);
    }
    ordersTableReady = true;
}
async function ensureUsersTable() {
    if (usersTableReady) return;
    // Must run first so the products table exists (needed for user_wishlist FK)
    await ensureOrdersTable();
    await dbQuery(`
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
  `);
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS user_addresses (
      id          SERIAL PRIMARY KEY,
      user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
      label       TEXT NOT NULL DEFAULT 'Home',
      address     TEXT NOT NULL,
      city        TEXT,
      zip         TEXT,
      is_default  BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await dbQuery(`
    CREATE TABLE IF NOT EXISTS user_wishlist (
      user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
      product_id TEXT,
      added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, product_id)
    )
  `);
    usersTableReady = true;
}
}),
"[project]/soulfullbites/lib/user-auth.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeUserToken",
    ()=>decodeUserToken,
    "getUserFromCookies",
    ()=>getUserFromCookies,
    "hashPassword",
    ()=>hashPassword,
    "issueUserToken",
    ()=>issueUserToken,
    "sanitizeUser",
    ()=>sanitizeUser,
    "setUserCookie",
    ()=>setUserCookie,
    "verifyPassword",
    ()=>verifyPassword
]);
// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — User JWT Auth Library (Next.js App Router Version)
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jsonwebtoken/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/bcryptjs/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__url__external__node$3a$crypto__ = __turbopack_context__.x("node:crypto", ()=>require("node:crypto"), true);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/db.js [middleware-edge] (ecmascript)");
;
;
;
;
;
const USER_COOKIE_NAME = 'soulfull_user_session';
const JWT_EXPIRY = '7d';
const BCRYPT_ROUNDS = 12;
function getJwtSecret() {
    const secret = (process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET || '').trim();
    if (!secret) throw new Error('JWT_SECRET env var is not configured');
    return secret;
}
async function setUserCookie(token, maxAge = 60 * 60 * 24 * 7) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    if (!token) {
        cookieStore.delete(USER_COOKIE_NAME);
    } else {
        cookieStore.set(USER_COOKIE_NAME, token, {
            httpOnly: true,
            maxAge,
            path: '/',
            sameSite: 'lax',
            secure: ("TURBOPACK compile-time value", "development") === 'production'
        });
    }
}
function issueUserToken(userRow) {
    const payload = {
        sub: userRow.id,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role,
        permissionOverrides: userRow.permission_overrides ? JSON.parse(userRow.permission_overrides) : {}
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].sign(payload, getJwtSecret(), {
        expiresIn: JWT_EXPIRY
    });
}
function decodeUserToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].verify(token, getJwtSecret());
    } catch  {
        return null;
    }
}
async function getUserFromCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (!token) return null;
    return decodeUserToken(token);
}
function sanitizeUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        phone: row.phone || '',
        role: row.role,
        avatarUrl: row.avatar_url || null,
        isActive: row.is_active,
        createdAt: row.created_at
    };
}
async function hashPassword(plaintext) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].hash(plaintext, BCRYPT_ROUNDS);
}
async function verifyPassword(plaintext, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].compare(plaintext, hash);
}
}),
"[project]/soulfullbites/middleware.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$user$2d$auth$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/user-auth.js [middleware-edge] (ecmascript)");
;
;
const ADMIN_ROUTES = [
    '/admin',
    '/api/admin'
];
const PUBLIC_API_ROUTES = [
    '/api/user-auth',
    '/api/content',
    '/api/products'
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // 1. Allow public API routes
    if (PUBLIC_API_ROUTES.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // 2. Protect Admin & Management Routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        const token = request.cookies.get('soulfull_user_session')?.value;
        const user = token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$user$2d$auth$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["decodeUserToken"])(token) : null;
        // Redirect to login if not authenticated (except for the login page itself)
        if (!user && pathname !== '/admin/login') {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        // Check for admin/staff roles
        if (user && ![
            'ashu',
            'staff'
        ].includes(user.role)) {
            const url = request.nextUrl.clone();
            url.pathname = '/'; // Kick back to home if no permission
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/dashboard/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__00h_qg0._.js.map