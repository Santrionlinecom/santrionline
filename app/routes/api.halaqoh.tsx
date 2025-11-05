import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canManageHalaqoh } from '~/lib/rbac';
import { createHalaqoh, listHalaqoh, updateHalaqoh } from '~/services/tahfidz.server';

type HalaqohPayload = {
  id?: string;
  nama?: string;
  asatidzId?: string;
  targetJuz?: number | null;
  catatan?: string | null;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canManageHalaqoh(user.role)) {
    return json({ error: 'Tidak memiliki izin' }, { status: 403 });
  }
  const db = getDb(context);
  const url = new URL(request.url);
  const includeMembers = url.searchParams.get('includeMembers') === 'true';
  const asatidzId = url.searchParams.get('asatidzId') || undefined;
  const data = await listHalaqoh(db, { asatidzId, includeMembers });
  return json({ data });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canManageHalaqoh(user.role)) {
    return json({ error: 'Tidak memiliki izin' }, { status: 403 });
  }
  const db = getDb(context);
  const method = request.method.toUpperCase();

  try {
    if (method === 'POST') {
      const body = (await request.json()) as HalaqohPayload;
      if (!body?.nama || !body?.asatidzId) {
        return json({ error: 'Nama halaqoh dan asatidzId wajib diisi' }, { status: 400 });
      }
      const created = await createHalaqoh(db, {
        nama: body.nama,
        asatidzId: body.asatidzId,
        targetJuz: body.targetJuz ?? null,
        catatan: body.catatan ?? null,
      });
      return json({ data: created }, { status: 201 });
    }

    if (method === 'PATCH' || method === 'PUT') {
      const body = (await request.json()) as HalaqohPayload;
      if (!body?.id) {
        return json({ error: 'ID halaqoh wajib diisi' }, { status: 400 });
      }
      const updated = await updateHalaqoh(db, body.id, {
        nama: body.nama,
        asatidzId: body.asatidzId,
        targetJuz: body.targetJuz,
        catatan: body.catatan,
      });
      return json({ data: updated });
    }

    return json({ error: 'Metode tidak didukung' }, { status: 405 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
