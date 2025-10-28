-- Complete schema update for all missing tables required by dashboard
-- This includes all tables needed for hafalan dashboard functionality

-- Diniyah curriculum tables
CREATE TABLE IF NOT EXISTS diniyah_kitab (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS diniyah_pelajaran (
  id INTEGER PRIMARY KEY,
  kitab_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  FOREIGN KEY(kitab_id) REFERENCES diniyah_kitab(id)
);

CREATE TABLE IF NOT EXISTS user_progres_diniyah (
  user_id TEXT NOT NULL,
  pelajaran_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started',
  completed_at INTEGER,
  PRIMARY KEY(user_id, pelajaran_id),
  FOREIGN KEY(user_id) REFERENCES pengguna(id),
  FOREIGN KEY(pelajaran_id) REFERENCES diniyah_pelajaran(id)
);

-- Other missing tables for complete functionality
CREATE TABLE IF NOT EXISTS biolink_analytics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  visitor_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES pengguna(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  dompet_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  currency TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(dompet_id) REFERENCES dompet_santri(id)
);

CREATE TABLE IF NOT EXISTS karya (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  file_url TEXT,
  created_at INTEGER NOT NULL,
  content_type TEXT DEFAULT 'text',
  content TEXT,
  status TEXT DEFAULT 'draft',
  slug TEXT,
  featured_image TEXT,
  tags TEXT,
  category TEXT,
  published_at INTEGER,
  updated_at INTEGER,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_free INTEGER DEFAULT 0,
  FOREIGN KEY(author_id) REFERENCES pengguna(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diniyah_pelajaran_kitab ON diniyah_pelajaran(kitab_id);
CREATE INDEX IF NOT EXISTS idx_user_progres_diniyah_user ON user_progres_diniyah(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progres_diniyah_pelajaran ON user_progres_diniyah(pelajaran_id);
CREATE INDEX IF NOT EXISTS idx_karya_author ON karya(author_id);

SELECT 'All missing tables created successfully' as result;
