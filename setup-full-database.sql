-- Full Database Setup for santri-db
-- Run this in Cloudflare D1 Console or via wrangler

-- 1. Create user table
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
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

-- 2. Create quran_surah table
CREATE TABLE IF NOT EXISTS quran_surah (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    total_ayah INTEGER NOT NULL
);

-- 3. Create user_hafalan_quran table
CREATE TABLE IF NOT EXISTS user_hafalan_quran (
    user_id TEXT NOT NULL,
    surah_id INTEGER NOT NULL,
    completed_ayah INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY(user_id, surah_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (surah_id) REFERENCES quran_surah(id)
);

-- 4. Create diniyah_kitab table
CREATE TABLE IF NOT EXISTS diniyah_kitab (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
);

-- 5. Create diniyah_pelajaran table
CREATE TABLE IF NOT EXISTS diniyah_pelajaran (
    id INTEGER PRIMARY KEY,
    kitab_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (kitab_id) REFERENCES diniyah_kitab(id)
);

-- 6. Create user_progres_diniyah table
CREATE TABLE IF NOT EXISTS user_progres_diniyah (
    user_id TEXT NOT NULL,
    pelajaran_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started',
    completed_at INTEGER,
    PRIMARY KEY(user_id, pelajaran_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (pelajaran_id) REFERENCES diniyah_pelajaran(id)
);

-- 7. Create biolink tables
CREATE TABLE IF NOT EXISTS user_social_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    is_visible INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS biolink_analytics (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    visitor_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 8. Create dompet and transaction tables
CREATE TABLE IF NOT EXISTS dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER NOT NULL DEFAULT 0,
    dircoin_balance INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS transaction (
    id TEXT PRIMARY KEY,
    dompet_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (dompet_id) REFERENCES dompet_santri(id)
);

-- 9. Create community tables
CREATE TABLE IF NOT EXISTS community_post (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS post_comment (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES community_post(id),
    FOREIGN KEY (author_id) REFERENCES user(id)
);

-- 10. Create karya and order tables
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

CREATE TABLE IF NOT EXISTS "order" (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    karya_id TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES user(id),
    FOREIGN KEY (karya_id) REFERENCES karya(id)
);

-- 11. Create ijazah table
CREATE TABLE IF NOT EXISTS ijazah (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    issued_at INTEGER NOT NULL,
    issued_by TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES user(id),
    FOREIGN KEY (issued_by) REFERENCES user(id)
);
