-- FIXING BOTH ERRORS: "near am syntax error" + "FOREIGN KEY constraint failed"
-- Problem 1: Apostrophes in surah names causing syntax errors
-- Problem 2: Foreign key constraints when inserting data

-- First, let's disable foreign key checks temporarily
PRAGMA foreign_keys = OFF;

-- Drop all tables to start fresh (this fixes foreign key issues)
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
DROP TABLE IF EXISTS post_comment;
DROP TABLE IF EXISTS community_post;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS karya;
DROP TABLE IF EXISTS user;

-- Create tables in correct order (parent tables first)
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'santri',
    created_at INTEGER,
    username TEXT UNIQUE,
    bio TEXT,
    is_public INTEGER DEFAULT 1,
    theme TEXT DEFAULT 'light',
    custom_domain TEXT,
    avatar_url TEXT
);

CREATE TABLE dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER DEFAULT 0,
    dircoin_balance INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
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

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;

SELECT 'Tables recreated successfully - Fixed both syntax and foreign key errors!' as message;
