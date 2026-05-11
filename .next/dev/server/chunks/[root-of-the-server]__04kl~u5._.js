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
"[project]/soulfullbites/lib/content.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "batchUpdateContent",
    ()=>batchUpdateContent,
    "getContent",
    ()=>getContent,
    "seedContent",
    ()=>seedContent,
    "updateContent",
    ()=>updateContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/db.js [app-route] (ecmascript)");
;
async function seedContent() {
    const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])('SELECT key FROM site_content LIMIT 1');
    if (existing.length > 0) return;
    const defaults = {
        home_h1: "Artisanal Chocolate,\nBorn from the Soul.",
        home_p: "Beyond taste. Beyond texture. A curated journey into the depths of single-origin cacao, crafted for those who seek the extraordinary.",
        home_cta: "Shop the Collection",
        home_origin_h: "The Origin",
        home_origin_p: "Our journey begins in the high-altitude forests of the Western Ghats, where we source rare, wild-grown cacao beans. Each bean is hand-selected and fermented with precision to preserve its unique terroir.",
        home_story_h: "Our Story",
        home_story_p: "SoulfullBites was founded on a simple belief: that chocolate should be an immersive experience, not just a snack. We treat our cacao with the reverence of a fine wine, aging our bars for months to develop a complex, soulful profile.",
        home_story_quote: "Chocolate is the bridge between the physical and the spiritual.",
        home_craft_h: "The Craft",
        home_craft_p: "From stone-grinding for 72 hours to hand-wrapping each bar in recycled mulberry paper, our process is slow, deliberate, and deeply personal.",
        home_newsletter_h: "Stay close to\nevery new batch.",
        home_newsletter_p: "Get first access to limited drops, gifting releases, tasting notes, and chef collaborations from our chocolate studio.",
        home_newsletter_cta: "Join the Insider List",
        shop_h1: "Cultivate Your Collection",
        shop_p: "Each bar in our inventory is a chapter in our ongoing exploration of flavor and soul.",
        site_title: "SoulfullBites",
        footer_desc: "Crafting immersive chocolate experiences from the heart of the Western Ghats.",
        insta_label: "@SoulfullBites",
        footer_copy: "© 2026 SoulfullBites Studio."
    };
    for (const [key, value] of Object.entries(defaults)){
        await updateContent(key, value);
    }
}
async function getContent() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        return {};
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    let rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])('SELECT key, value FROM site_content');
    if (rows.length === 0) {
        await seedContent();
        rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])('SELECT key, value FROM site_content');
    }
    const content = {};
    rows.forEach((row)=>{
        content[row.key] = row.value;
    });
    return content;
}
async function updateContent(key, value) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        throw new Error('DATABASE_URL is not configured');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
    INSERT INTO site_content (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
  `, [
        key,
        value
    ]);
}
async function batchUpdateContent(updates) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) {
        throw new Error('DATABASE_URL is not configured');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    for (const [key, value] of Object.entries(updates)){
        await updateContent(key, value);
    }
}
}),
"[project]/soulfullbites/lib/faq.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteFaq",
    ()=>deleteFaq,
    "getFaqs",
    ()=>getFaqs,
    "seedFaqs",
    ()=>seedFaqs,
    "upsertFaq",
    ()=>upsertFaq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/db.js [app-route] (ecmascript)");
;
async function getFaqs(includeInactive = false) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) return [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const query = includeInactive ? 'SELECT * FROM faq_items ORDER BY sort_order ASC, created_at ASC' : 'SELECT * FROM faq_items WHERE is_active = TRUE ORDER BY sort_order ASC, created_at ASC';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(query);
}
async function upsertFaq(faq) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) throw new Error('DATABASE_URL is not configured');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    const { id, category, question, answer, is_active, sort_order } = faq;
    if (id && !id.toString().startsWith('temp_')) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
      UPDATE faq_items SET 
        category = $2, question = $3, answer = $4, is_active = $5, sort_order = $6
      WHERE id = $1
    `, [
            id,
            category,
            question,
            answer,
            is_active,
            sort_order
        ]);
    } else {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])(`
      INSERT INTO faq_items (category, question, answer, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5)
    `, [
            category,
            question,
            answer,
            is_active,
            sort_order
        ]);
    }
}
async function deleteFaq(id) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasDatabase"])()) throw new Error('DATABASE_URL is not configured');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureOrdersTable"])();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbQuery"])('DELETE FROM faq_items WHERE id = $1', [
        id
    ]);
}
async function seedFaqs() {
    const existing = await getFaqs(true);
    if (existing.length > 0) return;
    const defaults = [
        {
            category: 'The Foundation',
            question: 'Do you ship internationally?',
            answer: 'Currently, we ship within India only. Each bar is packed with thermal protection to ensure it arrives with its soul intact, even in mountain heat.',
            is_active: true,
            sort_order: 1
        },
        {
            category: 'The Foundation',
            question: 'Is your chocolate vegan?',
            answer: 'Our "Dark & Bold" bar is 100% vegan. Our "Milk & Velvet" and "White & Rose" contain high-quality grass-fed dairy from local mountain farms.',
            is_active: true,
            sort_order: 2
        },
        {
            category: 'Preparation & Care',
            question: 'How should I store my bars?',
            answer: 'We recommend a cool, dry library. Between 16°C and 20°C is perfect. Avoid the fridge—extreme cold "shocks" the cocoa butter and mutes the story within.',
            is_active: true,
            sort_order: 3
        },
        {
            category: 'Preparation & Care',
            question: 'Are your ingredients organic?',
            answer: 'Absolutely. We use certified organic cacao from ethical estates, unrefined organic sugars, and botanicals we\'d be proud to grow ourselves.',
            is_active: true,
            sort_order: 4
        }
    ];
    for (const f of defaults){
        await upsertFaq(f);
    }
}
}),
"[project]/soulfullbites/app/api/content/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$content$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/content.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$faq$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/faq.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');
        if (section === 'faq') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$faq$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["seedFaqs"])(); // Ensure defaults exist if DB is empty
            const faqs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$faq$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFaqs"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(faqs);
        }
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$content$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getContent"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        console.error('Public content error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch content'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04kl~u5._.js.map