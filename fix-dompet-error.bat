@echo off
echo ============================================
echo   FIXING: no such table: dompet_santri
echo ============================================
echo.

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password_hash TEXT, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo.
echo Creating dompet_santri table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo.
echo Checking tables created...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

echo.
echo Creating test user...
node create-test-user.cjs

echo.
echo Inserting test user...
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo ✅ FIXED! dompet_santri table should now exist
pause
