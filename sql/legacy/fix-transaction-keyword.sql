-- Fix for: near "transaction": syntax error at offset 27
-- PROBLEM: "transaction" is a reserved keyword in SQL
-- SOLUTION: Rename table to "transactions" (plural)

-- Create user table first
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'santri',
    created_at INTEGER,
    username TEXT UNIQUE
);

-- Create dompet_santri table
CREATE TABLE IF NOT EXISTS dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER DEFAULT 0,
    dircoin_balance INTEGER DEFAULT 0
);

-- ✅ FIXED: Use "transactions" instead of "transaction"
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    dompet_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL
);

-- Test that everything works
SELECT 'All tables created successfully - transaction keyword fixed!' as status;
