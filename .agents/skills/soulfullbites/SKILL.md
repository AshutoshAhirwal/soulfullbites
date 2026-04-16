---
name: soulfullbites
description: Comprehensive management and development guide for the SoulfullBites e-commerce platform.
---

# SoulfullBites Management Skill

This skill provides the necessary context and instructions to maintain, debug, and enhance the SoulfullBites artisanal chocolate platform.

## 🏗️ Project Architecture

SoulfullBites is a modern e-commerce application built with a focus on immersive 3D storytelling and a serverless backend.

- **Frontend**: Vite-powered SPA with Three.js, GSAP, and Lenis for smooth scrolling.
- **Backend**: Serverless functions (Vercel style) located in the `/api` directory.
- **Database**: PostgreSQL hosted on Neon, accessed via `@neondatabase/serverless`.
- **Emails**: Transactional emails powered by Resend; client-side feedback via EmailJS.

## 🎨 Frontend Development

### Three.js Scene (`home-scene.js`)
The immersive experience is managed by the `ChocolateScene` class.
- **Stations**: The scrollytelling follows "stations" (sections) mapped to `scrollP` (0 to 1).
- **Hero Element**: The breaking chocolate bar is a `Group` containing left/right halves, drips, and crumbs.
- **Assets**: 3D textures and image planes are loaded from `/assets`.
- **Particles**: Bokeh and dust particles enhance the atmosphere.

**Key Task: Adding a Section**
1. Add a `.scroll-section` in `index.html`.
2. Update the `stations` array and `ScrollTrigger` logic in `home-scene.js` -> `bindScroll()`.
3. If a new 3D element is needed, add it in the `loop()` or as a new `build...` method.

### Styling (`style.css`)
The site uses a premium, artisanal design system with:
- **Colors**: Rich browns (`--choc-dark`), golds (`--gold`), and creams.
- **Typography**: Editorial-grade serif and modern sans-serif.

## 📦 Order & Inventory Management

### Shop & Cart (`main.js`)
- **Cart**: Managed via `BAG_STORAGE_KEY` (localStorage).
- **Products**: Defined statically in `shop.html` data-attributes on `.product-card`.

**Add/Update Product**:
Edit `shop.html` and update the `data-id`, `data-name`, and `data-price` on the product card.

### Order Processing (`api/send-order.js`)
Orders are sent to this endpoint via POST.
1. Validates input.
2. Creates an order record in Neon DB (`api/_lib/orders.js`).
3. Sends a notification email to the owner.
4. Sends a confirmation email to the customer (if enabled/verified).

## 🔐 Admin Dashboard

The dashboard is located at `/admin.html`.
- **Status**: Orders can be marked as 'new', 'shipped', or 'delivered'.
- **Persistence**: Updates are saved directly to the Neon DB via `api/admin-order-update.js`.

## 🛠️ Configuration (Environment Variables)

Ensure the following are set in `.env.local` or deployment platform:
- `DATABASE_URL`: Neon PostgreSQL connection string.
- `RESEND_API_KEY`: API key for email delivery.
- `RESEND_OWNER_EMAILS`: Comma-separated list of admin email recipients.
- `RESEND_FROM_EMAIL`: The "From" address for customer emails.

## 🔍 Debugging Tips

- **3D Issues**: Check the browser console for Three.js loader errors or WebGL context losses.
- **API Failures**: Inspect the Network tab for responses from `/api/send-order`. Most errors are logged with descriptive messages.
- **Database**: Use the Neon console to inspect the `orders` table if records aren't showing in the admin dashboard.

---
*Created by Antigravity for SoulfullBites.*
