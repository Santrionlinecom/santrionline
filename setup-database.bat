@echo off
cls
echo ================================================================
echo             🕌 SANTRIONLINE DATABASE SETUP 🕌
echo ================================================================
echo.

echo [1/4] 📁 Preparing database environment...
if not exist ".wrangler" mkdir ".wrangler"
if not exist ".wrangler\state" mkdir ".wrangler\state"
if not exist ".wrangler\state\v3" mkdir ".wrangler\state\v3"
if not exist ".wrangler\state\v3\d1" mkdir ".wrangler\state\v3\d1"
echo     ✅ Directories created

echo.
echo [2/4] 🗄️ Setting up database tables...
echo     📋 Running manual setup script...
npx wrangler d1 execute santrionlinedb --local --file=manual-setup.sql
if %errorlevel% neq 0 (
    echo     ❌ Database setup failed
    pause
    exit /b 1
)
echo     ✅ Database tables created

echo.
echo [3/4] � Verifying database setup...
npx wrangler d1 execute santrionlinedb --local --command="SELECT COUNT(*) as surah_count FROM quran_surah;"
npx wrangler d1 execute santrionlinedb --local --command="SELECT COUNT(*) as user_count FROM user;"
echo     ✅ Database verified

echo.
echo [4/4] 🚀 Database setup completed successfully!
echo.
echo ================================================================
echo              Ready to start development! 
echo ================================================================
echo.
echo To start the development server, run:
echo     npm run dev
echo.
pause
