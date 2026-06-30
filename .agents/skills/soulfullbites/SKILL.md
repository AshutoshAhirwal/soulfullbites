---
name: soulfullbites
description: Comprehensive management and development guide for the SoulfullBites e-commerce platform.
---

# SoulfullBites Management Skill

This skill provides the necessary context and instructions to maintain, debug, and enhance the SoulfullBites artisanal chocolate platform.

## 🏗️ Project Architecture

SoulfullBites is a modern e-commerce application built with a focus on immersive 3D storytelling and a role-based serverless backend.

- **Frontend & Routing**: Next.js App Router (React) centered at `/app`. Home page uses Three.js, GSAP, and Lenis for scrollytelling (`home-scene.js`).
- **Backend APIs**: Next.js App routes located in `app/api/`.
- **Database**: PostgreSQL hosted on Neon, accessed via `@neondatabase/serverless` using custom Google DNS resolution patch to bypass local ISP constraints.
- **Emails**: Transactional emails powered by Resend with safe recipient filtering in test modes (`lib/emails.js`).
- **Payments**: Razorpay integration for INR payments (`app/api/checkout/[action]/route.js`).

---

## 🎨 Frontend Development

### Three.js Scene (`home-scene.js`)
The immersive 3D experience is managed by the `ChocolateScene` class.
- **Stations**: Scrollytelling follows "stations" (sections) mapped to `scrollP` (0 to 1).
- **Hero Element**: Breaking chocolate bar is a `Group` containing left/right halves, drips, and crumbs.
- **Assets**: 3D textures, models, and image planes are loaded from `/assets` (served from `/public` in Next.js).
- **Particles**: Bokeh and dust particles enhance the atmosphere.

**Key Task: Adding a Section**
1. Add a section markup in `app/page.js`.
2. Update the `stations` array and `ScrollTrigger` logic in `home-scene.js` -> `bindScroll()`.
3. If a new 3D element is needed, add it in the render `loop()` or as a new `build...` method.

---

## 📦 Database & Catalog Management

All database schemas are initialized programmatically in [lib/db.js](file:///Users/ashutoshahirwal/Drupal%20Projects/soulfullbites/lib/db.js).

### Products & Cart
- **Cart**: Managed via `BAG_STORAGE_KEY` (localStorage).
- **Products**: Stored in Neon DB `products` table. Falls back to static `DEFAULT_PRODUCTS` in `lib/products.js` if the database is unconfigured.
- **Dynamic CMS**: Static string properties on the frontend pull from the `site_content` table via `GET /api/content`.

**Upserting Products**:
To add or edit products, use the admin dashboard or POST to `/api/admin/products`.

---

## 🔐 Authentication, RBAC & Security

The system employs a JWT session system signed via `jose` and stored in a secure cookie `soulfull_user_session`.

### Roles & Permissions (`lib/permissions.js`)
- **`ashu`**: Owner/Admin role. Bypasses permission checks (has full permissions).
- **`staff`**: Administrative staff. Can view orders, moderate reviews, edit products, upload files, and alter CMS.
- **`user`**: Default customer role. Can manage own addresses, wishlist, and check personal order histories.

### Security Defenses (`lib/security.js`)
- **Turnstile CAPTCHA**: Used on checkout and waitlist actions. Set `TURNSTILE_SECRET_KEY` in environment variables to enforce.
- **Honeypot Verification**: Validated by `checkHoneypot(body)` and `hasFilledHoneypot(value)` functions.
- **IP Rate Limiting**: Tracked dynamically in-memory using sliding-window timers.

---

## 🛠️ Configuration (Environment Variables)

Ensure the following are set in `.env.local`:
- `DATABASE_URL`: Neon PostgreSQL connection string.
- `JWT_SECRET` / `ADMIN_SESSION_SECRET`: Session signature key.
- `RAZORPAY_KEY_ID`: Razorpay public API key.
- `RAZORPAY_KEY_SECRET`: Razorpay secret API key.
- `RESEND_API_KEY`: API key for Resend email delivery.
- `RESEND_OWNER_EMAILS`: Comma-separated list of admin email recipients.
- `RESEND_FROM_EMAIL`: The "From" address for customer emails.

---

## 🔍 Debugging Tips

- **Next.js Compilation / Building**: Run `npm run build` or `npm run dev`. Ensure `lib/security.js` exports `hasFilledHoneypot` and `verifyTurnstile` as they are key dependencies for routing checkout handlers.
- **Database Schema Errors**: If table modifications are required, add `ALTER TABLE` operations within `ensureOrdersTable()` in `lib/db.js` to run migration scripts dynamically.
- **Vercel Deployments**: The project compiles under Next.js. Deploy configuration is in `vercel.json`.
