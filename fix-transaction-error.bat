@echo off
echo ============================================
echo   FIXING: near "transaction": syntax error
echo ============================================
echo.

echo ❌ PROBLEM: "transaction" is a reserved SQL keyword
echo ✅ SOLUTION: Using "transactions" (plural) instead
echo.

echo Creating essential tables with fixed names...
echo.

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo.
echo Creating dompet_santri table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo.
echo ✅ Creating transactions table (NOT transaction)...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, dompet_id TEXT NOT NULL, amount INTEGER NOT NULL, type TEXT NOT NULL, currency TEXT NOT NULL, description TEXT, created_at INTEGER NOT NULL);"

echo.
echo ✅ Verifying tables were created...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user', 'dompet_santri', 'transactions') ORDER BY name;"

echo.
echo ✅ Testing transactions table works...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as transactions_table_exists FROM sqlite_master WHERE type='table' AND name='transactions';"

echo.
echo Creating test user and wallet...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo ✅ FIXED! No more "transaction" keyword error!
echo ✅ Table renamed from "transaction" to "transactions"
echo.
pause
