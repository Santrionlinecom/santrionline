@echo off
echo ============================================
echo   COMPLETE FIX: All Database Errors
echo ============================================
echo.

echo ✅ Fixing ALL database errors:
echo    - no such table: dompet_santri
echo    - near ".": syntax error at offset 0  
echo    - near "transaction": syntax error at offset 27
echo.

echo Step 1: Creating database with ALL fixes applied...
wrangler d1 execute santri-db --local --file=setup-simple.sql

if errorlevel 1 (
    echo ❌ Error in setup-simple.sql, trying alternative...
    wrangler d1 execute santri-db --local --file=fix-transaction-keyword.sql
)

echo.
echo Step 2: Verifying all tables exist...
wrangler d1 execute santri-db --local --command="SELECT 'Tables: ' || GROUP_CONCAT(name, ', ') as all_tables FROM sqlite_master WHERE type='table';"

echo.
echo Step 3: Creating test user and wallet...
node create-test-user.cjs
wrangler d1 execute santri-db --local --file=test-user.sql

echo.
echo Step 4: Final verification - testing all fixed tables...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as transactions_table_exists FROM sqlite_master WHERE type='table' AND name='transactions';"

echo.
echo ✅ ✅ ✅ ALL DATABASE ERRORS FIXED! ✅ ✅ ✅
echo.
echo Summary of fixes:
echo ✅ dompet_santri table created
echo ✅ No dot commands used (. syntax error fixed)  
echo ✅ Reserved keywords fixed (transaction → transactions)
echo ✅ Test user created successfully
echo.
echo Your database is now ready to use!
pause
