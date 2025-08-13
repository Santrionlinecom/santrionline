@echo off
echo ============================================
echo   FINAL FIX: dompet_santri table error
echo ============================================
echo.

echo Step 1: Creating all essential tables...
echo.

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

echo.
echo Creating dompet_santri table (THE MISSING ONE)...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0);"

echo.
echo Creating quran_surah table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS quran_surah (id INTEGER PRIMARY KEY, name TEXT NOT NULL, total_ayah INTEGER NOT NULL);"

echo.
echo Creating biolink tables...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user_social_links (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, platform TEXT NOT NULL, url TEXT NOT NULL, is_visible INTEGER DEFAULT 1, display_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL);"

echo.
echo Creating biolink analytics...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS biolink_analytics (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, visitor_count INTEGER DEFAULT 0, click_count INTEGER DEFAULT 0, date TEXT NOT NULL, created_at INTEGER NOT NULL);"

echo.
echo Step 2: Verifying dompet_santri table exists...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as dompet_table_exists FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

echo.
echo Step 3: Creating test user with wallet...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo Step 4: Testing dompet_santri table works...
wrangler d1 execute santri-db --local --command="SELECT * FROM dompet_santri LIMIT 1;"

echo.
echo ✅ SOLUTION COMPLETE!
echo The dompet_santri table should now exist and work properly.
echo.
pause
