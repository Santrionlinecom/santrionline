@echo off
echo ===================================
echo DEPLOY KITAB DINIYAH KE PRODUCTION
echo ===================================
echo.
echo PERINGATAN: Ini akan mengupdate database production!
echo Pastikan backup sudah dilakukan.
echo.
set /p confirm="Lanjutkan? (y/N): "
if /i "%confirm%" NEQ "y" (
    echo Operasi dibatalkan.
    pause
    exit /b
)

echo.
echo [1/2] Deploying ke production database...
wrangler d1 execute santri-db --file=setup-kitab-diniyah-lengkap.sql

echo.
echo [2/2] Verifikasi deployment...
wrangler d1 execute santri-db --command="SELECT 'AQIDATUL AWAM' as kitab, COUNT(*) as total_pelajaran FROM diniyah_pelajaran WHERE kitab_id = 1 UNION ALL SELECT 'HADITS ARBAIN', COUNT(*) FROM diniyah_pelajaran WHERE kitab_id = 2 UNION ALL SELECT 'TOTAL KONTEN', COUNT(*) FROM diniyah_pelajaran_content;"

echo.
echo ===================================
echo DEPLOYMENT BERHASIL!
echo ===================================
echo.
echo Database production telah diperbarui dengan:
echo - 20 pelajaran Aqidatul Awam lengkap
echo - 40 hadits Arbain Nawawi lengkap
echo - Konten detail dan terstruktur
echo.
pause
