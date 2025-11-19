import type { AppLoadContext } from '@remix-run/cloudflare';

export type WhatsAppMessage = {
  to: string;
  message: string;
};

export async function sendWhatsappBatch(
  context: AppLoadContext,
  messages: WhatsAppMessage[],
): Promise<{ success: number; failed: number }> {
  const apiKey = (context.cloudflare?.env as { MOONWA_API_KEY?: string } | undefined)?.MOONWA_API_KEY;
  if (!apiKey) {
    throw new Error('MOONWA_API_KEY belum dikonfigurasi');
  }

  let success = 0;
  let failed = 0;

  for (const payload of messages) {
    try {
      const res = await fetch('https://api.moonwa.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ to: payload.to, message: payload.message }),
      });
      if (!res.ok) throw new Error(`Gagal ${res.status}`);
      success += 1;
    } catch (error) {
      console.error('moonwa-send-error', error);
      failed += 1;
    }
  }

  return { success, failed };
}
