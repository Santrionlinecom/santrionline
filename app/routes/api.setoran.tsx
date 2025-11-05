import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canRecordSetoran, canValidateSetoran, canViewSantriProgress } from '~/lib/rbac';
import {
  createSetoranRecord,
  listSetoran,
  updateSetoranStatus,
  getAsatidzIdForUser,
} from '~/services/tahfidz.server';

type SetoranPayload = {
  id?: string;
  santriId?: string;
  halaqohId?: string;
  jenis?: 'ziyadah' | 'murajaah';
  juz?: number | null;
  surat?: string | null;
  ayatFrom?: number | null;
  ayatTo?: number | null;
  catatan?: string | null;
  status?: 'validated' | 'rejected';
  validatorId?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  const url = new URL(request.url);
  const santriId = url.searchParams.get('santriId') || undefined;
  const halaqohId = url.searchParams.get('halaqohId') || undefined;
  const status = url.searchParams.get('status') || undefined;

  if (!canViewSantriProgress(user.role) && !canRecordSetoran(user.role)) {
    return json({ error: 'Tidak memiliki izin untuk melihat setoran' }, { status: 403 });
  }

  const db = getDb(context);
  const data = await listSetoran(db, {
    santriId,
    halaqohId,
    status: status as 'pending' | 'validated' | 'rejected' | undefined,
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
      if (!canRecordSetoran(user.role)) {
        return json({ error: 'Tidak memiliki izin' }, { status: 403 });
      }
      const body = (await request.json()) as SetoranPayload;
      if (!body?.santriId || !body?.halaqohId || !body?.jenis) {
        return json({ error: 'Data setoran belum lengkap' }, { status: 400 });
      }
      const id = await createSetoranRecord(db, {
        santriId: body.santriId,
        halaqohId: body.halaqohId,
        jenis: body.jenis,
        juz: body.juz ?? null,
        surat: body.surat ?? null,
        ayatFrom: body.ayatFrom ?? null,
        ayatTo: body.ayatTo ?? null,
        catatan: body.catatan ?? null,
        createdBy: user.id,
      });
      return json({ data: { id } }, { status: 201 });
    }

    if (method === 'PATCH') {
      if (!canValidateSetoran(user.role)) {
        return json({ error: 'Tidak memiliki izin untuk validasi' }, { status: 403 });
      }
      const body = (await request.json()) as SetoranPayload;
      if (!body?.id || !body?.status) {
        return json({ error: 'id dan status wajib diisi' }, { status: 400 });
      }
      if (!['validated', 'rejected'].includes(body.status)) {
        return json({ error: 'Status tidak valid' }, { status: 400 });
      }
      let validatorId = body.validatorId as string | undefined;
      if (!validatorId) {
        validatorId = (await getAsatidzIdForUser(db, user.id)) ?? undefined;
      }
      if (!validatorId) {
        return json({ error: 'Akun belum terdaftar sebagai asatidz' }, { status: 400 });
      }
      await updateSetoranStatus(db, body.id, {
        status: body.status,
        validatorId,
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
