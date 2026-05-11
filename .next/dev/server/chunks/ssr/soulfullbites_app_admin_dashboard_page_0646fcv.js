module.exports = [
"[project]/soulfullbites/app/admin/dashboard/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/soulfullbites/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
// ── CONTENT DEFINITION (Restored 1:1) ────────────────────────────────────────
const CONTENT_DEFINITION = [
    {
        id: 'page-home',
        label: 'Home Page',
        sections: [
            {
                label: 'Hero Section',
                fields: [
                    {
                        key: 'home_h1',
                        label: 'Main Headline',
                        type: 'textarea'
                    },
                    {
                        key: 'home_p',
                        label: 'Sub-headline',
                        type: 'textarea'
                    },
                    {
                        key: 'home_cta',
                        label: 'CTA Button Text',
                        type: 'text'
                    }
                ]
            },
            {
                label: 'Origin Section',
                fields: [
                    {
                        key: 'home_origin_h',
                        label: 'Origin Title',
                        type: 'text'
                    },
                    {
                        key: 'home_origin_p',
                        label: 'Origin Story',
                        type: 'textarea'
                    }
                ]
            },
            {
                label: 'Our Story',
                fields: [
                    {
                        key: 'home_story_h',
                        label: 'Story Title',
                        type: 'text'
                    },
                    {
                        key: 'home_story_p',
                        label: 'Main Narrative',
                        type: 'textarea'
                    },
                    {
                        key: 'home_story_quote',
                        label: 'Featured Quote',
                        type: 'textarea'
                    }
                ]
            },
            {
                label: 'The Craft',
                fields: [
                    {
                        key: 'home_craft_h',
                        label: 'Craft Title',
                        type: 'text'
                    },
                    {
                        key: 'home_craft_p',
                        label: 'Craft Description',
                        type: 'textarea'
                    }
                ]
            },
            {
                label: 'Insider Signup',
                fields: [
                    {
                        key: 'home_newsletter_h',
                        label: 'Signup Title',
                        type: 'text'
                    },
                    {
                        key: 'home_newsletter_p',
                        label: 'Signup Copy',
                        type: 'textarea'
                    },
                    {
                        key: 'home_newsletter_cta',
                        label: 'Signup Button',
                        type: 'text'
                    }
                ]
            },
            {
                label: 'Promises',
                fields: [
                    {
                        key: 'promises_h2',
                        label: 'Section Title',
                        type: 'text'
                    },
                    {
                        key: 'promise_1_h',
                        label: 'Promise 1 Title',
                        type: 'text'
                    },
                    {
                        key: 'promise_1_p',
                        label: 'Promise 1 Desc',
                        type: 'textarea'
                    },
                    {
                        key: 'promise_2_h',
                        label: 'Promise 2 Title',
                        type: 'text'
                    },
                    {
                        key: 'promise_2_p',
                        label: 'Promise 2 Desc',
                        type: 'textarea'
                    },
                    {
                        key: 'promise_3_h',
                        label: 'Promise 3 Title',
                        type: 'text'
                    },
                    {
                        key: 'promise_3_p',
                        label: 'Promise 3 Desc',
                        type: 'textarea'
                    },
                    {
                        key: 'promise_4_h',
                        label: 'Promise 4 Title',
                        type: 'text'
                    },
                    {
                        key: 'promise_4_p',
                        label: 'Promise 4 Desc',
                        type: 'textarea'
                    }
                ]
            }
        ]
    },
    {
        id: 'page-shop',
        label: 'Shop Page',
        sections: [
            {
                label: 'Shop Header',
                fields: [
                    {
                        key: 'shop_h1',
                        label: 'Shop Headline',
                        type: 'text'
                    },
                    {
                        key: 'shop_p',
                        label: 'Shop Introduction',
                        type: 'textarea'
                    }
                ]
            },
            {
                label: 'Cart UI',
                fields: [
                    {
                        key: 'shop_bag_title',
                        label: 'Cart Heading',
                        type: 'text'
                    },
                    {
                        key: 'shop_empty_msg',
                        label: 'Empty Msg',
                        type: 'text'
                    },
                    {
                        key: 'shop_checkout_txt',
                        label: 'Checkout Button',
                        type: 'text'
                    }
                ]
            }
        ]
    },
    {
        id: 'page-global',
        label: 'Global & Footer',
        sections: [
            {
                label: 'Brand Identity',
                fields: [
                    {
                        key: 'site_title',
                        label: 'Brand Name',
                        type: 'text'
                    },
                    {
                        key: 'footer_desc',
                        label: 'Footer About',
                        type: 'textarea'
                    },
                    {
                        key: 'insta_label',
                        label: 'Instagram Label',
                        type: 'text'
                    },
                    {
                        key: 'insta_link',
                        label: 'Instagram URL',
                        type: 'text'
                    },
                    {
                        key: 'footer_copy',
                        label: 'Copyright Text',
                        type: 'text'
                    }
                ]
            }
        ]
    }
];
// ── UTILS ───────────────────────────────────────────────────────────────────
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
async function compressImage(base64, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve)=>{
        const img = new Image();
        img.src = base64;
        img.onload = ()=>{
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = maxWidth / width * height;
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
}
function AdminDashboard() {
    const [activeModule, setActiveModule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('orders');
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [stateMsg, setStateMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        text: '',
        type: ''
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const setState = (text, type = 'error')=>{
        setStateMsg({
            text,
            type
        });
        if (text) setTimeout(()=>setStateMsg({
                text: '',
                type: ''
            }), 5000);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkSession = async ()=>{
            try {
                const res = await fetch('/api/user-auth');
                const data = await res.json();
                if (!data.user) {
                    router.push('/admin/login');
                    return;
                }
                setUser(data.user);
            } catch (err) {
                router.push('/admin/login');
            } finally{
                setLoading(false);
            }
        };
        checkSession();
    }, [
        router
    ]);
    const handleLogout = async ()=>{
        await fetch('/api/user-auth', {
            method: 'DELETE'
        });
        router.push('/admin/login');
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-login-full",
        children: "Syncing Console..."
    }, void 0, false, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 149,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-body",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "admin-topbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/",
                        className: "admin-topbar-brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/assets/logo.png",
                                alt: "logo"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            "SoulfullBites"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-topbar-divider"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "admin-topbar-nav",
                        children: [
                            {
                                id: 'orders',
                                label: '📦 Orders'
                            },
                            {
                                id: 'products',
                                label: '🍫 Products'
                            },
                            {
                                id: 'content',
                                label: '📝 Site Content'
                            },
                            {
                                id: 'users',
                                label: '👥 Users'
                            },
                            {
                                id: 'permissions',
                                label: '🔐 Roles'
                            }
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveModule(tab.id),
                                className: `admin-topbar-tab ${activeModule === tab.id ? 'active' : ''}`,
                                children: tab.label
                            }, tab.id, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-topbar-right",
                        children: [
                            stateMsg.text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `admin-state ${stateMsg.type}`,
                                style: {
                                    fontSize: '0.78rem'
                                },
                                children: stateMsg.text
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 178,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.location.reload(),
                                className: "admin-secondary-btn",
                                style: {
                                    padding: '0.35rem 0.85rem',
                                    fontSize: '0.8rem'
                                },
                                children: "↻ Refresh"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: "admin-ghost-btn",
                                style: {
                                    padding: '0.35rem 0.85rem',
                                    fontSize: '0.8rem'
                                },
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "admin-page",
                children: [
                    activeModule === 'orders' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OrdersModule, {
                        setState: setState
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 186,
                        columnNumber: 39
                    }, this),
                    activeModule === 'products' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductsModule, {
                        setState: setState
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 187,
                        columnNumber: 41
                    }, this),
                    activeModule === 'content' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentModule, {
                        setState: setState
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 188,
                        columnNumber: 40
                    }, this),
                    activeModule === 'users' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersModule, {
                        setState: setState
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 189,
                        columnNumber: 38
                    }, this),
                    activeModule === 'permissions' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PermissionsModule, {
                        setState: setState
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 190,
                        columnNumber: 44
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
// ── ORDERS MODULE (Restored Full Features) ──────────────────────────────────
function OrdersModule({ setState }) {
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [paymentFilter, setPaymentFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('created_at:desc');
    const [dateFilter, setDateFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const fetchOrders = async ()=>{
        setLoading(true);
        try {
            const params = new URLSearchParams({
                paymentStatus: paymentFilter,
                sort,
                dateFilter
            });
            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) {
            setState('Fetch failed');
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchOrders();
    }, [
        paymentFilter,
        sort,
        dateFilter
    ]);
    const filteredOrders = orders.filter((o)=>{
        const term = search.toLowerCase();
        const matchesSearch = !term || o.customerName.toLowerCase().includes(term) || o.customerEmail.toLowerCase().includes(term) || o.id.includes(term);
        const matchesTab = filter === 'all' || (filter === 'paid' ? o.paymentStatus === 'paid' : filter === 'waitlist' ? o.paymentStatus === 'waitlist' : o.status === filter);
        return matchesSearch && matchesTab;
    });
    const exportCsv = ()=>{
        if (orders.length === 0) return setState('No data to export');
        const headers = [
            'ID',
            'Customer',
            'Email',
            'Phone',
            'Address',
            'Amount',
            'Status',
            'Payment',
            'Items'
        ];
        const rows = orders.map((o)=>[
                o.id,
                o.customerName,
                o.customerEmail,
                o.customerPhone,
                o.customerAddress,
                o.totalAmount,
                o.status,
                o.paymentStatus,
                (o.items || []).map((i)=>`${i.name}(${i.qty})`).join('; ')
            ]);
        const csv = [
            headers.join(','),
            ...rows.map((r)=>r.map((c)=>`"${(c || '').toString().replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        const blob = new Blob([
            '\ufeff' + csv
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `soulfullbites_orders_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        setState('Exported ✓', 'success');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "module-orders",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-module-title",
                        children: "Live Orders"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: exportCsv,
                        className: "admin-secondary-btn",
                        style: {
                            fontSize: '0.8rem',
                            padding: '0.4rem 1rem'
                        },
                        children: "⬇ Export CSV"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-chip-row",
                children: [
                    'all',
                    'new',
                    'paid',
                    'waitlist',
                    'delivered'
                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilter(s),
                        className: `admin-chip ${filter === s ? 'active' : ''}`,
                        children: s.charAt(0).toUpperCase() + s.slice(1)
                    }, s, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-stats-mini",
                children: [
                    {
                        label: 'Active/New',
                        val: orders.filter((o)=>o.status === 'new').length
                    },
                    {
                        label: 'Paid Cases',
                        val: orders.filter((o)=>o.paymentStatus === 'paid').length
                    },
                    {
                        label: 'Waitlist',
                        val: orders.filter((o)=>o.paymentStatus === 'waitlist').length
                    },
                    {
                        label: 'Total Log',
                        val: orders.length
                    }
                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-stat-chip",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: s.val
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 260,
                                columnNumber: 58
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: s.label
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 260,
                                columnNumber: 82
                            }, this)
                        ]
                    }, s.label, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-filterbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "search",
                        placeholder: "Search customer, email, order ID…",
                        value: search,
                        onChange: (e)=>setSearch(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-filterbar-sep"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: paymentFilter,
                        onChange: (e)=>setPaymentFilter(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "all",
                                children: "All Payments"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "paid",
                                children: "Paid"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "unpaid",
                                children: "Unpaid"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: sort,
                        onChange: (e)=>setSort(e.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "created_at:desc",
                                children: "Newest First"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "total_amount:desc",
                                children: "Highest Value"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-orders",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        textAlign: 'center',
                        padding: '4rem'
                    },
                    children: "Syncing Ledger..."
                }, void 0, false, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 279,
                    columnNumber: 20
                }, this) : filteredOrders.map((ord)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "admin-card admin-order-card",
                        style: {
                            marginBottom: '2rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "admin-order-top",
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '1.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "admin-order-id",
                                                children: [
                                                    "Registry #",
                                                    ord.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    marginTop: '0.2rem',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontSize: '2.2rem',
                                                    fontWeight: 300
                                                },
                                                children: ord.customerName
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '0.8rem',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `admin-badge ${ord.status}`,
                                                children: ord.status
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `admin-badge ${ord.paymentStatus}`,
                                                children: ord.paymentStatus
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 288,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 286,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card-split-grid",
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1.2fr 0.8fr',
                                    gap: '3rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "admin-order-panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "admin-kicker",
                                                style: {
                                                    fontSize: '0.65rem',
                                                    marginBottom: '1rem'
                                                },
                                                children: "Customer Profile"
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "admin-order-meta",
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.35rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    color: '#c9993a'
                                                                },
                                                                children: "Email:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 296,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            ord.customerEmail
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 296,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    color: '#c9993a'
                                                                },
                                                                children: "Contact:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 297,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            ord.customerPhone
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 297,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                style: {
                                                                    color: '#c9993a'
                                                                },
                                                                children: "Location:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 298,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            ord.customerAddress
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 298,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: '2.5rem',
                                                    paddingTop: '1.5rem',
                                                    borderTop: '1px solid rgba(74, 44, 26, 0.08)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "admin-kicker",
                                                        style: {
                                                            fontSize: '0.65rem'
                                                        },
                                                        children: "Ledger Total"
                                                    }, void 0, false, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 301,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: '2rem',
                                                            color: '#3d2518',
                                                            fontFamily: "'Cormorant Garamond', serif",
                                                            fontStyle: 'italic'
                                                        },
                                                        children: [
                                                            "₹",
                                                            ord.totalAmount
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 302,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "admin-order-content-inner",
                                        style: {
                                            background: 'rgba(139, 94, 60, 0.04)',
                                            borderRadius: '1.5rem',
                                            padding: '1.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "admin-kicker",
                                                style: {
                                                    fontSize: '0.65rem',
                                                    opacity: 0.6
                                                },
                                                children: "Order Selection"
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "admin-order-lines",
                                                children: (ord.items || []).map((it, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "admin-order-line",
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            padding: '0.85rem 1rem',
                                                            borderRadius: '1rem',
                                                            background: '#fffcf8',
                                                            marginBottom: '0.5rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: it.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                        lineNumber: 310,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                        style: {
                                                                            display: 'block',
                                                                            fontSize: '0.75rem',
                                                                            opacity: 0.5
                                                                        },
                                                                        children: [
                                                                            it.qty,
                                                                            " Unit(s)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                        lineNumber: 310,
                                                                        columnNumber: 54
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 310,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontWeight: 600,
                                                                    color: '#c9993a'
                                                                },
                                                                children: [
                                                                    "₹",
                                                                    it.price * it.qty
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 311,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 309,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 307,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 292,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "admin-order-actions",
                                style: {
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid rgba(74, 44, 26, 0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "admin-select",
                                        value: ord.status,
                                        onChange: async (e)=>{
                                            await fetch('/api/admin/orders', {
                                                method: 'PATCH',
                                                body: JSON.stringify({
                                                    id: ord.id,
                                                    status: e.target.value
                                                })
                                            });
                                            fetchOrders();
                                            setState('Status updated', 'success');
                                        },
                                        style: {
                                            width: '220px',
                                            fontWeight: 600
                                        },
                                        children: [
                                            'new',
                                            'confirmed',
                                            'preparing',
                                            'delivered',
                                            'cancelled'
                                        ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s,
                                                children: s.charAt(0).toUpperCase() + s.slice(1)
                                            }, s, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 324,
                                                columnNumber: 87
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: '#9a8678',
                                            opacity: 0.6
                                        },
                                        children: "Update order state here as the kitchen flow progresses."
                                    }, void 0, false, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this)
                        ]
                    }, ord.id, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 278,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
// ── PRODUCTS MODULE (Full Editor & Upload) ──────────────────────────────────
function ProductsModule({ setState }) {
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const fetchProducts = async ()=>{
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setState('Catalog failed');
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchProducts();
    }, []);
    const handleUpload = async (product, file)=>{
        if (!file) return;
        setState('Optimizing...', 'success');
        try {
            const reader = new FileReader();
            reader.onload = async (e)=>{
                const optimized = await compressImage(e.target.result);
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        base64: optimized,
                        name: file.name
                    })
                });
                const data = await res.json();
                // Update local state for immediate preview
                setProducts((prev)=>prev.map((p)=>p.id === product.id ? {
                            ...p,
                            image_slug: data.path
                        } : p));
                setState('Uploaded ✓', 'success');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setState('Upload failed');
        }
    };
    const handleSave = async (p)=>{
        try {
            await fetch('/api/admin/products', {
                method: 'POST',
                body: JSON.stringify(p)
            });
            setState('Synced ✓', 'success');
            fetchProducts();
        } catch (err) {
            setState('Save failed');
        }
    };
    const filtered = products.filter((p)=>!search || p.name.toLowerCase().includes(search.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "module-products",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-module-title",
                        children: "Product Catalog"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 390,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: async ()=>{
                            const name = prompt('Name?');
                            if (name) await fetch('/api/admin/products', {
                                method: 'POST',
                                body: JSON.stringify({
                                    id: 'p' + Date.now(),
                                    name,
                                    price: 450,
                                    is_active: true,
                                    description: '...',
                                    image_slug: 'chocolate_bar.png'
                                })
                            });
                            fetchProducts();
                        },
                        className: "admin-primary-btn",
                        children: "+ Add Product"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 389,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-filterbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "search",
                    placeholder: "Search products…",
                    value: search,
                    onChange: (e)=>setSearch(e.target.value)
                }, void 0, false, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 399,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "admin-product-list",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Loading Catalog..."
                }, void 0, false, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 403,
                    columnNumber: 20
                }, this) : filtered.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "admin-card",
                        style: {
                            marginBottom: '2rem'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '240px 1fr 1fr',
                                gap: '2.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "admin-prod-sidebar",
                                    style: {
                                        background: 'rgba(74, 44, 26, 0.02)',
                                        padding: '1.5rem',
                                        borderRadius: '2rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "admin-prod-preview",
                                            style: {
                                                width: '100%',
                                                aspectRatio: '1',
                                                background: '#fff',
                                                borderRadius: '1.5rem',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: p.image_slug?.startsWith('/') ? p.image_slug : `/assets/${p.image_slug}`,
                                                    style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 408,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        width: '100%',
                                                        padding: '0.8rem',
                                                        background: 'rgba(255,255,255,0.9)',
                                                        textAlign: 'center',
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '0.65rem',
                                                                fontWeight: 700
                                                            },
                                                            children: "📷 Change Image"
                                                        }, void 0, false, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 410,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            style: {
                                                                display: 'none'
                                                            },
                                                            onChange: (e)=>handleUpload(p, e.target.files[0])
                                                        }, void 0, false, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 411,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 409,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 407,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "admin-field",
                                            style: {
                                                marginTop: '1.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Asset Path"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 415,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: p.image_slug,
                                                    onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                    ...item,
                                                                    image_slug: e.target.value
                                                                } : item))
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 416,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 414,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 406,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "admin-kicker",
                                            style: {
                                                fontSize: '0.6rem'
                                            },
                                            children: "Primary Data"
                                        }, void 0, false, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 420,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "admin-field",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Product Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 421,
                                                    columnNumber: 48
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: p.name,
                                                    onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                    ...item,
                                                                    name: e.target.value
                                                                } : item))
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 421,
                                                    columnNumber: 73
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 421,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "admin-field",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Description"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 422,
                                                    columnNumber: 48
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    style: {
                                                        minHeight: '100px'
                                                    },
                                                    value: p.description,
                                                    onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                    ...item,
                                                                    description: e.target.value
                                                                } : item))
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 422,
                                                    columnNumber: 72
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 422,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 419,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "admin-kicker",
                                            style: {
                                                fontSize: '0.6rem'
                                            },
                                            children: "Specs & Price"
                                        }, void 0, false, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 425,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '1rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "admin-field",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Price (₹)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 427,
                                                            columnNumber: 50
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: p.price,
                                                            onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                            ...item,
                                                                            price: parseInt(e.target.value)
                                                                        } : item))
                                                        }, void 0, false, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 427,
                                                            columnNumber: 72
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 427,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "admin-field",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 428,
                                                            columnNumber: 50
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: p.is_active ? 'true' : 'false',
                                                            onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                            ...item,
                                                                            is_active: e.target.value === 'true'
                                                                        } : item)),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "true",
                                                                    children: "Active"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                    lineNumber: 429,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "false",
                                                                    children: "Hidden"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                    lineNumber: 429,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                            lineNumber: 428,
                                                            columnNumber: 69
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 428,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 426,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "admin-field",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ingredients"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 431,
                                                    columnNumber: 48
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: p.ingredients || '',
                                                    onChange: (e)=>setProducts((prev)=>prev.map((item)=>item.id === p.id ? {
                                                                    ...item,
                                                                    ingredients: e.target.value
                                                                } : item))
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 431,
                                                    columnNumber: 72
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 431,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '0.5rem',
                                                marginTop: '1rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSave(p),
                                                    className: "admin-primary-btn",
                                                    style: {
                                                        flex: 1
                                                    },
                                                    children: "Save Changes"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 433,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: async ()=>{
                                                        if (confirm('Delete?')) {
                                                            await fetch(`/api/admin/products?id=${p.id}`, {
                                                                method: 'DELETE'
                                                            });
                                                            fetchProducts();
                                                        }
                                                    },
                                                    className: "admin-ghost-btn",
                                                    style: {
                                                        color: '#9d3030'
                                                    },
                                                    children: "✕"
                                                }, void 0, false, {
                                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                    lineNumber: 434,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 424,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this)
                    }, p.id, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 404,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 388,
        columnNumber: 5
    }, this);
}
// ── CONTENT MODULE (Full Restoration with FAQs) ──────────────────────────────
function ContentModule({ setState }) {
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [faqs, setFaqs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('page-home');
    const fetchData = async ()=>{
        const [cRes, fRes] = await Promise.all([
            fetch('/api/content'),
            fetch('/api/content?section=faq')
        ]);
        const cData = await cRes.json();
        const fData = await fRes.json();
        setContent(cData || {});
        setFaqs(Array.isArray(fData) ? fData : []);
        setLoading(false);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchData();
    }, []);
    const save = async ()=>{
        setState('Saving...', 'success');
        await fetch('/api/admin/content', {
            method: 'POST',
            body: JSON.stringify({
                updates: content
            })
        });
        setState('Site updated ✓', 'success');
    };
    const saveFaq = async (faq)=>{
        await fetch('/api/admin/faq', {
            method: 'POST',
            body: JSON.stringify(faq)
        });
        setState('FAQ saved', 'success');
        fetchData();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "module-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-module-title",
                        children: "Site Content Manager"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: save,
                        className: "admin-primary-btn",
                        children: "💾 Save All Changes"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 482,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 480,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-chip-row",
                children: [
                    CONTENT_DEFINITION.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab(tab.id),
                            className: `admin-chip ${activeTab === tab.id ? 'active' : ''}`,
                            children: tab.label
                        }, tab.id, false, {
                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                            lineNumber: 487,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('faq'),
                        className: `admin-chip ${activeTab === 'faq' ? 'active' : ''}`,
                        children: "🙋 FAQs"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 489,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-card",
                style: {
                    padding: '2rem'
                },
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 493,
                    columnNumber: 20
                }, this) : activeTab === 'faq' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '2rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Archive Questions"
                                }, void 0, false, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 496,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "admin-primary-btn",
                                    onClick: ()=>saveFaq({
                                            id: 't' + Date.now(),
                                            category: 'General',
                                            question: 'New Question?',
                                            answer: '...',
                                            sort_order: 10
                                        }),
                                    children: "+ Add Question"
                                }, void 0, false, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 497,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                            lineNumber: 495,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gap: '1.5rem'
                            },
                            children: faqs.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "admin-card",
                                    style: {
                                        background: '#fafafa',
                                        border: '1px solid #eee'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gap: '1rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '1rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "admin-field",
                                                        style: {
                                                            flex: 2
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Question"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 504,
                                                                columnNumber: 74
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: f.question,
                                                                onChange: (e)=>setFaqs((prev)=>prev.map((item)=>item.id === f.id ? {
                                                                                ...item,
                                                                                question: e.target.value
                                                                            } : item))
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 504,
                                                                columnNumber: 95
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 504,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "admin-field",
                                                        style: {
                                                            flex: 1
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Category"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 505,
                                                                columnNumber: 74
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: f.category,
                                                                onChange: (e)=>setFaqs((prev)=>prev.map((item)=>item.id === f.id ? {
                                                                                ...item,
                                                                                category: e.target.value
                                                                            } : item))
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 505,
                                                                columnNumber: 95
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 505,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 503,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "admin-field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Answer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 507,
                                                        columnNumber: 52
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        value: f.answer,
                                                        onChange: (e)=>setFaqs((prev)=>prev.map((item)=>item.id === f.id ? {
                                                                        ...item,
                                                                        answer: e.target.value
                                                                    } : item))
                                                    }, void 0, false, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 507,
                                                        columnNumber: 71
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 507,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "admin-field",
                                                        style: {
                                                            width: '80px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Sort"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 509,
                                                                columnNumber: 80
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: f.sort_order,
                                                                onChange: (e)=>setFaqs((prev)=>prev.map((item)=>item.id === f.id ? {
                                                                                ...item,
                                                                                sort_order: parseInt(e.target.value)
                                                                            } : item))
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 509,
                                                                columnNumber: 97
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 509,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            gap: '0.5rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>saveFaq(f),
                                                                className: "admin-primary-btn",
                                                                style: {
                                                                    padding: '0.4rem 1rem'
                                                                },
                                                                children: "Save"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 511,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: async ()=>{
                                                                    if (confirm('Delete?')) {
                                                                        await fetch(`/api/admin/faq?id=${f.id}`, {
                                                                            method: 'DELETE'
                                                                        });
                                                                        fetchData();
                                                                    }
                                                                },
                                                                className: "admin-ghost-btn",
                                                                style: {
                                                                    color: '#9d3030'
                                                                },
                                                                children: "✕"
                                                            }, void 0, false, {
                                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                                lineNumber: 512,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                        lineNumber: 510,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 508,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 502,
                                        columnNumber: 19
                                    }, this)
                                }, f.id, false, {
                                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                    lineNumber: 501,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                            lineNumber: 499,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 494,
                    columnNumber: 11
                }, this) : CONTENT_DEFINITION.find((t)=>t.id === activeTab).sections.map((sec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '3rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    marginBottom: '1.5rem',
                                    color: '#c9993a',
                                    borderBottom: '1px solid #eee',
                                    paddingBottom: '0.5rem'
                                },
                                children: sec.label
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 522,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '1.5rem'
                                },
                                children: sec.fields.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "admin-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: f.label
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 526,
                                                columnNumber: 19
                                            }, this),
                                            f.type === 'textarea' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: content[f.key] || '',
                                                onChange: (e)=>setContent({
                                                        ...content,
                                                        [f.key]: e.target.value
                                                    }),
                                                style: {
                                                    minHeight: '80px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 528,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: content[f.key] || '',
                                                onChange: (e)=>setContent({
                                                        ...content,
                                                        [f.key]: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                                lineNumber: 530,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, f.key, true, {
                                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                        lineNumber: 525,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 523,
                                columnNumber: 13
                            }, this)
                        ]
                    }, sec.label, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 521,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 492,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 479,
        columnNumber: 5
    }, this);
}
// ── USERS MODULE (Table Style) ──────────────────────────────────────────────
function UsersModule({ setState }) {
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const fetchUsers = async ()=>{
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchUsers();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "module-users",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-module-title",
                        children: "User Management"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "admin-primary-btn",
                        onClick: async ()=>{
                            const email = prompt('Email?');
                            if (email) await fetch('/api/admin/users', {
                                method: 'POST',
                                body: JSON.stringify({
                                    email,
                                    name: 'New Staff',
                                    password: 'password123',
                                    role: 'staff'
                                })
                            });
                            fetchUsers();
                        },
                        children: "+ Add Staff"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 560,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-table-header",
                style: {
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 80px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "User"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 568,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 568,
                        columnNumber: 26
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Role"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 568,
                        columnNumber: 44
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Joined"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 568,
                        columnNumber: 61
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Action"
                    }, void 0, false, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 568,
                        columnNumber: 80
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 567,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-table-body",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        padding: '2rem'
                    },
                    children: "Loading Staff..."
                }, void 0, false, {
                    fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                    lineNumber: 571,
                    columnNumber: 20
                }, this) : users.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-table-row",
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '2fr 2fr 1fr 1fr 80px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: u.name
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 573,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: u.email
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 573,
                                columnNumber: 38
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: u.role
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 573,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: new Date(u.createdAt).toLocaleDateString()
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 573,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    if (confirm('Delete?')) {
                                        await fetch(`/api/admin/users?id=${u.id}`, {
                                            method: 'DELETE'
                                        });
                                        fetchUsers();
                                    }
                                },
                                style: {
                                    background: 'none',
                                    border: 'none',
                                    color: '#9d3030',
                                    cursor: 'pointer'
                                },
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                                lineNumber: 574,
                                columnNumber: 13
                            }, this)
                        ]
                    }, u.id, true, {
                        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                        lineNumber: 572,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 570,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 557,
        columnNumber: 5
    }, this);
}
// ── PERMISSIONS MODULE ───────────────────────────────────────────────────────
function PermissionsModule({ setState }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '4rem',
            textAlign: 'center',
            color: '#9a8678',
            background: '#fff',
            borderRadius: '2rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "Permissions Matrix"
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 586,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$soulfullbites$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "The visual matrix is being ported. Permissions are currently managed via the User Management tab overrides."
            }, void 0, false, {
                fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
                lineNumber: 587,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/soulfullbites/app/admin/dashboard/page.js",
        lineNumber: 585,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=soulfullbites_app_admin_dashboard_page_0646fcv.js.map