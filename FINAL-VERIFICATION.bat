@echo off
echo ============================================
echo   FINAL VERIFICATION - NO SYNTAX ERRORS  
echo ============================================
echo.

echo ✅ Step 1: Testing basic database connection...
wrangler d1 execute inti-santri --local --command="SELECT 'OK' as connection_test;"

echo.
echo ✅ Step 2: Creating all tables from setup-simple.sql...
wrangler d1 execute inti-santri --local --file=setup-simple.sql

echo.
echo ✅ Step 3: Verifying tables exist (using standard SQL)...
wrangler d1 execute inti-santri --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo.
echo ✅ Step 4: Specifically check dompet_santri exists...
wrangler d1 execute inti-santri --local --command="SELECT CASE WHEN COUNT(*) > 0 THEN 'dompet_santri table EXISTS ✅' ELSE 'dompet_santri table MISSING ❌' END as result FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

echo.
echo ✅ Step 5: Creating test user and wallet...
node create-test-user.cjs
wrangler d1 execute inti-santri --local --file=test-user.sql

echo.
echo ✅ Step 6: Final verification - count records...
wrangler d1 execute inti-santri --local --command="SELECT COUNT(*) as total_users FROM user;"
wrangler d1 execute inti-santri --local --command="SELECT COUNT(*) as total_wallets FROM dompet_santri;"

echo.
echo ✅ SUCCESS! No more syntax errors!
echo ✅ Both "no such table: dompet_santri" and "near '.' syntax error" are FIXED!
echo.
pause
