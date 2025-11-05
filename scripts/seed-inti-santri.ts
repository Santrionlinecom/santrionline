import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../app/db/schema';
import { randomUUID } from 'crypto';

const dbPath =
  process.env.LOCAL_D1_PATH ||
  process.env.D1_LOCAL_DATABASE ||
  './.wrangler/state/v3/d1/miniflare-D1Database/inti-santri.sqlite';

async function main() {
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  console.log('🌱 Seeding inti-santri dataset...');

  await db.delete(schema.notif_log);
  await db.delete(schema.absen_log);
  await db.delete(schema.absen_qr);
  await db.delete(schema.prestasi);
  await db.delete(schema.pelanggaran);
  await db.delete(schema.perizinan);
  await db.delete(schema.kesehatan);
  await db.delete(schema.ujian);
  await db.delete(schema.setoran);
  await db.delete(schema.halaqoh_santri);
  await db.delete(schema.halaqoh);
  await db.delete(schema.asatidz);
  await db.delete(schema.santri);

  const now = Math.floor(Date.now() / 1000);
  const asatidzUserId = randomUUID();
  const asatidzId = randomUUID();

  await db.insert(schema.users).values({
    id: asatidzUserId,
    email: 'ustadzah.maryam@santrionline.local',
    name: 'Ustadzah Maryam',
    role: 'asatidz',
  });

  await db.insert(schema.asatidz).values({
    id: asatidzId,
    userId: asatidzUserId,
    spesialisasi: "Tahfidz Al-Qur'an",
  });

  const halaqohIds = Array.from({ length: 3 }).map(() => randomUUID());
  const halaqohData = [
    { id: halaqohIds[0], nama: 'Halaqoh Al-Bayan', targetJuz: 10 },
    { id: halaqohIds[1], nama: 'Halaqoh An-Nur', targetJuz: 15 },
    { id: halaqohIds[2], nama: 'Halaqoh Ar-Rahmah', targetJuz: 20 },
  ];

  for (const halo of halaqohData) {
    await db.insert(schema.halaqoh).values({
      id: halo.id,
      nama: halo.nama,
      asatidzId,
      targetJuz: halo.targetJuz,
      catatan: 'Sesi sore hari',
    });
  }

  const santriRecords = [] as { santriId: string; userId: string }[];
  for (let i = 1; i <= 5; i++) {
    const userId = randomUUID();
    const santriId = randomUUID();
    await db.insert(schema.users).values({
      id: userId,
      email: `santri${i}@santrionline.local`,
      name: `Santri ${i}`,
      role: 'santri',
    });
    await db.insert(schema.santri).values({
      id: santriId,
      userId,
      nis: `NIS00${i}`,
      namaOrtu: `Orang Tua ${i}`,
      waliPhone: `6281230000${i}`,
      angkatan: '2024',
      kamar: `A-${i}`,
      status: 'aktif',
    });
    santriRecords.push({ santriId, userId });
  }

  // Assign santri to halaqoh
  santriRecords.forEach((record, index) => {
    const halo = halaqohIds[index % halaqohIds.length];
    db.insert(schema.halaqoh_santri)
      .values({ halaqohId: halo, santriId: record.santriId })
      .onConflictDoNothing()
      .run();
  });

  // Dummy setoran entries
  const suratList = ['Al-Fatihah', "An-Naba'", 'Yasin', 'Ar-Rahman'];
  const jenisList: Array<'ziyadah' | 'murajaah'> = ['ziyadah', 'murajaah'];
  for (let i = 0; i < 10; i++) {
    const santri = santriRecords[i % santriRecords.length];
    const halo = halaqohIds[i % halaqohIds.length];
    await db.insert(schema.setoran).values({
      id: randomUUID(),
      santriId: santri.santriId,
      halaqohId: halo,
      jenis: jenisList[i % jenisList.length],
      juz: (i % 30) + 1,
      surat: suratList[i % suratList.length],
      ayatFrom: 1,
      ayatTo: 10 + (i % 5),
      tanggal: new Date((now - i * 86400) * 1000),
      status: i % 3 === 0 ? 'pending' : 'validated',
      createdBy: asatidzUserId,
      validatorId: i % 3 === 0 ? null : asatidzId,
    });
  }

  // Dummy ujian entries
  for (let i = 0; i < 2; i++) {
    const santri = santriRecords[i];
    await db.insert(schema.ujian).values({
      id: randomUUID(),
      santriId: santri.santriId,
      jenis: i === 0 ? 'tahsin' : 'juz_amma',
      level: i === 0 ? 'Dasar' : 'Lanjut',
      nilai: 85 + i * 5,
      tanggal: new Date((now - i * 604800) * 1000),
      pengujiId: asatidzId,
      status: 'lulus',
      catatan: 'Pelaksanaan ujian berjalan lancar',
    });
  }

  console.log('✅ Seed inti-santri selesai.');
  sqlite.close();
}

main().catch((error) => {
  console.error('Gagal melakukan seed:', error);
  process.exit(1);
});
