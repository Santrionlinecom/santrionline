import { eq } from 'drizzle-orm';
import { notif_log } from '~/db/schema';
import type { Database } from '~/db/drizzle.server';

export type WhatsappEventType =
  | 'setoran.validated'
  | 'setoran.rejected'
  | 'setoran.submitted'
  | 'progress.weekly'
  | 'ujian.result'
  | 'izin.status'
  | 'pelanggaran.diterbitkan'
  | 'prestasi.diterbitkan';

export type WhatsappNotificationPayload = {
  targetPhone: string;
  event: WhatsappEventType;
  payload: Record<string, unknown>;
};

const THROTTLE_MS = 5000;
const MAX_RETRY = 3;

declare global {
  // eslint-disable-next-line no-var
  var __WA_LAST_SEND__: Map<string, number> | undefined;
}

function getLastSendMap() {
  if (!globalThis.__WA_LAST_SEND__) {
    globalThis.__WA_LAST_SEND__ = new Map();
  }
  return globalThis.__WA_LAST_SEND__;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function deliverNotification(event: WhatsappNotificationPayload): Promise<void> {
  // Placeholder provider integration. In production this should call actual WhatsApp API.
  // We keep it async to simulate network latency.
  await delay(150);
  if (!event.targetPhone) {
    throw new Error('Nomor tujuan kosong');
  }
}

export async function enqueueWhatsappNotification(
  db: Database,
  event: WhatsappNotificationPayload,
) {
  const now = new Date();
  const lastSendMap = getLastSendMap();
  const [log] = await db
    .insert(notif_log)
    .values({
      id: crypto.randomUUID(),
      targetPhone: event.targetPhone,
      event: event.event,
      payloadJson: JSON.stringify(event.payload),
      status: 'queued',
      createdAt: now,
    })
    .returning({ id: notif_log.id });

  const jobId = log?.id ?? crypto.randomUUID();

  let attempt = 0;
  while (attempt < MAX_RETRY) {
    attempt++;
    const last = lastSendMap.get(event.targetPhone) ?? 0;
    const diff = Date.now() - last;
    if (diff < THROTTLE_MS) {
      await delay(THROTTLE_MS - diff);
    }

    try {
      await deliverNotification(event);
      lastSendMap.set(event.targetPhone, Date.now());
      await db
        .update(notif_log)
        .set({ status: 'sent', sentAt: new Date(), retryCount: attempt - 1 })
        .where(eq(notif_log.id, jobId));
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await db
        .update(notif_log)
        .set({ status: 'failed', error: message, retryCount: attempt })
        .where(eq(notif_log.id, jobId));
      if (attempt >= MAX_RETRY) {
        throw error;
      }
      await delay(THROTTLE_MS);
    }
  }
}

export async function logWhatsappNotification(db: Database, event: WhatsappNotificationPayload) {
  await db.insert(notif_log).values({
    id: crypto.randomUUID(),
    targetPhone: event.targetPhone,
    event: event.event,
    payloadJson: JSON.stringify(event.payload),
    status: 'queued',
    createdAt: new Date(),
  });
}
