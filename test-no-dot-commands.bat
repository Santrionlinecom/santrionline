@echo off
echo ============================================
echo   TESTING DATABASE - NO DOT COMMANDS
echo ============================================
echo.

echo ✅ Using only standard SQL commands (D1 compatible)
echo.

echo Test 1: List all tables using standard SQL...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo.
echo Test 2: Check if dompet_santri exists...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'dompet_santri EXISTS' ELSE 'dompet_santri NOT FOUND' END as result FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

echo.
echo Test 3: Check if user table exists...
wrangler d1 execute santri-db --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'user table EXISTS' ELSE 'user table NOT FOUND' END as result FROM sqlite_master WHERE type='table' AND name='user';"

echo.
echo Test 4: Insert test data...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo Test 5: Verify data was inserted...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"

echo.
echo ✅ ALL TESTS COMPLETED - NO DOT SYNTAX ERRORS!
pause
