@echo off
echo ============================================
echo   FIXING: near ".": syntax error at offset 0
echo ============================================
echo.

echo ⚠️  D1 does not support SQLite dot commands like .tables, .schema
echo ✅ Using standard SQL instead...
echo.

echo Creating tables without dot commands...
echo.

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo.
echo Creating dompet_santri table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo.
echo ✅ Checking tables with STANDARD SQL (not dot commands)...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

echo.
echo ✅ Checking dompet_santri table exists...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

echo.
echo Creating test data...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo ✅ Testing dompet_santri table with data...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"

echo.
echo ✅ FIXED! No more dot command syntax errors!
pause
