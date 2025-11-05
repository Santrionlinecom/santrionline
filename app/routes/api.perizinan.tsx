import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canAccessOperational } from '~/lib/rbac';
import { listPerizinan, recordPerizinan, updatePerizinanStatus } from '~/services/tahfidz.server';

type PerizinanPayload = {
  id?: string;
  santriId?: string;
  tipe?: string;
  tanggalKeluar?: string;
  tanggalKembali?: string | null;
  status?: 'pending' | 'disetujui' | 'ditolak' | 'kembali';
  keterangan?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin melihat data perizinan' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const allowedStatus: PerizinanPayload['status'][] = [
    'pending',
    'disetujui',
    'ditolak',
    'kembali',
  ];
  const status = allowedStatus.includes(statusParam as PerizinanPayload['status'])
    ? (statusParam as PerizinanPayload['status'])
    : undefined;
  const data = await listPerizinan(db, {
    santriId: url.searchParams.get('santriId') || undefined,
    status,
    limit: Number(url.searchParams.get('limit') ?? 100),
  });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin mengelola perizinan' }, { status: 403 });
  }
  const db = getDb(context);
  const method = request.method.toUpperCase();

  try {
    if (method === 'POST') {
      const body = (await request.json()) as PerizinanPayload;
      if (!body?.santriId || !body?.tipe || !body?.tanggalKeluar) {
        return json({ error: 'santriId, tipe, dan tanggalKeluar wajib diisi' }, { status: 400 });
      }
      await recordPerizinan(db, {
        santriId: body.santriId,
        tipe: body.tipe,
        tanggalKeluar: new Date(body.tanggalKeluar),
        tanggalKembali: body.tanggalKembali ? new Date(body.tanggalKembali) : null,
        status: body.status ?? 'pending',
        keterangan: body.keterangan ?? null,
        petugasId: user.id,
      });
      return json({ ok: true }, { status: 201 });
    }

    if (method === 'PATCH') {
      const body = (await request.json()) as PerizinanPayload;
      if (!body?.id || !body?.status) {
        return json({ error: 'id dan status wajib diisi' }, { status: 400 });
      }
      if (!['pending', 'disetujui', 'ditolak', 'kembali'].includes(body.status)) {
        return json({ error: 'Status tidak valid' }, { status: 400 });
      }
      await updatePerizinanStatus(db, body.id, body.status, body.keterangan ?? null);
      return json({ ok: true });
    }

    return json({ error: 'Metode tidak didukung' }, { status: 405 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
