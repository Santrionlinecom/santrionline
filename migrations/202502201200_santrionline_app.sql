CREATE TABLE IF NOT EXISTS so_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  google_id TEXT,
  role TEXT NOT NULL DEFAULT 'SANTRI',
  whatsapp_number TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS so_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT,
  status_aktif INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS so_payments (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  bulan TEXT NOT NULL,
  tahun INTEGER NOT NULL,
  tanggal_bayar TEXT,
  nominal INTEGER NOT NULL,
  metode TEXT NOT NULL DEFAULT 'cash',
  catatan TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY(member_id) REFERENCES so_members(id)
);

CREATE TABLE IF NOT EXISTS so_app_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul_aplikasi TEXT NOT NULL DEFAULT 'SantriOnline App',
  nominal_iuran_per_bulan INTEGER NOT NULL DEFAULT 150000,
  tanggal_jatuh_tempo INTEGER NOT NULL DEFAULT 10,
  masa_tenggang_hari INTEGER NOT NULL DEFAULT 5,
  moonwa_api_key TEXT
);

CREATE TABLE IF NOT EXISTS so_surahs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_surat TEXT NOT NULL,
  juz INTEGER NOT NULL,
  jumlah_ayat INTEGER NOT NULL,
  nomor_urut_global INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS so_hafalan_sessions (
  id TEXT PRIMARY KEY,
  santri_id TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  surah_id INTEGER NOT NULL,
  ayat_mulai INTEGER NOT NULL,
  ayat_selesai INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  ustadz_id TEXT,
  catatan TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  FOREIGN KEY(surah_id) REFERENCES so_surahs(id),
  FOREIGN KEY(santri_id) REFERENCES so_users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_so_surah_global ON so_surahs(nomor_urut_global);
CREATE INDEX IF NOT EXISTS idx_so_payments_member ON so_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_so_hafalan_status ON so_hafalan_sessions(status);
