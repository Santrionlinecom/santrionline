/* eslint-env node */
// LOCAL UTILITY ONLY - DO NOT IMPORT IN PRODUCTION / EDGE BUILD
// Uses better-sqlite3 (native). Keep isolated so Cloudflare Pages bundler never touches it.
// To run: node scripts/local/fix-database.js

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

if (process.env.CLOUDFLARE && !process.env.ALLOW_NATIVE) {
  console.error('This script should not run in Cloudflare environment. Aborting.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path if needed for your local D1 mirror
const dbPath = path.join(
  __dirname,
  '..',
  '..',
  '.wrangler',
  'state',
  'v3',
  'd1',
  'miniflare-D1DatabaseObject',
  '65fc24d0f92dc148f01ade05d21a3a15f8147f452c64d03e41dab09b2bfea19c.sqlite',
);

console.log('🔍 Checking database path:', dbPath);

try {
  const db = new Database(dbPath);
  console.log('✅ Connected to database');

  const table = 'topup_requests';
  const exists = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
    .get(table);

  if (exists) {
    console.log(`✅ ${table} table already exists`);
  } else {
    console.log(`❌ ${table} table does not exist, creating...`);
    db.exec(`CREATE TABLE IF NOT EXISTS ${table} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL CHECK (currency IN ('dincoin','dircoin')),
      transfer_amount INTEGER,
      payment_method TEXT NOT NULL,
      bank_account TEXT,
      whatsapp_number TEXT,
      payment_proof TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✅ Table created');
  }

  db.close();
  console.log('🏁 Done');
} catch (e) {
  console.error('❌ Error operating on database:', e);
  process.exit(1);
}
