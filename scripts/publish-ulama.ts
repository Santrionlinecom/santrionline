/*
  Script: publish-ulama.ts
  Purpose: Ensure every ulama row has authorId set to the admin user (8gdEHkswuvfxngOlfXPzz)
  NOTE: Running inside Cloudflare Pages Functions context is different; this script is primarily for local D1 via Wrangler.
*/
import { drizzle } from 'drizzle-orm/d1';

const ADMIN_ID = '8gdEHkswuvfxngOlfXPzz';

async function main() {
  // Expect a binding name e.g. SANTRI_DB or DB; try common ones
  const bindingName = process.env.D1_BINDING || 'DB';
  const globalObj = globalThis as Record<string, unknown>;
  const d1 = globalObj[bindingName] as D1Database | undefined;
  if (!d1) {
    console.error('D1 binding not found. Set D1_BINDING env or expose globalThis["DB"].');
    process.exit(1);
  }
  // Using drizzle for possible future expansions; raw execute for simplicity now
  drizzle(d1); // keep for side-effect / future use
  const selectRes = await d1
    .prepare('SELECT id, author_id FROM ulama WHERE author_id IS NULL')
    .all<{
      id: string;
      author_id: string | null;
    }>();
  const rows = selectRes?.results ?? [];
  if (rows.length === 0) {
    console.log('All ulama rows already have author_id.');
    return;
  }
  const now = Date.now();
  for (const r of rows) {
    await d1
      .prepare('UPDATE ulama SET author_id = ?, updated_at = ? WHERE id = ?')
      .bind(ADMIN_ID, now, r.id)
      .run();
  }
  console.log(`Updated ${rows.length} ulama rows with author_id=${ADMIN_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
