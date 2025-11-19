import { drizzle } from 'drizzle-orm/d1';
import type { AppLoadContext } from '@remix-run/cloudflare';
import * as schema from './santri-app-schema';

export function getSantriDb(context: AppLoadContext) {
  const database = (context as { cloudflare?: { env?: { SANTRI_DB?: D1Database } } })?.cloudflare?.env?.SANTRI_DB;
  if (!database) {
    throw new Error('SANTRI_DB binding is missing. Please configure D1 in wrangler.toml.');
  }
  return drizzle(database, { schema });
}

export type SantriDatabase = ReturnType<typeof getSantriDb>;
export * from './santri-app-schema';
