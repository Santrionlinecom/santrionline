@echo off
echo Setting up Certificate Tables for Santri Online...
echo.

REM Check if D1 database exists
echo Checking D1 database connection...
wrangler d1 info santri-db
if errorlevel 1 (
    echo ERROR: D1 database not found. Please create the database first.
    pause
    exit /b 1
)

echo.
echo Creating certificate tables in LOCAL database...
wrangler d1 execute santri-db --local --file=setup-certificate-tables.sql

if errorlevel 1 (
    echo ERROR: Failed to create tables in local database
    pause
    exit /b 1
)

echo.
echo Certificate tables created successfully in LOCAL database!
echo.

set /p deploy_prod=Do you want to deploy to PRODUCTION database too? (y/N): 
if /i "%deploy_prod%"=="y" (
    echo.
    echo Creating certificate tables in PRODUCTION database...
    wrangler d1 execute santri-db --file=setup-certificate-tables.sql
    
    if errorlevel 1 (
        echo ERROR: Failed to create tables in production database
        pause
        exit /b 1
    )
    
    echo.
    echo Certificate tables created successfully in PRODUCTION database!
) else (
    echo.
    echo Skipping production deployment.
)

echo.
echo =================================
echo Certificate Database Setup Complete!
echo =================================
echo.
echo Tables created:
echo - certificates
echo - achievements  
echo - completed_books
echo - certificate_downloads
echo - santri_summary (view)
echo.
echo You can now:
echo 1. Test the certificate feature locally
echo 2. Admin can approve/reject certificates
echo 3. Santri can download approved certificates
echo.
pause
