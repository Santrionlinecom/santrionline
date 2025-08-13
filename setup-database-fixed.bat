@echo off
echo ============================================
echo   SETUP DATABASE - FIXED VERSION
echo ============================================
echo.

echo Creating comprehensive database with correct schema...
echo.

echo Step 1: Running database migrations...
npm run db:migrate

echo.
echo Step 2: Seeding with safe data...
wrangler d1 execute santri-db --local --file=safe-seed-data.sql

echo.
echo Step 3: Verifying tables exist...
wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

echo.
echo Step 4: Testing basic queries...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as surah_count FROM quran_surah;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"

echo.
echo ✅ Database setup completed!
echo.
echo 🚀 Ready to run:
echo    npm run dev
echo.
echo 📧 Test login:
echo    Email: test@santrionline.com
echo    Password: password123
echo.
pause
