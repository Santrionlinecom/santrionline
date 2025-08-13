@echo off
echo ===============================================
echo  🚀 STARTING SANTRI ONLINE DEVELOPMENT SERVER
echo ===============================================
echo.

cd /d "c:\Users\DELL\santrionline"

echo 📁 Current directory: %CD%
echo.

echo 🔧 Checking if server is already running...
netstat -ano | findstr :5174 > nul
if %errorlevel% == 0 (
    echo ⚠️  Port 5174 is already in use. 
    echo 🛑 Killing existing processes...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :5174') do (
        taskkill /PID %%i /F > nul 2>&1
    )
    timeout /t 2 > nul
)

echo.
echo 🚀 Starting development server...
echo.
echo 📝 To access the application:
echo    ➡️  http://localhost:5174
echo    ➡️  http://localhost:5174/dashboard/profil
echo.
echo 💡 Tips:
echo    - Press Ctrl+C to stop the server
echo    - The server will auto-reload on file changes
echo    - Check console for any errors
echo.
echo ===============================================

npm run dev

pause
