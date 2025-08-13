-- D1 Compatible SQL - No dot commands, no complex syntax
-- This fixes: near ".": syntax error at offset 0

-- Create essential tables
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'santri',
    created_at INTEGER,
    username TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER DEFAULT 0,
    dircoin_balance INTEGER DEFAULT 0
);

-- Verify tables (using standard SQL, not dot commands)
SELECT 'Tables created successfully' as status;
