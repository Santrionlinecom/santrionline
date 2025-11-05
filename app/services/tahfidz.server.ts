import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import type { Database } from '~/db/drizzle.server';
import {
  asatidz,
  halaqoh,
  halaqoh_santri,
  kesehatan,
  pelanggaran,
  perizinan,
  prestasi,
  santri,
  setoran,
  ujian,
  users,
  type AppRole,
} from '~/db/schema';
import { enqueueWhatsappNotification } from './notifications.server';
import type { WhatsappEventType } from './notifications.server';

type PerizinanStatus = (typeof perizinan.$inferSelect)['status'];

export type HalaqohInput = {
  nama: string;
  asatidzId: string;
  targetJuz?: number | null;
  catatan?: string | null;
};

export async function createHalaqoh(db: Database, input: HalaqohInput) {
  const id = crypto.randomUUID();
  await db.insert(halaqoh).values({
    id,
    nama: input.nama,
    asatidzId: input.asatidzId,
    targetJuz: input.targetJuz ?? 30,
    catatan: input.catatan ?? null,
  });
  return getHalaqohById(db, id);
}

export async function getAsatidzIdForUser(db: Database, userId: string) {
  const rows = await db
    .select({ id: asatidz.id })
    .from(asatidz)
    .where(eq(asatidz.userId, userId))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function notifyWali(
  db: Database,
  santriId: string,
  event: WhatsappEventType,
  payload: Record<string, unknown>,
) {
  const wali = await db
    .select({ phone: santri.waliPhone, waliName: santri.namaOrtu, santriName: users.name })
    .from(santri)
    .innerJoin(users, eq(users.id, santri.userId))
    .where(eq(santri.id, santriId))
    .limit(1);
  const waliRow = wali[0];
  if (!waliRow?.phone) return;
  await enqueueWhatsappNotification(db, {
    targetPhone: waliRow.phone,
    event,
    payload: {
      santriId,
      santriName: waliRow.santriName,
      waliName: waliRow.waliName,
      ...payload,
    },
  });
}

export async function updateHalaqoh(db: Database, id: string, payload: Partial<HalaqohInput>) {
  await db
    .update(halaqoh)
    .set({
      ...(payload.nama ? { nama: payload.nama } : {}),
      ...(payload.asatidzId ? { asatidzId: payload.asatidzId } : {}),
      ...(payload.targetJuz !== undefined ? { targetJuz: payload.targetJuz ?? null } : {}),
      ...(payload.catatan !== undefined ? { catatan: payload.catatan ?? null } : {}),
      updatedAt: new Date(),
    })
    .where(eq(halaqoh.id, id));
  return getHalaqohById(db, id);
}

export async function getHalaqohById(db: Database, id: string) {
  const rows = await db
    .select({
      id: halaqoh.id,
      nama: halaqoh.nama,
      asatidzId: halaqoh.asatidzId,
      targetJuz: halaqoh.targetJuz,
      catatan: halaqoh.catatan,
      createdAt: halaqoh.createdAt,
      updatedAt: halaqoh.updatedAt,
    })
    .from(halaqoh)
    .where(eq(halaqoh.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function listHalaqoh(
  db: Database,
  options: { asatidzId?: string; includeMembers?: boolean } = {},
) {
  const { asatidzId, includeMembers } = options;
  const base = db
    .select({
      id: halaqoh.id,
      nama: halaqoh.nama,
      asatidzId: halaqoh.asatidzId,
      targetJuz: halaqoh.targetJuz,
      catatan: halaqoh.catatan,
      createdAt: halaqoh.createdAt,
      updatedAt: halaqoh.updatedAt,
    })
    .from(halaqoh);
  if (asatidzId) {
    base.where(eq(halaqoh.asatidzId, asatidzId));
  }
  const halaqohList = await base.orderBy(desc(halaqoh.createdAt));
  if (!includeMembers || !halaqohList.length) {
    return halaqohList;
  }
  const ids = halaqohList.map((h) => h.id);
  const members = await db
    .select({
      halaqohId: halaqoh_santri.halaqohId,
      santriId: halaqoh_santri.santriId,
      santriName: santri.namaOrtu,
      nis: santri.nis,
    })
    .from(halaqoh_santri)
    .innerJoin(santri, eq(halaqoh_santri.santriId, santri.id))
    .where(inArray(halaqoh_santri.halaqohId, ids));
  return halaqohList.map((h) => ({
    ...h,
    members: members.filter((m) => m.halaqohId === h.id),
  }));
}

export async function assignSantriToHalaqoh(db: Database, haloId: string, santriId: string) {
  await db.insert(halaqoh_santri).values({ halaqohId: haloId, santriId }).onConflictDoNothing();
}

export async function removeSantriFromHalaqoh(db: Database, haloId: string, santriId: string) {
  await db
    .delete(halaqoh_santri)
    .where(and(eq(halaqoh_santri.halaqohId, haloId), eq(halaqoh_santri.santriId, santriId)));
}

export type SetoranInput = {
  santriId: string;
  halaqohId: string;
  jenis: 'ziyadah' | 'murajaah';
  juz?: number | null;
  surat?: string | null;
  ayatFrom?: number | null;
  ayatTo?: number | null;
  catatan?: string | null;
  createdBy?: string | null;
};

export async function createSetoranRecord(db: Database, payload: SetoranInput) {
  const id = crypto.randomUUID();
  await db.insert(setoran).values({
    id,
    santriId: payload.santriId,
    halaqohId: payload.halaqohId,
    jenis: payload.jenis,
    juz: payload.juz ?? null,
    surat: payload.surat ?? null,
    ayatFrom: payload.ayatFrom ?? null,
    ayatTo: payload.ayatTo ?? null,
    catatan: payload.catatan ?? null,
    createdBy: payload.createdBy ?? null,
  });
  return id;
}

export async function getSetoranById(db: Database, id: string) {
  const rows = await db
    .select({
      id: setoran.id,
      santriId: setoran.santriId,
      halaqohId: setoran.halaqohId,
      jenis: setoran.jenis,
      juz: setoran.juz,
      surat: setoran.surat,
      ayatFrom: setoran.ayatFrom,
      ayatTo: setoran.ayatTo,
      tanggal: setoran.tanggal,
      validatorId: setoran.validatorId,
      catatan: setoran.catatan,
      status: setoran.status,
      createdBy: setoran.createdBy,
      createdAt: setoran.createdAt,
    })
    .from(setoran)
    .where(eq(setoran.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function listSetoran(
  db: Database,
  filters: {
    santriId?: string;
    halaqohId?: string;
    status?: 'pending' | 'validated' | 'rejected';
    limit?: number;
  } = {},
) {
  const conditions = [] as Array<ReturnType<typeof eq>>;
  if (filters.santriId) conditions.push(eq(setoran.santriId, filters.santriId));
  if (filters.halaqohId) conditions.push(eq(setoran.halaqohId, filters.halaqohId));
  if (filters.status) conditions.push(eq(setoran.status, filters.status));
  const query = db
    .select({
      id: setoran.id,
      santriId: setoran.santriId,
      halaqohId: setoran.halaqohId,
      jenis: setoran.jenis,
      juz: setoran.juz,
      surat: setoran.surat,
      ayatFrom: setoran.ayatFrom,
      ayatTo: setoran.ayatTo,
      tanggal: setoran.tanggal,
      validatorId: setoran.validatorId,
      catatan: setoran.catatan,
      status: setoran.status,
      createdBy: setoran.createdBy,
      createdAt: setoran.createdAt,
    })
    .from(setoran)
    .orderBy(desc(setoran.tanggal));
  if (conditions.length) {
    query.where(and(...conditions));
  }
  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export type SetoranStatusUpdate = {
  status: 'validated' | 'rejected';
  validatorId: string;
  catatan?: string | null;
};

export async function updateSetoranStatus(db: Database, id: string, update: SetoranStatusUpdate) {
  await db
    .update(setoran)
    .set({
      status: update.status,
      validatorId: update.validatorId,
      catatan: update.catatan ?? null,
      updatedAt: new Date(),
    })
    .where(eq(setoran.id, id));

  const [record] = await db
    .select({
      id: setoran.id,
      santriId: setoran.santriId,
      halaqohId: setoran.halaqohId,
      status: setoran.status,
      validatorId: setoran.validatorId,
      catatan: setoran.catatan,
      tanggal: setoran.tanggal,
    })
    .from(setoran)
    .where(eq(setoran.id, id))
    .limit(1);

  if (record) {
    const event: WhatsappEventType =
      update.status === 'validated' ? 'setoran.validated' : 'setoran.rejected';
    await notifyWali(db, record.santriId, event, {
      status: update.status,
      catatan: update.catatan ?? null,
      tanggal: record.tanggal,
    });
  }
}

export async function getSantriWeeklyProgress(db: Database, santriId: string, weeks = 6) {
  const fromDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      week: sql<string>`strftime('%Y-%W', datetime(${setoran.tanggal}, 'unixepoch'))`,
      totalSetoran: sql<number>`count(*)`,
      totalAyat:
        sql<number>`sum(case when ${setoran.ayatFrom} is not null and ${setoran.ayatTo} is not null then (${setoran.ayatTo} - ${setoran.ayatFrom} + 1) else 0 end)`.mapWith(
          Number,
        ),
    })
    .from(setoran)
    .where(and(eq(setoran.santriId, santriId), gte(setoran.tanggal, fromDate)))
    .groupBy(sql`strftime('%Y-%W', datetime(${setoran.tanggal}, 'unixepoch'))`)
    .orderBy(sql`strftime('%Y-%W', datetime(${setoran.tanggal}, 'unixepoch'))`);
  return rows;
}

export type UjianInput = {
  santriId: string;
  jenis: 'pelancaran' | 'tasmi' | 'tahsin' | 'juz_amma';
  level?: string | null;
  nilai?: number | null;
  tanggal?: Date | null;
  pengujiId?: string | null;
  catatan?: string | null;
  status?: 'lulus' | 'remedial' | 'proses';
};

export async function createUjianRecord(db: Database, payload: UjianInput) {
  const id = crypto.randomUUID();
  await db.insert(ujian).values({
    id,
    santriId: payload.santriId,
    jenis: payload.jenis,
    level: payload.level ?? null,
    nilai: payload.nilai ?? null,
    tanggal: payload.tanggal ?? new Date(),
    pengujiId: payload.pengujiId ?? null,
    catatan: payload.catatan ?? null,
    status: payload.status ?? 'proses',
  });
  return id;
}

export async function finalizeUjian(
  db: Database,
  id: string,
  update: { status: 'lulus' | 'remedial'; nilai?: number | null; catatan?: string | null },
) {
  await db
    .update(ujian)
    .set({
      status: update.status,
      nilai: update.nilai ?? null,
      catatan: update.catatan ?? null,
      updatedAt: new Date(),
    })
    .where(eq(ujian.id, id));

  const [record] = await db
    .select({
      id: ujian.id,
      santriId: ujian.santriId,
      status: ujian.status,
      nilai: ujian.nilai,
      jenis: ujian.jenis,
      catatan: ujian.catatan,
      tanggal: ujian.tanggal,
    })
    .from(ujian)
    .where(eq(ujian.id, id))
    .limit(1);

  if (record) {
    await notifyWali(db, record.santriId, 'ujian.result', {
      status: record.status,
      nilai: record.nilai,
      jenis: record.jenis,
      catatan: record.catatan,
      tanggal: record.tanggal,
    });
  }
}

export async function listUjian(
  db: Database,
  filters: { santriId?: string; jenis?: UjianInput['jenis']; limit?: number } = {},
) {
  const conditions = [] as Array<ReturnType<typeof eq>>;
  if (filters.santriId) conditions.push(eq(ujian.santriId, filters.santriId));
  if (filters.jenis) conditions.push(eq(ujian.jenis, filters.jenis));
  const query = db
    .select({
      id: ujian.id,
      santriId: ujian.santriId,
      jenis: ujian.jenis,
      level: ujian.level,
      nilai: ujian.nilai,
      tanggal: ujian.tanggal,
      pengujiId: ujian.pengujiId,
      catatan: ujian.catatan,
      status: ujian.status,
      createdAt: ujian.createdAt,
    })
    .from(ujian)
    .orderBy(desc(ujian.tanggal));
  if (conditions.length) {
    query.where(and(...conditions));
  }
  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export async function recordKesehatan(
  db: Database,
  payload: {
    santriId: string;
    keluhan: string;
    tindakan?: string | null;
    biaya?: number | null;
    tanggal?: Date | null;
    petugasId?: string | null;
  },
) {
  await db.insert(kesehatan).values({
    id: crypto.randomUUID(),
    santriId: payload.santriId,
    keluhan: payload.keluhan,
    tindakan: payload.tindakan ?? null,
    biaya: payload.biaya ?? 0,
    tanggal: payload.tanggal ?? new Date(),
    petugasId: payload.petugasId ?? null,
  });
}

export async function recordPerizinan(
  db: Database,
  payload: {
    santriId: string;
    tipe: string;
    tanggalKeluar: Date;
    tanggalKembali?: Date | null;
    status?: 'pending' | 'disetujui' | 'ditolak' | 'kembali';
    keterangan?: string | null;
    petugasId?: string | null;
  },
) {
  await db.insert(perizinan).values({
    id: crypto.randomUUID(),
    santriId: payload.santriId,
    tipe: payload.tipe,
    tanggalKeluar: payload.tanggalKeluar ?? new Date(),
    tanggalKembali: payload.tanggalKembali ?? null,
    status: payload.status ?? 'pending',
    keterangan: payload.keterangan ?? null,
    petugasId: payload.petugasId ?? null,
  });
  if (payload.status && payload.status !== 'pending') {
    await notifyWali(db, payload.santriId, 'izin.status', {
      status: payload.status,
      tipe: payload.tipe,
      tanggalKeluar: payload.tanggalKeluar ?? new Date(),
      tanggalKembali: payload.tanggalKembali ?? null,
      keterangan: payload.keterangan ?? null,
    });
  }
}

export async function updatePerizinanStatus(
  db: Database,
  id: string,
  status: 'pending' | 'disetujui' | 'ditolak' | 'kembali',
  keterangan?: string | null,
) {
  await db
    .update(perizinan)
    .set({ status, keterangan: keterangan ?? null, updatedAt: new Date() })
    .where(eq(perizinan.id, id));
  const rows = await db
    .select({
      santriId: perizinan.santriId,
      tipe: perizinan.tipe,
      tanggalKeluar: perizinan.tanggalKeluar,
      tanggalKembali: perizinan.tanggalKembali,
    })
    .from(perizinan)
    .where(eq(perizinan.id, id))
    .limit(1);
  const row = rows[0];
  if (row) {
    await notifyWali(db, row.santriId, 'izin.status', {
      status,
      tipe: row.tipe,
      tanggalKeluar: row.tanggalKeluar,
      tanggalKembali: row.tanggalKembali,
      keterangan: keterangan ?? null,
    });
  }
}

export async function recordPelanggaran(
  db: Database,
  payload: {
    santriId: string;
    kategori: string;
    poin?: number | null;
    tindakan?: string | null;
    tanggal?: Date | null;
    petugasId?: string | null;
  },
) {
  await db.insert(pelanggaran).values({
    id: crypto.randomUUID(),
    santriId: payload.santriId,
    kategori: payload.kategori,
    poin: payload.poin ?? 0,
    tindakan: payload.tindakan ?? null,
    tanggal: payload.tanggal ?? new Date(),
    petugasId: payload.petugasId ?? null,
  });
  await notifyWali(db, payload.santriId, 'pelanggaran.diterbitkan', {
    kategori: payload.kategori,
    poin: payload.poin ?? 0,
    tindakan: payload.tindakan ?? null,
    tanggal: payload.tanggal ?? new Date(),
  });
}

export async function recordPrestasi(
  db: Database,
  payload: {
    santriId: string;
    jenis: string;
    deskripsi?: string | null;
    tanggal?: Date | null;
    penyelenggara?: string | null;
  },
) {
  await db.insert(prestasi).values({
    id: crypto.randomUUID(),
    santriId: payload.santriId,
    jenis: payload.jenis,
    deskripsi: payload.deskripsi ?? null,
    tanggal: payload.tanggal ?? new Date(),
    penyelenggara: payload.penyelenggara ?? null,
  });
  await notifyWali(db, payload.santriId, 'prestasi.diterbitkan', {
    jenis: payload.jenis,
    deskripsi: payload.deskripsi ?? null,
    tanggal: payload.tanggal ?? new Date(),
    penyelenggara: payload.penyelenggara ?? null,
  });
}

export async function listKesehatan(
  db: Database,
  filters: { santriId?: string; limit?: number } = {},
) {
  const query = db
    .select({
      id: kesehatan.id,
      santriId: kesehatan.santriId,
      keluhan: kesehatan.keluhan,
      tindakan: kesehatan.tindakan,
      biaya: kesehatan.biaya,
      tanggal: kesehatan.tanggal,
      petugasId: kesehatan.petugasId,
      createdAt: kesehatan.createdAt,
    })
    .from(kesehatan)
    .orderBy(desc(kesehatan.tanggal));
  if (filters.santriId) {
    query.where(eq(kesehatan.santriId, filters.santriId));
  }
  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export async function listPerizinan(
  db: Database,
  filters: { santriId?: string; status?: PerizinanStatus; limit?: number } = {},
) {
  const conditions: Array<ReturnType<typeof eq>> = [];
  if (filters.santriId) {
    conditions.push(eq(perizinan.santriId, filters.santriId));
  }
  if (filters.status) {
    conditions.push(eq(perizinan.status, filters.status));
  }

  const query = db
    .select({
      id: perizinan.id,
      santriId: perizinan.santriId,
      tipe: perizinan.tipe,
      tanggalKeluar: perizinan.tanggalKeluar,
      tanggalKembali: perizinan.tanggalKembali,
      status: perizinan.status,
      keterangan: perizinan.keterangan,
      createdAt: perizinan.createdAt,
      updatedAt: perizinan.updatedAt,
    })
    .from(perizinan)
    .orderBy(desc(perizinan.tanggalKeluar));

  if (conditions.length) {
    query.where(and(...conditions));
  }

  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export async function listPelanggaran(
  db: Database,
  filters: { santriId?: string; limit?: number } = {},
) {
  const query = db
    .select({
      id: pelanggaran.id,
      santriId: pelanggaran.santriId,
      kategori: pelanggaran.kategori,
      poin: pelanggaran.poin,
      tindakan: pelanggaran.tindakan,
      tanggal: pelanggaran.tanggal,
      petugasId: pelanggaran.petugasId,
      createdAt: pelanggaran.createdAt,
    })
    .from(pelanggaran)
    .orderBy(desc(pelanggaran.tanggal));
  if (filters.santriId) {
    query.where(eq(pelanggaran.santriId, filters.santriId));
  }
  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export async function listPrestasi(
  db: Database,
  filters: { santriId?: string; limit?: number } = {},
) {
  const query = db
    .select({
      id: prestasi.id,
      santriId: prestasi.santriId,
      jenis: prestasi.jenis,
      deskripsi: prestasi.deskripsi,
      tanggal: prestasi.tanggal,
      penyelenggara: prestasi.penyelenggara,
      createdAt: prestasi.createdAt,
    })
    .from(prestasi)
    .orderBy(desc(prestasi.tanggal));
  if (filters.santriId) {
    query.where(eq(prestasi.santriId, filters.santriId));
  }
  if (filters.limit) {
    query.limit(filters.limit);
  }
  return await query;
}

export function canRoleManageSetoran(role: AppRole) {
  return (
    role === 'asatidz' ||
    role === 'pengasuh' ||
    role === 'pengurus' ||
    role === 'admin_tech' ||
    role === 'admin'
  );
}

export function canRoleApprove(role: AppRole) {
  return (
    role === 'asatidz' ||
    role === 'pengasuh' ||
    role === 'pengurus' ||
    role === 'admin_tech' ||
    role === 'admin'
  );
}
