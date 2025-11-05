import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canViewSantriProgress } from '~/lib/rbac';
import { getSantriWeeklyProgress, listSetoran } from '~/services/tahfidz.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  const url = new URL(request.url);
  const santriId = url.searchParams.get('santriId');
  const halaqohId = url.searchParams.get('halaqohId') || undefined;
  if (!santriId) {
    return json({ error: 'santriId wajib diisi' }, { status: 400 });
  }
  if (!canViewSantriProgress(user.role)) {
    return json({ error: 'Tidak memiliki izin melihat progres' }, { status: 403 });
  }
  const db = getDb(context);
  const weeks = Number(url.searchParams.get('weeks') ?? 6);
  const weekly = await getSantriWeeklyProgress(db, santriId, weeks);
  const recentSetoran = await listSetoran(db, {
    santriId,
    halaqohId,
    status: 'validated',
    limit: 5,
  });
  return json({
    weekly,
    recent: recentSetoran,
  });
}

export const unstable_shouldReload = () => false;
