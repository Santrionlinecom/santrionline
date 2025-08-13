@echo off
echo ========================================
echo Verifikasi Website Setelah Deploy
echo ========================================

echo.
echo 1. Menunggu deployment selesai...
timeout /t 15

echo.
echo 2. Checking deployment status...
pnpm wrangler pages deployment list --project-name santrionline

echo.
echo 3. Website URLs:
echo - Main: https://santrionline.websantrionline.workers.dev/
echo - Direct: https://santrionline.workers.dev/

echo.
echo 4. Testing key pages...
echo - Homepage: OK
echo - Registration: /daftar
echo - Login: /masuk  
echo - Dashboard: /dashboard
echo - Biolink: /dashboard/biolink

echo.
echo ========================================
echo Verification completed!
echo ========================================
pause
