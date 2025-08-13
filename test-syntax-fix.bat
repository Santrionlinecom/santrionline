@echo off
echo ============================================
echo   FIXING SYNTAX ERROR - TESTING BUILD
echo ============================================
echo.

echo ✅ Step 1: Checking TypeScript compilation...
npx tsc --noEmit

echo.
echo ✅ Step 2: Testing Remix build...
npm run build

if errorlevel 1 (
    echo ❌ Build failed - there might be more syntax errors
    pause
    exit /b 1
)

echo.
echo ✅ Step 3: Build successful! Starting development server...
echo.
echo 🚀 Starting npm run dev...
echo Open http://localhost:5173/dashboard/hafalan in your browser
echo.
npm run dev
