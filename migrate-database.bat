@echo off
echo ============================================================
echo         MIGRASI DATABASE SANTRI ONLINE KE D1
echo ============================================================
echo.

echo [1/2] Menjalankan migrasi database ke D1...
npx wrangler d1 migrations apply santri-db --remote
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Migrasi database gagal. Mohon periksa pesan error di atas.
  exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Verifikasi status database...
echo.
echo Mohon verifikasi di Cloudflare Dashboard:
echo 1. Login ke https://dash.cloudflare.com
echo 2. Buka Workers & Pages > D1 > santri-db
echo 3. Pastikan semua tabel telah terbuat dengan benar
echo.

echo ============================================================
echo                MIGRASI DATABASE SELESAI!
echo ============================================================
echo.
echo Jika tidak ada error, database sudah siap digunakan.
echo.
echo Langkah selanjutnya:
echo 1. Jalankan 'deploy-to-pages.bat' untuk deploy aplikasi
echo 2. Verifikasi binding di Cloudflare Pages Dashboard
echo.
echo ============================================================
