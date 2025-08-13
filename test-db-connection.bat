@echo off
echo Testing database connection...

echo Checking database list...
npx wrangler d1 list

echo.
echo Testing basic query...
npx wrangler d1 execute santri-db --local --command="SELECT 1 as test"

echo.
echo Checking if karya table exists...
npx wrangler d1 execute santri-db --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name='karya'"

echo.
echo Testing karya table structure...
npx wrangler d1 execute santri-db --local --command="PRAGMA table_info(karya)"

echo.
pause
