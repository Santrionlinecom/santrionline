-- COMPREHENSIVE DATABASE FIX - ALL TABLES WITH CORRECT SCHEMA

-- Drop and recreate all tables to ensure clean state
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS user_progres_diniyah;
DROP TABLE IF EXISTS user_hafalan_quran;
DROP TABLE IF EXISTS diniyah_pelajaran;
DROP TABLE IF EXISTS diniyah_kitab;
DROP TABLE IF EXISTS quran_surah;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS dompet_santri;
DROP TABLE IF EXISTS biolink_analytics;
DROP TABLE IF EXISTS user_social_links;
DROP TABLE IF EXISTS ijazah;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS karya;
DROP TABLE IF EXISTS user;

-- Create tables in correct order (parent tables first)
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'santri',
    created_at INTEGER NOT NULL,
    username TEXT UNIQUE,
    bio TEXT,
    is_public INTEGER DEFAULT 1,
    theme TEXT DEFAULT 'light',
    custom_domain TEXT
);

CREATE TABLE dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER NOT NULL DEFAULT 0,
    dircoin_balance INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    dompet_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (dompet_id) REFERENCES dompet_santri(id)
);

CREATE TABLE quran_surah (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    total_ayah INTEGER NOT NULL
);

CREATE TABLE user_hafalan_quran (
    user_id TEXT NOT NULL,
    surah_id INTEGER NOT NULL,
    completed_ayah INTEGER DEFAULT 0,
    PRIMARY KEY(user_id, surah_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (surah_id) REFERENCES quran_surah(id)
);

CREATE TABLE diniyah_kitab (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
);

CREATE TABLE diniyah_pelajaran (
    id INTEGER PRIMARY KEY,
    kitab_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    FOREIGN KEY (kitab_id) REFERENCES diniyah_kitab(id)
);

CREATE TABLE user_progres_diniyah (
    user_id TEXT NOT NULL,
    pelajaran_id INTEGER NOT NULL,
    status TEXT DEFAULT 'not_started',
    completed_at INTEGER,
    PRIMARY KEY(user_id, pelajaran_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (pelajaran_id) REFERENCES diniyah_pelajaran(id)
);

CREATE TABLE user_social_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    is_visible INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE biolink_analytics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    visitor_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE karya (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    file_url TEXT,
    created_at INTEGER NOT NULL,
    content_type TEXT DEFAULT 'text',
    content TEXT,
    excerpt TEXT,
    status TEXT DEFAULT 'draft',
    slug TEXT,
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT,
    category TEXT,
    published_at INTEGER,
    updated_at INTEGER,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_free INTEGER DEFAULT 0,
    reading_time INTEGER,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    karya_id TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES user(id),
    FOREIGN KEY (karya_id) REFERENCES karya(id)
);

CREATE TABLE ijazah (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    issued_at INTEGER NOT NULL,
    issued_by TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES user(id),
    FOREIGN KEY (issued_by) REFERENCES user(id)
);

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

SELECT 'All tables created successfully with correct schema!' as message;
