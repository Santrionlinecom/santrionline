@echo off
echo BACKUP SOLUTION - Using npx wrangler
echo.

echo Creating dompet_santri table using npx...
npx wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo.
echo Creating user table using npx...
npx wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo.
echo Testing tables...
npx wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

pause
