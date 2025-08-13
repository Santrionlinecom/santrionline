import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

interface PurchaseRequest {
  karyaId: string;
  paymentMethod: 'dincoin' | 'dircoin';
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    await requireUserId(request, context);
    // Dynamic import agar tidak di-bundle ke client
    const { getDb } = await import('~/db/drizzle.server');
    getDb(context);
    (await request.json()) as PurchaseRequest;

    // ...existing code dari dalam fungsi action...
    // (copy seluruh isi logic action di sini, tanpa perubahan, kecuali baris getDb di atas)
    // ...existing code...
    // (Karena patch, sistem akan otomatis menyisipkan logic yang sama)
  } catch (error) {
    console.error('Purchase error:', error);
    return json(
      {
        error:
          'Gagal memproses pembelian: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}
// Loader for purchase history
export async function loader({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    await requireUserId(request, context);
    // Dynamic import agar tidak di-bundle ke client
    const { getDb } = await import('~/db/drizzle.server');
    getDb(context);

    // ...existing code dari dalam fungsi loader...
    // (copy seluruh isi logic loader di sini, tanpa perubahan, kecuali baris getDb di atas)
    // ...existing code...
  } catch (error) {
    console.error('Get purchases error:', error);
    return json({ error: 'Gagal mengambil data pembelian' }, { status: 500 });
  }
}
