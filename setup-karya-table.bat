@echo off
echo Setting up enhanced karya table...

echo Creating/updating karya table with all fields...
npx wrangler d1 execute santrionline-db --local --file=setup-karya-enhanced.sql

echo Setup completed!
echo.
echo You can now:
echo 1. Test locally: npm run dev
echo 2. Access: http://localhost:5173/dashboard/karyaku/tulis
echo 3. Deploy to production: npx wrangler d1 execute santrionline-db --file=setup-karya-enhanced.sql
echo.
pause
