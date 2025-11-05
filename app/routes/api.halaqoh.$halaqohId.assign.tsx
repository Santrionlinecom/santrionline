import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canManageHalaqoh } from '~/lib/rbac';
import { assignSantriToHalaqoh, removeSantriFromHalaqoh } from '~/services/tahfidz.server';

type AssignPayload = {
  santriId?: string;
  intent?: 'add' | 'remove';
};

export async function action({ request, context, params }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canManageHalaqoh(user.role)) {
    return json({ error: 'Tidak memiliki izin' }, { status: 403 });
  }
  const db = getDb(context);
  const { halaqohId } = params;
  if (!halaqohId) {
    return json({ error: 'Parameter halaqohId tidak ditemukan' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as AssignPayload;
    const santriId = body?.santriId;
    if (!santriId) {
      return json({ error: 'santriId wajib diisi' }, { status: 400 });
    }
    const intent = body?.intent ?? 'add';
    if (intent === 'remove') {
      await removeSantriFromHalaqoh(db, halaqohId, santriId);
      return json({ ok: true, action: 'removed' });
    }
    await assignSantriToHalaqoh(db, halaqohId, santriId);
    return json({ ok: true, action: 'added' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
