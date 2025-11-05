import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canAccessOperational } from '~/lib/rbac';
import { listPrestasi, recordPrestasi } from '~/services/tahfidz.server';

type PrestasiPayload = {
  santriId?: string;
  jenis?: string;
  deskripsi?: string | null;
  tanggal?: string | null;
  penyelenggara?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin melihat data prestasi' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const data = await listPrestasi(db, {
    santriId: url.searchParams.get('santriId') || undefined,
    limit: Number(url.searchParams.get('limit') ?? 100),
  });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canAccessOperational(user.role)) {
    return json({ error: 'Tidak memiliki izin mencatat prestasi' }, { status: 403 });
  }
  const db = getDb(context);
  try {
    const body = (await request.json()) as PrestasiPayload;
    if (!body?.santriId || !body?.jenis) {
      return json({ error: 'santriId dan jenis prestasi wajib diisi' }, { status: 400 });
    }
    await recordPrestasi(db, {
      santriId: body.santriId,
      jenis: body.jenis,
      deskripsi: body.deskripsi ?? null,
      tanggal: body.tanggal ? new Date(body.tanggal) : null,
      penyelenggara: body.penyelenggara ?? null,
    });
    return json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
