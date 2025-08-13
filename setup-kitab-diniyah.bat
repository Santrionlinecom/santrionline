@echo off
echo ===================================
echo SETUP KITAB DINIYAH LENGKAP
echo ===================================
echo.
echo Menginstall konten lengkap untuk:
echo 1. Aqidatul Awam (20 pelajaran)
echo 2. Hadits Arbain Nawawi (40 hadits)
echo.

echo [1/3] Setup database lokal...
wrangler d1 execute santri-db --local --file=setup-kitab-diniyah-lengkap.sql

echo.
echo [2/3] Verifikasi data lokal...
wrangler d1 execute santri-db --local --command="SELECT 'AQIDATUL AWAM' as kitab, COUNT(*) as total_pelajaran FROM diniyah_pelajaran WHERE kitab_id = 1 UNION ALL SELECT 'HADITS ARBAIN', COUNT(*) FROM diniyah_pelajaran WHERE kitab_id = 2;"

echo.
echo [3/3] Menampilkan sample konten...
wrangler d1 execute santri-db --local --command="SELECT dp.title, dpc.section_title, dpc.content_type FROM diniyah_pelajaran dp JOIN diniyah_pelajaran_content dpc ON dp.id = dpc.pelajaran_id WHERE dp.kitab_id IN (1,2) ORDER BY dp.kitab_id, dp.id LIMIT 5;"

echo.
echo ===================================
echo SETUP SELESAI!
echo ===================================
echo.
echo Untuk deploy ke production, jalankan:
echo setup-kitab-production.bat
echo.
pause
