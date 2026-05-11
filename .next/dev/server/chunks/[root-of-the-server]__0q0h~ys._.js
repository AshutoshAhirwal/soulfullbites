module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/soulfullbites/lib/auth-core.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/verify.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/sign.js [middleware] (ecmascript)");
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
        const { payload } = await __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtVerify"](token, secret);
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
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime(JWT_EXPIRY).sign(secret);
}
}),
"[project]/soulfullbites/proxy.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/auth-core.js [middleware] (ecmascript)");
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
async function proxy(request) {
    const { pathname } = request.nextUrl;
    // 1. Allow public API routes
    if (PUBLIC_API_ROUTES.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // 2. Protect Admin & Management Routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        const token = request.cookies.get('soulfull_user_session')?.value;
        const user = token ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeUserToken"])(token) : null;
        // Redirect to login if not authenticated (except for the login page itself)
        if (!user && pathname !== '/admin/login') {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        // Check for admin/staff roles
        if (user && ![
            'ashu',
            'staff'
        ].includes(user.role)) {
            const url = request.nextUrl.clone();
            url.pathname = '/'; // Kick back to home if no permission
            return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/dashboard/:path*'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0q0h~ys._.js.map