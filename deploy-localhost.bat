@echo off
echo ============================================================
echo            SANTRI ONLINE - LOCALHOST DEVELOPMENT
echo ============================================================
echo.

echo [1/3] Checking dependencies...
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies.
    exit /b %ERRORLEVEL%
  )
) else (
  echo Dependencies already installed.
)

echo.
echo [2/3] Building for development...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Build failed. Please fix the errors and try again.
  exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Starting development server...
echo ============================================================
echo                 DEVELOPMENT SERVER STARTING
echo ============================================================
echo.
echo Your localhost application will be available at:
echo http://localhost:3000
echo.
echo Press CTRL+C to stop the server when done.
echo ============================================================
echo.

call npm run dev
