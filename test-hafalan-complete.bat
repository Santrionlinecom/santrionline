@echo off
echo ============================================
echo   HAFALAN DASHBOARD COMPLETE SETUP
echo ============================================
echo.

echo ✅ Step 1: Verifying database tables exist...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"

echo.
echo ✅ Step 2: Checking test user exists...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user WHERE email='test@santrionline.com';"

echo.
echo ✅ Step 3: Checking dompet_santri table...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"

echo.
echo ✅ Step 4: Checking Quran surahs data...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as surah_count FROM quran_surah;"

echo.
echo ✅ Step 5: Checking Diniyah curriculum data...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as kitab_count FROM diniyah_kitab;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as lesson_count FROM diniyah_pelajaran;"

echo.
echo ✅ Step 6: Testing hafalan progress insertion...
wrangler d1 execute santri-db --local --command="INSERT OR REPLACE INTO user_hafalan_quran (user_id, surah_id, completed_ayah) VALUES ('user_1754302221230_8rc7y3ahq', 1, 7);"
wrangler d1 execute santri-db --local --command="INSERT OR REPLACE INTO user_progres_diniyah (user_id, pelajaran_id, status) VALUES ('user_1754302221230_8rc7y3ahq', 1, 'completed');"

echo.
echo ✅ Step 7: Verifying test progress data...
wrangler d1 execute santri-db --local --command="SELECT * FROM user_hafalan_quran WHERE user_id='user_1754302221230_8rc7y3ahq';"
wrangler d1 execute santri-db --local --command="SELECT * FROM user_progres_diniyah WHERE user_id='user_1754302221230_8rc7y3ahq';"

echo.
echo ✅ HAFALAN DASHBOARD SETUP COMPLETE!
echo.
echo 🚀 Test with:
echo    npm run dev
echo    Visit: http://localhost:5173/dashboard/hafalan
echo.
echo 📧 Test credentials:
echo    Email: test@santrionline.com
echo    Password: password123
echo.
pause
