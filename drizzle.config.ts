// drizzle-kit version in this project does not export defineConfig; use plain object export

// IMPORTANT: Semua credential wajib di-set melalui environment variable.
// Hilangkan fallback hardcoded untuk mencegah kebocoran token.
const { CLOUDFLARE_ACCOUNT_ID, DATABASE_ID, CLOUDFLARE_API_TOKEN } = process.env;
if (!CLOUDFLARE_ACCOUNT_ID || !DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
  // eslint-disable-next-line no-console
  console.warn(
    '[drizzle-config] Missing one or more required env vars: CLOUDFLARE_ACCOUNT_ID, DATABASE_ID, CLOUDFLARE_API_TOKEN',
  );
}

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: DATABASE_ID || '',
    token: CLOUDFLARE_API_TOKEN || '',
  },
  introspect: { casing: 'preserve' },
  verbose: true,
  strict: false,
};
