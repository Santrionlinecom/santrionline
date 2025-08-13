@echo off
echo Creating database tables...

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, password_hash TEXT, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo Creating dompet table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo Creating test user...
wrangler d1 execute santri-db --local --command="INSERT OR REPLACE INTO user (id, name, email, password_hash, role, created_at, username) VALUES ('test123', 'Santri Test', 'test@santrionline.com', 'password123hash', 'santri', 1754301501, 'santritest');"

echo Creating test wallet...
wrangler d1 execute santri-db --local --command="INSERT OR REPLACE INTO dompet_santri (id, user_id, dincoin_balance, dircoin_balance) VALUES ('wallet123', 'test123', 150, 75);"

echo Done! Test user created:
echo Email: test@santrionline.com
echo Password: password123
pause
