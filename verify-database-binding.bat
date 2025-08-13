@echo off
echo ============================================================
echo      VERIFIKASI BINDING DATABASE DI CLOUDFLARE PAGES
echo ============================================================
echo.

echo Berikut adalah langkah-langkah untuk memverifikasi binding database:

echo 1. Login ke Cloudflare Dashboard (https://dash.cloudflare.com)
echo 2. Buka menu Workers & Pages
echo 3. Pilih project "santrionline"
echo 4. Klik tab "Settings" 
echo 5. Pilih "Functions"
echo 6. Scroll ke bagian "D1 database bindings"
echo.

echo Pastikan binding berikut sudah ada:
echo - Binding name: DB
echo - Database: santri-db
echo.

echo Jika binding belum ada, klik "Add binding":
echo - Pilih "D1 database"
echo - Masukkan nama binding: DB
echo - Pilih database: santri-db
echo - Klik "Save"
echo.

echo Setelah mengubah binding, Anda harus meredeployment aplikasi:
echo 1. Klik "Deployments" di sidebar
echo 2. Klik "Create deployment"
echo 3. Pilih "Deploy" untuk menggunakan build terakhir
echo.

echo ============================================================
echo   CATATAN: BINDING HARUS DIKONFIGURASI DI DASHBOARD SECARA MANUAL
echo             SCRIPT INI HANYA PANDUAN INSTRUKSI
echo ============================================================
