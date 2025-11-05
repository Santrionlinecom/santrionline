import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canRecordSetoran, canViewSantriProgress } from '~/lib/rbac';
import { listSetoran } from '~/services/tahfidz.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canViewSantriProgress(user.role) && !canRecordSetoran(user.role)) {
    return json({ error: 'Tidak memiliki izin ekspor data' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const santriId = url.searchParams.get('santriId') || undefined;
  const halaqohId = url.searchParams.get('halaqohId') || undefined;
  const data = await listSetoran(db, {
    santriId,
    halaqohId,
    limit: Number(url.searchParams.get('limit') ?? 500),
  });
  const header = [
    'ID',
    'Santri',
    'Halaqoh',
    'Jenis',
    'Juz',
    'Surat',
    'Ayat Dari',
    'Ayat Sampai',
    'Tanggal',
    'Status',
  ];
  const rows = data.map((row) => [
    row.id,
    row.santriId,
    row.halaqohId,
    row.jenis,
    row.juz ?? '',
    row.surat ?? '',
    row.ayatFrom ?? '',
    row.ayatTo ?? '',
    row.tanggal,
    row.status,
  ]);
  const csv = [header, ...rows]
    .map((cols) => cols.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="setoran.csv"',
    },
  });
}

export const unstable_shouldReload = () => false;
