import 'dotenv/config';
import { migrate } from 'drizzle-orm/d1-http/migrator';
import { drizzle } from 'drizzle-orm/d1-http';

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error('Missing CLOUDFLARE_ACCOUNT_ID, DATABASE_ID, or CLOUDFLARE_API_TOKEN.');
  }

  const db = drizzle({
    accountId,
    databaseId,
    token: apiToken,
  });

  await migrate(db, { migrationsFolder: './migrations' });
  console.log('✅ D1 migrations applied successfully');
}

main().catch((error) => {
  console.error('❌ Failed to run migrations', error);
  process.exit(1);
});
