import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { isAdminRole } from '~/lib/rbac';
import {
  enqueueWhatsappNotification,
  type WhatsappEventType,
} from '~/services/notifications.server';

type NotifPayload = {
  targetPhone?: string;
  event?: WhatsappEventType;
  payload?: Record<string, unknown>;
};

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  if (!isAdminRole(user.role)) {
    return json({ error: 'Hanya admin yang dapat menerbitkan notifikasi manual' }, { status: 403 });
  }
  const db = getDb(context);
  try {
    const body = (await request.json()) as NotifPayload;
    if (!body?.targetPhone || !body?.event) {
      return json({ error: 'targetPhone dan event wajib diisi' }, { status: 400 });
    }
    await enqueueWhatsappNotification(db, {
      targetPhone: body.targetPhone,
      event: body.event as WhatsappEventType,
      payload: body.payload ?? {},
    });
    return json({ ok: true }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
