import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { scanQr } from '~/services/absen.server';

type AbsenBody = {
  code?: string;
  device?: string | null;
};

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  const db = getDb(context);
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let code: string | null = null;
    let device: string | null = null;
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as AbsenBody;
      code = body?.code ?? null;
      device = body?.device ?? null;
    } else {
      const form = await request.formData();
      code = typeof form.get('code') === 'string' ? (form.get('code') as string) : null;
      device = typeof form.get('device') === 'string' ? (form.get('device') as string) : null;
    }
    if (!code) {
      return json({ error: 'Kode QR wajib diisi' }, { status: 400 });
    }
    const result = await scanQr(db, {
      code,
      userId: user.id,
      device,
    });
    if (result.status === 'invalid') {
      return json({ error: result.message, status: result.status }, { status: 400 });
    }
    return json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, { status: 500 });
  }
}

export const unstable_shouldReload = () => false;
