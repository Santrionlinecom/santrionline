import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const roleValues = ['SANTRI', 'USTADZ', 'ADMIN'] as const;
export type Role = (typeof roleValues)[number];

export const soUsers = sqliteTable('so_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  googleId: text('google_id'),
  role: text('role', { enum: roleValues }).notNull().default('SANTRI'),
  whatsappNumber: text('whatsapp_number'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
});

export const members = sqliteTable('so_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number'),
  statusAktif: integer('status_aktif', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
});

export const payments = sqliteTable('so_payments', {
  id: text('id').primaryKey(),
  memberId: text('member_id').notNull(),
  bulan: text('bulan').notNull(),
  tahun: integer('tahun').notNull(),
  tanggalBayar: text('tanggal_bayar'),
  nominal: integer('nominal').notNull(),
  metode: text('metode', { enum: ['cash', 'transfer'] }).notNull().default('cash'),
  catatan: text('catatan'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
});

export const appSettings = sqliteTable('so_app_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  judulAplikasi: text('judul_aplikasi').notNull().default('SantriOnline App'),
  nominalIuranPerBulan: integer('nominal_iuran_per_bulan').notNull().default(150000),
  tanggalJatuhTempo: integer('tanggal_jatuh_tempo').notNull().default(10),
  masaTenggangHari: integer('masa_tenggang_hari').notNull().default(5),
  moonwaApiKey: text('moonwa_api_key'),
});

export const surahs = sqliteTable('so_surahs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  namaSurat: text('nama_surat').notNull(),
  juz: integer('juz').notNull(),
  jumlahAyat: integer('jumlah_ayat').notNull(),
  nomorUrutGlobal: integer('nomor_urut_global').notNull(),
});

export const hafalanSessions = sqliteTable('so_hafalan_sessions', {
  id: text('id').primaryKey(),
  santriId: text('santri_id').notNull(),
  tanggal: text('tanggal').notNull(),
  surahId: integer('surah_id').notNull(),
  ayatMulai: integer('ayat_mulai').notNull(),
  ayatSelesai: integer('ayat_selesai').notNull(),
  status: text('status', { enum: ['PENDING', 'APPROVED', 'REJECTED'] })
    .notNull()
    .default('PENDING'),
  ustadzId: text('ustadz_id'),
  catatan: text('catatan'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s','now'))`),
});
