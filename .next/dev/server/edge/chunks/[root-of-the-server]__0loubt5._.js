(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__0loubt5._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/soulfullbites/lib/auth-core.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/jose/dist/webapi/jwt/sign.js [middleware-edge] (ecmascript)");
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
        const { payload } = await __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"](token, secret);
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
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime(JWT_EXPIRY).sign(secret);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/lib/auth-core.js [middleware-edge] (ecmascript)");
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
        const user = token ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$lib$2f$auth$2d$core$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["decodeUserToken"])(token) : null;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0loubt5._.js.map