import { drizzle } from 'drizzle-orm/d1';
import type { AppLoadContext } from '@remix-run/cloudflare';
import * as schema from './schema';
import { log, recordQuery, maskObjectPII } from '~/lib/logger';

export function getDb(context: AppLoadContext) {
  const env = (context as { cloudflare?: { env?: { DB?: D1Database; SANTRI_DB?: D1Database } } })?.cloudflare?.env;
  const database = env?.DB ?? env?.SANTRI_DB;
  if (!database) {
    throw new Error('Database not found in context. Make sure D1 is configured properly.');
  }

  return drizzle(database, {
    schema,
    logger: {
      logQuery: (query, params) => {
        const start = Date.now();
        // Minimal synchronous logging; mask parameters
        log.sql('sql-start', {
          q: query.split(/\s+/).slice(0, 6).join(' '),
          params: maskObjectPII(params),
        });
        const dur = Date.now() - start; // approximate (drizzle's logger is synchronous after execution)
        recordQuery(query, dur);
      },
    },
  });
}

// Export type untuk TypeScript
export type Database = ReturnType<typeof getDb>;
