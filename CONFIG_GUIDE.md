# SoulfullBites Security & Gateway Configuration

This guide helps you manage the keys required for payments, emails, and database features.

---

### 1. Payment Gateway (Razorpay)
Used for processing customer payments.
- **`RAZORPAY_KEY_ID`**: Your public key from the Razorpay Dashboard (Settings > API Keys).
- **`RAZORPAY_KEY_SECRET`**: Your private secret key (keep this hidden).

### 2. Email Service (Resend)
Used for automated order confirmations and sales alerts.
- **`RESEND_API_KEY`**: Get this from [resend.com](https://resend.com/api-keys).
- **`RESEND_FROM_EMAIL`**: The email address customers see. (e.g., `SoulfullBites <hello@yourdomain.com>`)
- **`RESEND_OWNER_EMAILS`**: comma-separated list of emails to receive "New Order" alerts.

### 3. Database (Neon)
Stores order history and customer reviews.
- **`DATABASE_URL`**: Your PostgreSQL connection string from [neon.tech](https://neon.tech).

### 4. Admin Dashboard
Security for your internal operations console.
- **`ADMIN_PASSWORD`**: The password you type to log in to `/admin.html`.
- **`ADMIN_SESSION_SECRET`**: A random long string used to sign secure cookies.

---

## How to Update
1. Open your `.env.local` file (for local development) or **Vercel Project Settings > Environment Variables** (for the live website).
2. Replace the values with your actual keys.
3. Redeploy the site for changes to take effect.
