#!/usr/bin/env tsx
/**
 * Unified migration runner.
 * For now delegates to wrangler d1 migrations apply.
 * Future: add drizzle-kit diff & apply logic.
 */

import { execSync } from 'node:child_process';

const dbName = process.env.D1_DATABASE_NAME || 'inti-santri';
try {
  console.log(`[migrate] Applying migrations for ${dbName}`);
  // Auto-confirm with --yes to avoid interactive prompt
  execSync(`npx wrangler d1 migrations apply ${dbName}`, { stdio: 'inherit' });
  console.log('[migrate] Done');
} catch (e) {
  console.error('[migrate] Failed', e);
  process.exit(1);
}
