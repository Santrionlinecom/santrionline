@echo off
echo ============================================
echo   COMPREHENSIVE DATABASE FIX
echo ============================================
echo.

echo Step 1: Creating all tables with correct schema...
wrangler d1 execute santri-db --local --file=comprehensive-database-fix.sql

echo.
echo Step 2: Seeding test data...
wrangler d1 execute santri-db --local --file=safe-seed-data.sql

echo.
echo Step 3: Verifying setup...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"

echo.
echo Step 4: Testing critical tables...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as transaction_count FROM transactions;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as surah_count FROM quran_surah;"

echo.
echo ✅ Database fix completed!
echo.
echo 🚀 Now test with:
echo    npm run dev
echo.
pause
