import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { karya_events, karya, user } from '~/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
// NOTE: server-only imports (db, session) dynamically imported inside loader
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  // Simple role check (assumes role field) - adapt if different
  const me = await db.query.user.findFirst({ where: eq(user.id, userId) });
  if (!me || me.role !== 'admin') {
    throw new Response('Unauthorized', { status: 403 });
  }

  const url = new URL(request.url);
  const limit = Math.min(200, parseInt(url.searchParams.get('limit') || '100'));
  const rows = await db
    .select()
    .from(karya_events)
    .orderBy(desc(karya_events.createdAt))
    .limit(limit);

  // Optionally join karya titles (best-effort)
  const karyaMap: Record<string, string> = {};
  if (rows.length) {
    const ids = Array.from(new Set(rows.map((r) => r.karyaId)));
    // naive fetch in batches of 50
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50);
      const ks = await db
        .select({ id: karya.id, title: karya.title })
        .from(karya)
        .where(inArray(karya.id, batch));
      ks.forEach((k) => {
        karyaMap[k.id] = k.title || k.id;
      });
    }
  }

  return json({ events: rows, karyaMap });
}

export default function AdminKaryaAuditPage() {
  const { events, karyaMap } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Audit Log Karya</h1>
      <div className="space-y-4">
        {events.map((e) => {
          const payload = (() => {
            try {
              return e.payloadJson ? JSON.parse(e.payloadJson) : {};
            } catch {
              return {};
            }
          })();
          return (
            <Card key={e.id} className="border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Badge variant="outline">{e.type}</Badge>
                  <span className="font-semibold">{karyaMap[e.karyaId] || e.karyaId}</span>
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {new Date(e.createdAt as string).toLocaleString('id-ID')}
                </span>
              </CardHeader>
              <CardContent className="pt-0 text-xs font-mono whitespace-pre-wrap break-all">
                {JSON.stringify(payload, null, 2)}
              </CardContent>
            </Card>
          );
        })}
        {events.length === 0 && (
          <div className="text-sm text-muted-foreground">Belum ada event.</div>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <Button asChild size="sm" variant="outline">
          <a href="/admin/karya-audit?limit=100">Reload</a>
        </Button>
      </div>
    </div>
  );
}
