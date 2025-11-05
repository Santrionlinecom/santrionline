-- Rebuild users table with extended role enum
PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "__users_new" (
"id" text PRIMARY KEY NOT NULL,
"email" text NOT NULL,
"name" text,
"avatar_url" text,
"role" text DEFAULT 'santri' NOT NULL CHECK("role" in ('pengasuh','pengurus','asatidz','wali_kelas','wali_santri','santri','calon_santri','admin_tech','admin')),
"created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL
);

INSERT INTO "__users_new" (id,email,name,avatar_url,role,created_at)
SELECT id,email,name,avatar_url,
CASE WHEN role IN ('pengasuh','pengurus','asatidz','wali_kelas','wali_santri','santri','calon_santri','admin_tech','admin') THEN role
     WHEN role = 'admin' THEN 'admin'
     ELSE 'santri' END,
created_at
FROM "users";

DROP TABLE "users";
ALTER TABLE "__users_new" RENAME TO "users";
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

-- Rebuild legacy pengguna table with extended role enum
CREATE TABLE IF NOT EXISTS "__pengguna_new" (
"id" text PRIMARY KEY NOT NULL,
"name" text NOT NULL,
"email" text NOT NULL,
"password_hash" text NOT NULL,
"google_id" text,
"avatar_url" text,
"role" text DEFAULT 'santri' NOT NULL CHECK("role" in ('pengasuh','pengurus','asatidz','wali_kelas','wali_santri','santri','calon_santri','admin_tech','admin')),
"created_at" integer NOT NULL,
"updated_at" integer,
"phone" text,
"address" text,
"date_of_birth" text,
"education" text,
"institution" text,
"username" text,
"bio" text,
"is_public" integer DEFAULT 1,
"theme" text DEFAULT 'light',
"custom_domain" text
);

INSERT INTO "__pengguna_new" (
id,name,email,password_hash,google_id,avatar_url,role,created_at,updated_at,phone,address,date_of_birth,education,institution,username,bio,is_public,theme,custom_domain
)
SELECT
id,
name,
email,
password_hash,
google_id,
avatar_url,
CASE WHEN role IN ('pengasuh','pengurus','asatidz','wali_kelas','wali_santri','santri','calon_santri','admin_tech','admin') THEN role ELSE 'santri' END,
created_at,
updated_at,
phone,
address,
date_of_birth,
education,
institution,
username,
bio,
is_public,
theme,
custom_domain
FROM "pengguna";

DROP TABLE "pengguna";
ALTER TABLE "__pengguna_new" RENAME TO "pengguna";
CREATE UNIQUE INDEX IF NOT EXISTS "pengguna_email_unique" ON "pengguna" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "pengguna_google_id_unique" ON "pengguna" ("google_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pengguna_username_unique" ON "pengguna" ("username");

PRAGMA foreign_keys=ON;

-- Create tahfidz & operasional tables
CREATE TABLE IF NOT EXISTS "santri" (
"id" text PRIMARY KEY NOT NULL,
"user_id" text NOT NULL,
"nis" text NOT NULL,
"nama_ortu" text,
"wali_phone" text,
"angkatan" text,
"kamar" text,
"status" text DEFAULT 'aktif' NOT NULL CHECK("status" in ('aktif','cuti','lulus','keluar')),
"created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
"updated_at" integer,
CONSTRAINT "santri_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "santri_nis_unique" ON "santri" ("nis");
CREATE INDEX IF NOT EXISTS "idx_santri_angkatan" ON "santri" ("angkatan");
CREATE INDEX IF NOT EXISTS "idx_santri_wali" ON "santri" ("wali_phone");

CREATE TABLE IF NOT EXISTS "asatidz" (
"id" text PRIMARY KEY NOT NULL,
"user_id" text NOT NULL,
"spesialisasi" text,
"created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
CONSTRAINT "asatidz_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_asatidz_user" ON "asatidz" ("user_id");

CREATE TABLE IF NOT EXISTS "halaqoh" (
"id" text PRIMARY KEY NOT NULL,
"nama" text NOT NULL,
"asatidz_id" text NOT NULL,
"target_juz" integer DEFAULT 30,
"catatan" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
"updated_at" integer,
CONSTRAINT "halaqoh_asatidz_id_asatidz_id_fk" FOREIGN KEY ("asatidz_id") REFERENCES "asatidz"("id") ON DELETE cascade ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_halaqoh_asatidz" ON "halaqoh" ("asatidz_id");

CREATE TABLE IF NOT EXISTS "halaqoh_santri" (
"halaqoh_id" text NOT NULL,
"santri_id" text NOT NULL,
"assigned_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
PRIMARY KEY ("halaqoh_id","santri_id"),
CONSTRAINT "halaqoh_santri_halaqoh_id_halaqoh_id_fk" FOREIGN KEY ("halaqoh_id") REFERENCES "halaqoh"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "halaqoh_santri_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade
);

CREATE TABLE IF NOT EXISTS "setoran" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"halaqoh_id" text NOT NULL,
"jenis" text NOT NULL CHECK("jenis" in ('ziyadah','murajaah')),
"juz" integer,
"surat" text,
"ayat_from" integer,
"ayat_to" integer,
"tanggal" integer DEFAULT (strftime('%s','now')) NOT NULL,
"validator_id" text,
"catatan" text,
"status" text DEFAULT 'pending' NOT NULL CHECK("status" in ('pending','validated','rejected')),
"created_by" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
"updated_at" integer,
CONSTRAINT "setoran_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "setoran_halaqoh_id_halaqoh_id_fk" FOREIGN KEY ("halaqoh_id") REFERENCES "halaqoh"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "setoran_validator_id_asatidz_id_fk" FOREIGN KEY ("validator_id") REFERENCES "asatidz"("id") ON DELETE set null ON UPDATE cascade,
CONSTRAINT "setoran_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_setoran_santri" ON "setoran" ("santri_id");
CREATE INDEX IF NOT EXISTS "idx_setoran_halaqoh" ON "setoran" ("halaqoh_id");
CREATE INDEX IF NOT EXISTS "idx_setoran_status" ON "setoran" ("status");

CREATE TABLE IF NOT EXISTS "ujian" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"jenis" text NOT NULL CHECK("jenis" in ('pelancaran','tasmi','tahsin','juz_amma')),
"level" text,
"nilai" integer,
"tanggal" integer DEFAULT (strftime('%s','now')) NOT NULL,
"penguji_id" text,
"catatan" text,
"status" text DEFAULT 'proses' NOT NULL CHECK("status" in ('lulus','remedial','proses')),
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
"updated_at" integer,
CONSTRAINT "ujian_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "ujian_penguji_id_asatidz_id_fk" FOREIGN KEY ("penguji_id") REFERENCES "asatidz"("id") ON DELETE set null ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_ujian_santri" ON "ujian" ("santri_id");
CREATE INDEX IF NOT EXISTS "idx_ujian_jenis" ON "ujian" ("jenis");

CREATE TABLE IF NOT EXISTS "kesehatan" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"keluhan" text NOT NULL,
"tindakan" text,
"biaya" integer DEFAULT 0,
"tanggal" integer DEFAULT (strftime('%s','now')) NOT NULL,
"petugas_id" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
CONSTRAINT "kesehatan_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "kesehatan_petugas_id_users_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_kesehatan_santri" ON "kesehatan" ("santri_id");

CREATE TABLE IF NOT EXISTS "perizinan" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"tipe" text NOT NULL,
"tanggal_keluar" integer NOT NULL,
"tanggal_kembali" integer,
"status" text DEFAULT 'pending' NOT NULL CHECK("status" in ('pending','disetujui','ditolak','kembali')),
"keterangan" text,
"petugas_id" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
"updated_at" integer,
CONSTRAINT "perizinan_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "perizinan_petugas_id_users_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_perizinan_santri" ON "perizinan" ("santri_id");
CREATE INDEX IF NOT EXISTS "idx_perizinan_status" ON "perizinan" ("status");

CREATE TABLE IF NOT EXISTS "pelanggaran" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"kategori" text NOT NULL,
"poin" integer DEFAULT 0,
"tindakan" text,
"tanggal" integer DEFAULT (strftime('%s','now')) NOT NULL,
"petugas_id" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
CONSTRAINT "pelanggaran_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "pelanggaran_petugas_id_users_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_pelanggaran_santri" ON "pelanggaran" ("santri_id");

CREATE TABLE IF NOT EXISTS "prestasi" (
"id" text PRIMARY KEY NOT NULL,
"santri_id" text NOT NULL,
"jenis" text NOT NULL,
"deskripsi" text,
"tanggal" integer DEFAULT (strftime('%s','now')) NOT NULL,
"penyelenggara" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
CONSTRAINT "prestasi_santri_id_santri_id_fk" FOREIGN KEY ("santri_id") REFERENCES "santri"("id") ON DELETE cascade ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_prestasi_santri" ON "prestasi" ("santri_id");

CREATE TABLE IF NOT EXISTS "absen_qr" (
"id" text PRIMARY KEY NOT NULL,
"lokasi" text NOT NULL,
"kode" text NOT NULL,
"aktif_mulai" integer NOT NULL,
"aktif_selesai" integer NOT NULL,
"created_by" text,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL,
CONSTRAINT "absen_qr_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE set null ON UPDATE cascade
);
CREATE UNIQUE INDEX IF NOT EXISTS "absen_qr_kode_unique" ON "absen_qr" ("kode");
CREATE INDEX IF NOT EXISTS "idx_absen_lokasi" ON "absen_qr" ("lokasi");
CREATE INDEX IF NOT EXISTS "idx_absen_aktif" ON "absen_qr" ("aktif_mulai","aktif_selesai");

CREATE TABLE IF NOT EXISTS "absen_log" (
"id" text PRIMARY KEY NOT NULL,
"qr_id" text NOT NULL,
"user_id" text NOT NULL,
"waktu" integer DEFAULT (strftime('%s','now')) NOT NULL,
"status" text DEFAULT 'hadir' NOT NULL CHECK("status" in ('hadir','terlambat','invalid')),
"device" text,
CONSTRAINT "absen_log_qr_id_absen_qr_id_fk" FOREIGN KEY ("qr_id") REFERENCES "absen_qr"("id") ON DELETE cascade ON UPDATE cascade,
CONSTRAINT "absen_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade
);
CREATE INDEX IF NOT EXISTS "idx_absen_log_qr" ON "absen_log" ("qr_id");
CREATE INDEX IF NOT EXISTS "idx_absen_log_user" ON "absen_log" ("user_id");

CREATE TABLE IF NOT EXISTS "notif_log" (
"id" text PRIMARY KEY NOT NULL,
"target_phone" text NOT NULL,
"event" text NOT NULL,
"payload_json" text NOT NULL,
"status" text DEFAULT 'queued' NOT NULL CHECK("status" in ('queued','sent','failed')),
"sent_at" integer,
"error" text,
"retry_count" integer DEFAULT 0 NOT NULL,
"created_at" integer DEFAULT (strftime('%s','now')) NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_notif_phone" ON "notif_log" ("target_phone");
CREATE INDEX IF NOT EXISTS "idx_notif_event" ON "notif_log" ("event");
