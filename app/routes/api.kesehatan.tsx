import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canAccessOperational } from '~/lib/rbac';
import { listKesehatan, recordKesehatan } from '~/services/tahfidz.server';

type KesehatanPayload = {
  santriId?: string;
  keluhan?: string;
  tindakan?: string | null;
  biaya?: number | null;
  tanggal?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin melihat data kesehatan' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const data = await listKesehatan(db, {
    santriId: url.searchParams.get('santriId') || undefined,
    limit: Number(url.searchParams.get('limit') ?? 100),
  });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin mencatat kesehatan' }, { status: 403 });
  }
  const db = getDb(context);
  try {
    const body = (await request.json()) as KesehatanPayload;
    if (!body?.santriId || !body?.keluhan) {
      return json({ error: 'santriId dan keluhan wajib diisi' }, { status: 400 });
    }
    await recordKesehatan(db, {
      santriId: body.santriId,
      keluhan: body.keluhan,
      tindakan: body.tindakan ?? null,
      biaya: body.biaya ?? null,
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
