module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/soulfullbites/lib/http.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[externals]/node:dns/promises [external] (node:dns/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:dns/promises", () => require("node:dns/promises"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[project]/soulfullbites/lib/dns-patch.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "patchedFetch",
    ()=>patchedFetch
]);
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
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:dns/promises [external] (node:dns/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$https__$5b$external$5d$__$28$node$3a$https$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:https [external] (node:https, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$http__$5b$external$5d$__$28$node$3a$http$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:http [external] (node:http, cjs)");
;
;
;
const resolver = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["Resolver"]();
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
        const agent = isHttps ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$https__$5b$external$5d$__$28$node$3a$https$2c$__cjs$29$__["default"] : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$http__$5b$external$5d$__$28$node$3a$http$2c$__cjs$29$__["default"];
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
                const body = Buffer.concat(chunks).toString('utf8');
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    headers: res.headers,
                    json: ()=>Promise.resolve(JSON.parse(body)),
                    text: ()=>Promise.resolve(body),
                    arrayBuffer: ()=>Promise.resolve(Buffer.concat(chunks).buffer)
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
"[project]/soulfullbites/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$dns$2d$patch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/dns-patch.js [app-route] (ecmascript)");
;
;
;
// ── DNS Fix: ISP DNS may block AWS/Neon hostnames ─────────────────────────────
// Configure Neon's HTTP driver to use our custom fetch that resolves via
// Google DNS (8.8.8.8) using Node's native https module (bypasses undici).
__TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neonConfig"].fetchFunction = __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$dns$2d$patch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["patchedFetch"];
// ─────────────────────────────────────────────────────────────────────────────
let sqlClient;
let ordersTableReady = false;
let usersTableReady = false;
function getDatabaseUrl() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);
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
        sqlClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(connectionString, {
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
"[project]/soulfullbites/lib/orders.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildOrderRecord",
    ()=>buildOrderRecord,
    "createOrder",
    ()=>createOrder,
    "getOrderById",
    ()=>getOrderById,
    "listOrders",
    ()=>listOrders,
    "markOrderCustomerEmail",
    ()=>markOrderCustomerEmail,
    "updateOrder",
    ()=>updateOrder,
    "updatePaymentStatus",
    ()=>updatePaymentStatus
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/http.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/db.js [app-route] (ecmascript)");
;
;
;
const normalizeItem = (item = {})=>{
    const quantity = Math.max(0, Number(item.quantity ?? item.qty ?? 0) || 0);
    const price = Number(item.price || 0);
    return {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(item.id),
        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(item.name),
        quantity,
        qty: quantity,
        price,
        lineTotal: Number(item.lineTotal ?? price * quantity)
    };
};
const parseItems = (value)=>{
    if (!value) {
        return [];
    }
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(normalizeItem).filter((item)=>item.quantity > 0) : [];
    } catch  {
        return [];
    }
};
const normalizeOrder = (row)=>({
        id: row.id,
        source: row.source,
        status: row.status,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        customerAddress: row.customer_address,
        customerCity: row.customer_city || '',
        customerZip: row.customer_zip || '',
        customerNote: row.customer_note || '',
        itemsText: row.items_text,
        items: parseItems(row.items_json),
        totalAmount: Number(row.total_amount || 0),
        totalDisplay: row.total_display,
        customerEmailSkipped: Boolean(row.customer_email_skipped),
        adminNote: row.admin_note || '',
        paymentStatus: row.payment_status || 'unpaid',
        razorpayOrderId: row.razorpay_order_id || '',
        razorpayPaymentId: row.razorpay_payment_id || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at
    });
function buildOrderRecord(payload) {
    const orderLines = Array.isArray(payload.order_lines) ? payload.order_lines.map(normalizeItem).filter((item)=>item.quantity > 0) : [];
    return {
        id: `SB-${Date.now().toString(36)}-${__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomBytes(3).toString('hex')}`,
        source: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.source) || 'SoulfullBites Order',
        customerName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_name),
        customerEmail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_email),
        customerPhone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_phone),
        customerAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_address),
        customerCity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_city),
        customerZip: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_zip),
        customerNote: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.user_note),
        itemsText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.order_items),
        items: orderLines,
        totalAmount: Number(payload.order_total_value || 0),
        totalDisplay: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.order_total),
        razorpayOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.razorpay_order_id),
        paymentStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(payload.payment_status) || 'unpaid'
    };
}
async function createOrder(order) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    INSERT INTO orders (
      id,
      source,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_zip,
      customer_note,
      items_text,
      items_json,
      total_amount,
      total_display,
      razorpay_order_id,
      payment_status
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING *
  `, [
        order.id,
        order.source,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.customerAddress,
        order.customerCity,
        order.customerZip,
        order.customerNote,
        order.itemsText,
        JSON.stringify(order.items || []),
        order.totalAmount,
        order.totalDisplay,
        order.razorpayOrderId,
        order.paymentStatus
    ]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
}
async function markOrderCustomerEmail(orderId, customerEmailSkipped) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    UPDATE orders
    SET customer_email_skipped = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `, [
        Boolean(customerEmailSkipped),
        orderId
    ]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
}
async function getOrderById(orderId) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    SELECT *
    FROM orders
    WHERE id = $1
    LIMIT 1
  `, [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(orderId)
    ]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
}
async function listOrders({ search = '', status = 'all', paymentStatus = 'all', sort = 'created_at:desc', dateFilter = 'all' } = {}) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        throw new Error('DATABASE_URL is not configured');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const conditions = [];
    const values = [];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(status) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(status) !== 'all') {
        values.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(status));
        conditions.push(`status = $${values.length}`);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(paymentStatus) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(paymentStatus) !== 'all') {
        values.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(paymentStatus));
        conditions.push(`payment_status = $${values.length}`);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(search)) {
        values.push(`%${(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(search)}%`);
        conditions.push(`(
      id ILIKE $${values.length}
      OR customer_name ILIKE $${values.length}
      OR customer_email ILIKE $${values.length}
      OR customer_phone ILIKE $${values.length}
    )`);
    }
    if (dateFilter && dateFilter !== 'all') {
        if (dateFilter === 'today') {
            conditions.push(`created_at >= CURRENT_DATE`);
        } else if (dateFilter === 'week') {
            conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
        } else if (dateFilter === 'month') {
            conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);
        }
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    // Sorting logic
    let orderBy = 'created_at DESC';
    const [sortField, sortDir] = (sort || '').split(':');
    const allowedFields = [
        'created_at',
        'total_amount'
    ];
    if (allowedFields.includes(sortField)) {
        orderBy = `${sortField} ${sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
    }
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    SELECT *
    FROM orders
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT 200
  `, values);
    return rows.map(normalizeOrder);
}
async function updateOrder(id, updates) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        throw new Error('DATABASE_URL is not configured');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const nextStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(updates.status);
    const nextAdminNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(updates.adminNote);
    const fields = [];
    const values = [];
    if (nextStatus) {
        values.push(nextStatus);
        fields.push(`status = $${values.length}`);
    }
    if (updates.adminNote !== undefined) {
        values.push(nextAdminNote);
        fields.push(`admin_note = $${values.length}`);
    }
    if (fields.length === 0) {
        throw new Error('No updates provided');
    }
    values.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(id));
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    UPDATE orders
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *
  `, values);
    return rows[0] ? normalizeOrder(rows[0]) : null;
}
async function updatePaymentStatus(orderId, { expectedRazorpayOrderId, razorpayPaymentId, razorpaySignature, status = 'paid' }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    UPDATE orders
    SET
      razorpay_payment_id = $1,
      razorpay_signature = $2,
      payment_status = $3,
      updated_at = NOW()
    WHERE id = $4
      AND razorpay_order_id = $5
    RETURNING *
  `, [
        razorpayPaymentId,
        razorpaySignature,
        status,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(orderId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$http$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanText"])(expectedRazorpayOrderId)
    ]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/soulfullbites/lib/auth-core.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeUserToken",
    ()=>decodeUserToken,
    "issueUserToken",
    ()=>issueUserToken
]);
// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Auth Core (Edge Compatible)
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
;
const USER_COOKIE_NAME = 'soulfull_user_session';
const JWT_EXPIRY = '7d';
function getJwtSecret() {
    // Use a fallback for build-time or if env is missing
    const secret = (process.env.JWT_SECRET || process.env.ADMIN_SESSION_SECRET || 'fallback-secret-for-dev-only').trim();
    return secret;
}
async function decodeUserToken(token) {
    try {
        const secret = new TextEncoder().encode(getJwtSecret());
        const { payload } = await __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"](token, secret);
        return payload;
    } catch (err) {
        return null;
    }
}
async function issueUserToken(userRow) {
    const secret = new TextEncoder().encode(getJwtSecret());
    const payload = {
        sub: userRow.id,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role,
        permissionOverrides: userRow.permission_overrides ? typeof userRow.permission_overrides === 'string' ? JSON.parse(userRow.permission_overrides) : userRow.permission_overrides : {}
    };
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime(JWT_EXPIRY).sign(secret);
}
}),
"[project]/soulfullbites/lib/user-auth.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserFromCookies",
    ()=>getUserFromCookies,
    "hashPassword",
    ()=>hashPassword,
    "sanitizeUser",
    ()=>sanitizeUser,
    "setUserCookie",
    ()=>setUserCookie,
    "verifyPassword",
    ()=>verifyPassword
]);
// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — User JWT Auth Library (Node.js Version)
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/auth-core.js [app-route] (ecmascript)");
;
;
;
;
;
const USER_COOKIE_NAME = 'soulfull_user_session';
const BCRYPT_ROUNDS = 12;
;
async function setUserCookie(token, maxAge = 60 * 60 * 24 * 7) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
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
async function getUserFromCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (!token) return null;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeUserToken"])(token);
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(plaintext, BCRYPT_ROUNDS);
}
async function verifyPassword(plaintext, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(plaintext, hash);
}
}),
"[project]/soulfullbites/lib/permissions.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_PERMISSIONS",
    ()=>ALL_PERMISSIONS,
    "ROLE_DEFAULTS",
    ()=>ROLE_DEFAULTS,
    "hasPermission",
    ()=>hasPermission,
    "resolvePermissions",
    ()=>resolvePermissions
]);
// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Permission System (Next.js Version)
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$user$2d$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/soulfullbites/lib/user-auth.js [app-route] (ecmascript) <locals>");
;
const ALL_PERMISSIONS = [
    {
        key: 'orders.view',
        label: 'View all orders',
        category: 'Orders'
    },
    {
        key: 'orders.view_own',
        label: 'View own orders',
        category: 'Orders'
    },
    {
        key: 'orders.update_status',
        label: 'Update order status',
        category: 'Orders'
    },
    {
        key: 'orders.delete',
        label: 'Delete orders',
        category: 'Orders'
    },
    {
        key: 'orders.export',
        label: 'Export orders CSV',
        category: 'Orders'
    },
    {
        key: 'products.view',
        label: 'View products',
        category: 'Products'
    },
    {
        key: 'products.create',
        label: 'Create products',
        category: 'Products'
    },
    {
        key: 'products.edit',
        label: 'Edit products',
        category: 'Products'
    },
    {
        key: 'products.delete',
        label: 'Delete products',
        category: 'Products'
    },
    {
        key: 'cms.edit',
        label: 'Edit site content',
        category: 'CMS'
    },
    {
        key: 'faq.manage',
        label: 'Manage FAQs',
        category: 'CMS'
    },
    {
        key: 'media.upload',
        label: 'Upload media',
        category: 'Media'
    },
    {
        key: 'users.view',
        label: 'View user list',
        category: 'Users'
    },
    {
        key: 'users.create',
        label: 'Create users',
        category: 'Users'
    },
    {
        key: 'users.edit',
        label: 'Edit users',
        category: 'Users'
    },
    {
        key: 'users.delete',
        label: 'Delete users',
        category: 'Users'
    },
    {
        key: 'users.manage_roles',
        label: 'Assign roles & permissions',
        category: 'Users'
    },
    {
        key: 'reviews.moderate',
        label: 'Moderate reviews',
        category: 'Reviews'
    },
    {
        key: 'profile.edit_own',
        label: 'Edit own profile',
        category: 'Profile'
    },
    {
        key: 'wishlist.manage',
        label: 'Manage wishlist',
        category: 'Profile'
    },
    {
        key: 'addresses.manage',
        label: 'Manage saved addresses',
        category: 'Profile'
    }
];
const ROLE_DEFAULTS = {
    ashu: ALL_PERMISSIONS.map((p)=>p.key),
    staff: [
        'orders.view',
        'orders.view_own',
        'orders.update_status',
        'orders.export',
        'products.view',
        'products.create',
        'products.edit',
        'cms.edit',
        'faq.manage',
        'media.upload',
        'users.view',
        'reviews.moderate',
        'profile.edit_own',
        'wishlist.manage',
        'addresses.manage'
    ],
    user: [
        'orders.view_own',
        'products.view',
        'profile.edit_own',
        'wishlist.manage',
        'addresses.manage'
    ]
};
function resolvePermissions(jwtPayload) {
    const role = jwtPayload?.role || 'user';
    const basePerms = new Set(ROLE_DEFAULTS[role] || ROLE_DEFAULTS.user);
    const overrides = jwtPayload?.permissionOverrides || {};
    for (const [key, granted] of Object.entries(overrides)){
        if (granted) basePerms.add(key);
        else basePerms.delete(key);
    }
    return Array.from(basePerms);
}
async function hasPermission(permissionKey) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$user$2d$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getUserFromCookies"])();
    if (!user) return false;
    // owner role always has everything
    if (user.role === 'ashu') return true;
    const perms = resolvePermissions(user);
    return perms.includes(permissionKey);
}
}),
"[project]/soulfullbites/app/api/admin/orders/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$orders$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/orders.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$permissions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/permissions.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$permissions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])('orders.view')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Access denied'
        }, {
            status: 403
        });
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';
    const sort = searchParams.get('sort') || 'created_at:desc';
    const dateFilter = searchParams.get('dateFilter') || 'all';
    try {
        const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$orders$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listOrders"])({
            search,
            status,
            paymentStatus,
            sort,
            dateFilter
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            orders
        });
    } catch (err) {
        console.error('List orders error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch orders'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$permissions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasPermission"])('orders.update_status')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Access denied'
        }, {
            status: 403
        });
    }
    try {
        const body = await request.json();
        const { id, status, admin_note } = body;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Order ID is required'
            }, {
                status: 400
            });
        }
        const order = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$orders$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrder"])(id, {
            status,
            adminNote: admin_note
        });
        if (!order) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            order
        });
    } catch (err) {
        console.error('Update order error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update order'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ziipv.._.js.map