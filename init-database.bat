@echo off
echo ============================================
echo   SantriOnline Database Setup
echo ============================================
echo.

echo Step 1: Creating core tables...
echo.

echo Creating user table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE, bio TEXT, is_public INTEGER DEFAULT 1, theme TEXT DEFAULT 'light', custom_domain TEXT);"

if errorlevel 1 (
    echo ❌ Failed to create user table
    pause
    exit /b 1
)

echo ✅ User table created successfully

echo.
echo Creating wallet table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER DEFAULT 0, dircoin_balance INTEGER DEFAULT 0, FOREIGN KEY (user_id) REFERENCES user(id));"

if errorlevel 1 (
    echo ❌ Failed to create wallet table
    pause
    exit /b 1
)

echo ✅ Wallet table created successfully

echo.
echo Step 2: Creating test user...
node create-test-user.cjs

echo.
echo Step 3: Inserting test user...
wrangler d1 execute santri-db --local --file=test-user.sql

if errorlevel 1 (
    echo ❌ Failed to create test user
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed successfully!
echo.
echo Test user credentials:
echo Email: test@santrionline.com
echo Password: password123
echo.
pause
