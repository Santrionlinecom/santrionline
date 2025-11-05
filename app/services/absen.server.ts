import { eq } from 'drizzle-orm';
import type { Database } from '~/db/drizzle.server';
import { absen_log, absen_qr } from '~/db/schema';

export type AbsenScanResult = {
  status: 'hadir' | 'terlambat' | 'invalid';
  message: string;
  qrId?: string;
};

export async function createQrWindow(
  db: Database,
  payload: {
    lokasi: string;
    kode: string;
    aktifMulai: Date;
    aktifSelesai: Date;
    createdBy?: string | null;
  },
) {
  await db.insert(absen_qr).values({
    id: crypto.randomUUID(),
    lokasi: payload.lokasi,
    kode: payload.kode,
    aktifMulai: payload.aktifMulai,
    aktifSelesai: payload.aktifSelesai,
    createdBy: payload.createdBy ?? null,
  });
}

export async function scanQr(
  db: Database,
  payload: { code: string; userId: string; device?: string | null },
): Promise<AbsenScanResult> {
  const now = new Date();
  const qr = await db
    .select({
      id: absen_qr.id,
      aktifMulai: absen_qr.aktifMulai,
      aktifSelesai: absen_qr.aktifSelesai,
      lokasi: absen_qr.lokasi,
    })
    .from(absen_qr)
    .where(eq(absen_qr.kode, payload.code))
    .limit(1);
  const record = qr[0];
  if (!record) {
    return { status: 'invalid', message: 'QR absen tidak ditemukan' };
  }

  let status: AbsenScanResult['status'] = 'hadir';
  if (now < record.aktifMulai || now > record.aktifSelesai) {
    status = 'invalid';
  } else if (now.getTime() - record.aktifMulai.getTime() > 15 * 60 * 1000) {
    status = 'terlambat';
  }

  await db.insert(absen_log).values({
    id: crypto.randomUUID(),
    qrId: record.id,
    userId: payload.userId,
    waktu: now,
    status,
    device: payload.device ?? null,
  });

  if (status === 'invalid') {
    return { status, message: 'Waktu absen tidak aktif', qrId: record.id };
  }
  const message = status === 'terlambat' ? 'Absen tercatat (terlambat)' : 'Absen berhasil dicatat';
  return { status, message, qrId: record.id };
}
