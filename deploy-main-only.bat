@echo off
echo ============================================================
echo         DEPLOYING SANTRI ONLINE TO MAIN DOMAIN ONLY
echo ============================================================
echo.

echo [1/4] Checking for pending changes...
git status --porcelain > nul
if %ERRORLEVEL% EQU 0 (
  echo No uncommitted changes detected, proceeding with deployment.
) else (
  echo WARNING: There are uncommitted changes in your workspace.
  echo These changes will not be included in the deployment.
  echo Consider committing your changes first.
  echo.
  echo Press ENTER to continue anyway, or CTRL+C to cancel.
  pause > nul
)

echo.
echo [2/4] Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Build failed. Please fix the errors and try again.
  exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Deploying to Cloudflare Pages (main domain only)...
echo This may take a few minutes...
npx wrangler pages deploy build/client --project-name=santrionline
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Deployment failed. Please check the error message above.
  exit /b %ERRORLEVEL%
)

echo.
echo [4/4] Cleanup completed.

echo.
echo ============================================================
echo                   DEPLOYMENT COMPLETED!
echo ============================================================
echo.
echo Your application has been successfully deployed to:
echo https://santrionline.com (main domain)
echo.
echo All subdomain configurations have been removed.
echo Only the main domain santrionline.com will be used.
echo.
echo Have a great day!
echo ============================================================
