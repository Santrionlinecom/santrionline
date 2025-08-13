-- Fix for: no such table: dompet_santri
-- This will create the missing dompet_santri table

CREATE TABLE IF NOT EXISTS user (
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

CREATE TABLE IF NOT EXISTS dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER DEFAULT 0,
    dircoin_balance INTEGER DEFAULT 0
);
