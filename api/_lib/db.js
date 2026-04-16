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
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  ordersTableReady = true;
}
