import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canViewSantriProgress } from '~/lib/rbac';
import { listSetoran } from '~/services/tahfidz.server';

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canViewSantriProgress(user.role)) {
    return json({ error: 'Tidak memiliki izin' }, { status: 403 });
  }
  const db = getDb(context);
  const { santriId } = params;
  if (!santriId) {
    return json({ error: 'santriId tidak valid' }, { status: 400 });
  }
  const data = await listSetoran(db, {
    santriId,
    limit: Number(new URL(request.url).searchParams.get('limit') ?? 100),
  });
  return json({ data });
}

export const unstable_shouldReload = () => false;
