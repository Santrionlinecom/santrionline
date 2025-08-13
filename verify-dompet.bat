@echo off
echo Verifying database tables...
echo.

echo Listing all tables:
wrangler d1 execute santri-db --local --command=".tables"

echo.
echo Checking dompet_santri table structure:
wrangler d1 execute santri-db --local --command=".schema dompet_santri"

echo.
echo Testing dompet_santri table:
wrangler d1 execute santri-db --local --command="SELECT COUNT(*) as table_exists FROM sqlite_master WHERE type='table' AND name='dompet_santri';"

pause
