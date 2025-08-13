import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
// NOTE: no need for drizzle server import here; using direct D1 binding

/*
  Health / diagnostics endpoint for Karya schema & events system.
  Returns:
    - columns of karya table
    - indexes on karya table
    - columns of karya_events table
    - whether test-event-1 exists

  Safe to keep in dev; restrict or remove in production if exposing internal structure is not desired.
*/
export async function loader({ context }: LoaderFunctionArgs) {
  // Attempt to access raw D1 binding for PRAGMA (drizzle does not expose convenience helpers)
  // Depending on project setup, env may be on context.cloudflare.env or context.env.
  // We try multiple fallbacks.
  const env =
    (context as { cloudflare?: { env?: { DB?: D1Database } }; env?: { DB?: D1Database } })
      .cloudflare?.env ||
    (context as { env?: { DB?: D1Database } }).env ||
    {};
  const d1 = env.DB;

  const result: { ok: boolean; notes: string[]; error?: string; [key: string]: unknown } = {
    ok: true,
    notes: [],
  };
  if (!d1 || !('prepare' in d1)) {
    result.ok = false;
    result.error = 'D1 binding not found (expected env.DB)';
    return json(result, { status: 500 });
  }

  async function safeQuery(label: string, sql: string) {
    try {
      const { results } = await d1!.prepare(sql).all();
      result[label] = results;
    } catch (e) {
      result[label] = { error: e instanceof Error ? e.message : String(e) };
    }
  }

  await safeQuery('karya_columns', 'PRAGMA table_info(karya);');
  await safeQuery('karya_indexes', 'PRAGMA index_list(karya);');
  await safeQuery('karya_events_columns', 'PRAGMA table_info(karya_events);');
  await safeQuery('test_event', "SELECT id FROM karya_events WHERE id='test-event-1';");

  return json(result);
}

export const config = { runtime: 'edge' };
