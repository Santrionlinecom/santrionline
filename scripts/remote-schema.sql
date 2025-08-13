-- Complete schema for remote D1 database
CREATE TABLE IF NOT EXISTS pengguna (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'santri',
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  phone TEXT,
  address TEXT,
  date_of_birth TEXT,
  education TEXT,
  institution TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  is_public INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'light',
  custom_domain TEXT
);

CREATE TABLE IF NOT EXISTS user_social_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_visible INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES pengguna(id)
);

CREATE TABLE IF NOT EXISTS dompet_santri (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  dincoin_balance INTEGER DEFAULT 0,
  dircoin_balance INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES pengguna(id)
);

CREATE TABLE IF NOT EXISTS quran_surah (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  total_ayah INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_hafalan_quran (
  user_id TEXT NOT NULL,
  surah_id INTEGER NOT NULL,
  completed_ayah INTEGER DEFAULT 0,
  PRIMARY KEY(user_id, surah_id),
  FOREIGN KEY(user_id) REFERENCES pengguna(id),
  FOREIGN KEY(surah_id) REFERENCES quran_surah(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pengguna_email ON pengguna(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_username ON pengguna(username);
CREATE INDEX IF NOT EXISTS idx_social_links_user ON user_social_links(user_id);

-- Insert sample surah data
INSERT OR IGNORE INTO quran_surah (id, name, total_ayah) VALUES
(1, 'Al-Fatihah', 7),
(2, 'Al-Baqarah', 286),
(3, 'Ali Imran', 200),
(4, 'An-Nisa', 176),
(5, 'Al-Ma''idah', 120);

SELECT 'Schema created successfully' as result;
