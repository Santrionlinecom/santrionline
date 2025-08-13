@echo off
echo ============================================
echo   VERIFY: All Reserved Keywords Fixed
echo ============================================
echo.

echo ✅ Checking if all problematic tables are created with correct names...
echo.

echo Test 1: Check user table exists...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'user table ✅ EXISTS' ELSE 'user table ❌ MISSING' END as result FROM sqlite_master WHERE type='table' AND name='user';"

echo.
echo Test 2: Check dompet_santri table exists...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'dompet_santri table ✅ EXISTS' ELSE 'dompet_santri table ❌ MISSING' END as result FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

echo.
echo Test 3: Check transactions table exists (NOT transaction)...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'transactions table ✅ EXISTS' ELSE 'transactions table ❌ MISSING' END as result FROM sqlite_master WHERE type='table' AND name='transactions';"

echo.
echo Test 4: Check orders table exists (NOT order)...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'orders table ✅ EXISTS' ELSE 'orders table ❌ MISSING' END as result FROM sqlite_master WHERE type='table' AND name='orders';"

echo.
echo Test 5: List all tables to confirm...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo.
echo ✅ Creating test data...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo ✅ Final count verification...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as total_tables FROM sqlite_master WHERE type='table';"

echo.
echo ✅ SUCCESS! All reserved keyword errors should be fixed!
pause
