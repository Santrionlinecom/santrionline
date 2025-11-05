import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canRecordExam, canViewSantriProgress } from '~/lib/rbac';
import { createUjianRecord, finalizeUjian, listUjian } from '~/services/tahfidz.server';

type UjianPayload = {
  id?: string;
  santriId?: string;
  jenis?: 'pelancaran' | 'tasmi' | 'tahsin' | 'juz_amma';
  level?: string | null;
  nilai?: number | null;
  tanggal?: string | null;
  pengujiId?: string | null;
  catatan?: string | null;
  status?: 'lulus' | 'remedial' | 'proses';
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canViewSantriProgress(user.role) && !canRecordExam(user.role)) {
    return json({ error: 'Tidak memiliki akses riwayat ujian' }, { status: 403 });
  }
  const url = new URL(request.url);
  const santriId = url.searchParams.get('santriId') || undefined;
  const jenis = url.searchParams.get('jenis') || undefined;
  const db = getDb(context);
  const data = await listUjian(db, {
    santriId,
    jenis: jenis as 'pelancaran' | 'tasmi' | 'tahsin' | 'juz_amma' | undefined,
    limit: Number(url.searchParams.get('limit') ?? 50),
  });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  const db = getDb(context);
  const method = request.method.toUpperCase();

  try {
    if (method === 'POST') {
      if (!canRecordExam(user.role)) {
        return json({ error: 'Tidak memiliki izin mencatat ujian' }, { status: 403 });
      }
      const body = (await request.json()) as UjianPayload;
      if (!body?.santriId || !body?.jenis) {
        return json({ error: 'santriId dan jenis ujian wajib diisi' }, { status: 400 });
      }
      const id = await createUjianRecord(db, {
        santriId: body.santriId,
        jenis: body.jenis,
        level: body.level ?? null,
        nilai: body.nilai ?? null,
        tanggal: body.tanggal ? new Date(body.tanggal) : null,
        pengujiId: body.pengujiId ?? null,
        catatan: body.catatan ?? null,
        status: body.status ?? 'proses',
      });
      return json({ data: { id } }, { status: 201 });
    }

    if (method === 'PATCH') {
      if (!canRecordExam(user.role)) {
        return json({ error: 'Tidak memiliki izin memperbarui ujian' }, { status: 403 });
      }
      const body = (await request.json()) as UjianPayload;
      if (!body?.id || !body?.status) {
        return json({ error: 'id dan status wajib diisi' }, { status: 400 });
      }
      if (body.status !== 'lulus' && body.status !== 'remedial') {
        return json({ error: 'Status ujian tidak valid' }, { status: 400 });
      }
      await finalizeUjian(db, body.id, {
        status: body.status,
        nilai: body.nilai ?? null,
        catatan: body.catatan ?? null,
      });
      return json({ ok: true });
    }

    return json({ error: 'Metode tidak didukung' }, { status: 405 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
