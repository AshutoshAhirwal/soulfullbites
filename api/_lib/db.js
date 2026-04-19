import { neon } from '@neondatabase/serverless';
import { cleanText } from './http.js';

let sqlClient;
let ordersTableReady = false;

export function getDatabaseUrl() {
  return cleanText(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);
}

export function hasDatabase() {
  return Boolean(getDatabaseUrl());
}

function getSql() {
  if (!sqlClient) {
    const connectionString = getDatabaseUrl();

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured');
    }

    sqlClient = neon(connectionString, {
      fetchOptions: { cache: 'no-store' },
    });
  }

  return sqlClient;
}

export async function dbQuery(query, params = []) {
  const sql = getSql();
  return sql.query(query, params);
}

export async function ensureOrdersTable() {
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
  } catch (e) { console.warn('Products migration warning:', e.message); }

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

  ordersTableReady = true;
}
