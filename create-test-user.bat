@echo off
echo ============================================================
echo         MEMBUAT USER TEST DI DATABASE SANTRI ONLINE
echo ============================================================
echo.

echo [1/1] Menjalankan script create-test-user.js...
node create-test-user.js

echo.
echo Jika Anda ingin menjalankan SQL ini secara langsung di D1 database:
echo 1. Login ke https://dash.cloudflare.com
echo 2. Buka Workers & Pages > D1 > santri-db
echo 3. Klik "Query"
echo 4. Salin dan tempel SQL dari output di atas
echo 5. Klik "Run Query"
echo.

echo ============================================================
