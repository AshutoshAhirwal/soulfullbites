# 🍫 SoulfullBites

> **Artisanal Chocolate Experience** — Where immersive storytelling meets fine cocoa.

SoulfullBites is a high-end e-commerce platform designed to provide a cinematic, 3D-driven shopping journey for artisanal chocolate lovers. Built with Three.js and a serverless backend, it bridges the gap between digital art and commerce.

---

## ✨ Key Features

- **🎬 Immersive 3D Scrollytelling**: A seamless Three.js experience following the story of cocoa, with synchronized 3D animations (GSAP/ScrollTrigger).
- **🛒 Gourmet Cart System**: A sleek, persistent shopping bag for managing collections of artisanal bars.
- **🚀 Ultra-Smooth Motion**: Powered by Lenis for high-performance scroll interpolation.
- **🔐 Admin Dashboard**: A secure management suit for tracking orders and updating shipment statuses.
- **📧 Transactional Emails**: Automated order confirmations and waitlist notifications via Resend.
- **💾 Serverless Persistence**: Fast, scalable order storage using Neon PostgreSQL.

## 🛠️ Tech Stack

- **Frontend**: Vite, Three.js, GSAP, Lenis, CSS3 (Custom Design System)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Neon (PostgreSQL)
- **Emails**: Resend & EmailJS
- **Animation Sequencing**: Theatre.js

## 🚀 Quick Start

### Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` (see Environment Variables section below).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment
Simply import your GitHub repository to Vercel. All configurations for clean URLs and API routes are automatically handled by `vercel.json` and `vite.config.js`.

## ⚙️ Environment Variables

Ensure the following variables are configured in your deployment environment:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string. |
| `RESEND_API_KEY` | API key from Resend.com. |
| `ADMIN_PASSWORD` | The password for accessing `/admin`. |
| `ADMIN_SESSION_SECRET` | A secure random string for signing admin sessions. |
| `RESEND_OWNER_EMAILS` | Comma-separated list of admin email recipients. |
| `RESEND_FROM_EMAIL` | Verified sender address (e.g., `hello@yourdomain.com`). |

## 📁 Project Structure

- `/api`: Serverless backend logic and database handlers.
- `/public/assets`: High-fidelity 3D textures and brand assets.
- `main.js`: Core frontend logic and state management.
- `home-scene.js`: The Three.js 3D engine and animation orchestration.
- `index.html`: The main scrollytelling entry point.

---
*Created with passion by SoulfullBites Studio.*
