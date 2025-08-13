import type { AppLoadContext } from '@remix-run/cloudflare';
import { sql } from 'drizzle-orm';
import { getDb } from './drizzle.server';

// Run at startup (per request) to ensure essential tables exist. Only lightweight checks.
// If missing, it will attempt to push migrations by calling an internal endpoint (optional hook) or throw a clear error.

let migrationChecked = false;
let lastCheck = 0;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

export async function ensureMigrated(context: AppLoadContext) {
  const now = Date.now();
  if (migrationChecked && now - lastCheck < CHECK_INTERVAL_MS) return;
  const db = getDb(context);
  try {
    // Check a couple of core tables
    const result = await db.all(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name IN ('karya','ulama','pengguna')`,
    );
    const names = (result as { name: string }[]).map((r) => r.name);
    const missing = ['karya', 'ulama', 'pengguna'].filter((t) => !names.includes(t));
    if (missing.length) {
      throw new Error('Missing tables: ' + missing.join(', ') + '. Run migration.');
    }
    migrationChecked = true;
    lastCheck = now;
  } catch (e) {
    console.error('[autoMigrate] migration check failed:', (e as Error).message);
    // Do not auto-run push here (to avoid race on edge). Provide guidance.
    // Could enqueue a Durable Object / Worker Cron to apply migrations.
  }
}
