CREATE TABLE IF NOT EXISTS dompet_santri (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    dincoin_balance INTEGER DEFAULT 0,
    dircoin_balance INTEGER DEFAULT 0
);
