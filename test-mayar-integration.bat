@echo off
echo Testing Mayar.id Integration...
echo.

echo Starting development server...
npm run dev

echo.
echo Open http://localhost:8787/dashboard/dompet to test the integration
echo.
echo Test flow:
echo 1. Click "Top Up" button
echo 2. Choose "Mayar.id Payment Gateway"
echo 3. Enter amount (minimum Rp 10,000)
echo 4. Click "Buat Link Pembayaran"
echo 5. Test payment using the generated link
echo.
pause
