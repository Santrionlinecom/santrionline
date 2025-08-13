import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
// NOTE: dynamic import of db helper inside loader to avoid bundling
import { karya_events } from '~/db/schema';
import { desc, gt, and, eq, SQL } from 'drizzle-orm';

// Simple SSE endpoint for karya events
export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const since = url.searchParams.get('since'); // expects timestamp (ms) or empty
  const karyaId = url.searchParams.get('karyaId');
  const { getDb } = await import('~/db/drizzle.server');
  const db = getDb(context);

  // For now, one-shot JSON poll style (can be adapted to streaming if needed)
  const sinceDate = since ? new Date(Number(since)) : null;

  let where: SQL | undefined = undefined;
  if (sinceDate) {
    where = gt(karya_events.createdAt, sinceDate);
  }
  if (karyaId) {
    where = where
      ? and(where, eq(karya_events.karyaId, karyaId))
      : eq(karya_events.karyaId, karyaId);
  }

  const rows = await db
    .select()
    .from(karya_events)
    .where(where)
    .orderBy(desc(karya_events.createdAt))
    .limit(100);
  return json({ events: rows });
}

export const config = { runtime: 'edge' };
