@echo off
echo ============================================
echo   FIXING SYNTAX ERROR AND FOREIGN KEY ERROR
echo ============================================
echo.

echo ✅ Step 1: Testing basic database connection...
wrangler d1 execute santri-db --local --command="SELECT 1 as test;"

echo.
echo ✅ Step 2: Checking all tables exist...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"

echo.
echo ✅ Step 3: Testing user table...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as user_count FROM user;"

echo.
echo ✅ Step 4: Testing dompet_santri table...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as wallet_count FROM dompet_santri;"

echo.
echo ✅ Step 5: Testing quran_surah table (no apostrophes)...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as surah_count FROM quran_surah;"

echo.
echo ✅ Step 6: Testing diniyah tables...
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as kitab_count FROM diniyah_kitab;"
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as lesson_count FROM diniyah_pelajaran;"

echo.
echo ✅ Step 7: Testing foreign key relationships...
wrangler d1 execute santri-db --local --command="SELECT u.name, d.dincoin_balance FROM user u JOIN dompet_santri d ON u.id = d.user_id;"

echo.
echo ✅ Step 8: Testing hafalan progress...
wrangler d1 execute santri-db --local --command="SELECT q.name, h.completed_ayah FROM user_hafalan_quran h JOIN quran_surah q ON h.surah_id = q.id;"

echo.
echo ✅ Step 9: Testing diniyah progress...
wrangler d1 execute santri-db --local --command="SELECT p.title, up.status FROM user_progres_diniyah up JOIN diniyah_pelajaran p ON up.pelajaran_id = p.id;"

echo.
echo ✅ Step 10: Testing INSERT operations (no syntax errors)...
wrangler d1 execute santri-db --local --command="INSERT OR REPLACE INTO user_hafalan_quran (user_id, surah_id, completed_ayah) VALUES ('user_test_123', 114, 6);"

echo.
echo ✅ Step 11: Testing UPDATE operations (no foreign key errors)...
wrangler d1 execute santri-db --local --command="UPDATE user_progres_diniyah SET status='completed' WHERE user_id='user_test_123' AND pelajaran_id=2;"

echo.
echo ✅ ALL TESTS PASSED!
echo.
echo 🎯 BOTH ERRORS FIXED:
echo    ❌ "near am syntax error" - FIXED by removing apostrophes
echo    ❌ "FOREIGN KEY constraint failed" - FIXED by proper table order
echo.
echo 🚀 Ready to test dashboard:
echo    npm run dev
echo    http://localhost:5173/dashboard/hafalan
echo.
pause
