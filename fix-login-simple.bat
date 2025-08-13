@echo off
echo ===========================================
echo FIXING LOGIN ERRORS - SantriOnline
echo ===========================================

echo.
echo 1. Updating test user password...
wrangler d1 execute santri-db --local --command "UPDATE user SET password_hash = 'password123' WHERE email = 'test@santrionline.com';"

echo.
echo 2. Verifying test user...
wrangler d1 execute santri-db --local --command "SELECT email, name, password_hash FROM user WHERE email = 'test@santrionline.com';"

echo.
echo 3. Testing complete! Now you can login with:
echo    Email: test@santrionline.com
echo    Password: password123
echo.
echo ===========================================
echo LOGIN FIX COMPLETED
echo ===========================================
pause
