// app/lib/wallet.server.ts
import { dompet_santri } from '~/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { log } from '~/lib/logger';

export interface EnsureWalletResult {
  // Type hasil query tabel dompet_santri
  wallet: InferSelectModel<typeof dompet_santri>;
  created: boolean;
}

export async function ensureWallet(db: any, userId: string): Promise<EnsureWalletResult> {
  log.info('wallet.ensure.start', { userId });

  try {
    const existing = await db.query.dompet_santri.findFirst({
      where: eq(dompet_santri.userId, userId),
    });
    if (existing) {
      log.debug?.('wallet.ensure.exists', { userId });
      return { wallet: existing, created: false };
    }
  } catch (err) {
    log.error?.('wallet.ensure.query_error', { userId, error: String(err) });
  }

  // Buat wallet baru
  const walletId = 'wallet_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  try {
    await db.insert(dompet_santri).values({
      id: walletId,
      userId,
      dincoinBalance: 0,
      dircoinBalance: 0,
    });
    log.info('wallet.ensure.created', { userId, walletId });
  } catch (err) {
    log.error?.('wallet.ensure.insert_error', { userId, error: String(err) });
  }

  // Ambil kembali (tangani race condition)
  try {
    const wallet = await db.query.dompet_santri.findFirst({
      where: eq(dompet_santri.userId, userId),
    });
    if (wallet) return { wallet, created: true };
  } catch (err) {
    log.error?.('wallet.ensure.final_query_error', { userId, error: String(err) });
  }

  // Fallback jika query gagal
  log.warn?.('wallet.ensure.fallback', { userId, walletId });
  return {
    wallet: {
      id: walletId,
      userId,
      dincoinBalance: 0,
      dircoinBalance: 0,
    } as InferSelectModel<typeof dompet_santri>,
    created: true,
  };
}
