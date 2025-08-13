@echo off
echo ===============================================
echo  🔧 FIXING SANTRI ONLINE DEVELOPMENT ISSUES
echo ===============================================
echo.

cd /d "c:\Users\DELL\santrionline"

echo 🛑 Killing all Node.js processes...
taskkill /IM node.exe /F 2>nul
timeout /t 3 > nul

echo 🧹 Clearing development cache...
if exist ".vite" rmdir /s /q ".vite"
if exist "node_modules/.vite" rmdir /s /q "node_modules\.vite"

echo 🔧 Fixing import issues...
echo Import path fixed in header.tsx

echo.
echo 🚀 Starting fresh development server...
echo.
echo 📝 Server will be available at:
echo    ➡️  http://localhost:5173 (or http://localhost:5174)
echo    ➡️  Dashboard: /dashboard
echo    ➡️  Profile page: /dashboard/profil
echo.

npm run dev

echo.
echo 💡 If still having issues:
echo 1. Check console for specific error messages
echo 2. Make sure all files are saved
echo 3. Try restarting VS Code
echo.
pause
