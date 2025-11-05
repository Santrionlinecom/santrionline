import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canAccessOperational } from '~/lib/rbac';
import { listPelanggaran, recordPelanggaran } from '~/services/tahfidz.server';

type PelanggaranPayload = {
  santriId?: string;
  kategori?: string;
  poin?: number | null;
  tindakan?: string | null;
  tanggal?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin melihat data pelanggaran' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const data = await listPelanggaran(db, {
    santriId: url.searchParams.get('santriId') || undefined,
    limit: Number(url.searchParams.get('limit') ?? 100),
  });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin mencatat pelanggaran' }, { status: 403 });
  }
  const db = getDb(context);
  try {
    const body = (await request.json()) as PelanggaranPayload;
    if (!body?.santriId || !body?.kategori) {
      return json({ error: 'santriId dan kategori wajib diisi' }, { status: 400 });
    }
    await recordPelanggaran(db, {
      santriId: body.santriId,
      kategori: body.kategori,
      poin: body.poin ?? null,
      tindakan: body.tindakan ?? null,
      tanggal: body.tanggal ? new Date(body.tanggal) : null,
      petugasId: user.id,
    });
    return json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
