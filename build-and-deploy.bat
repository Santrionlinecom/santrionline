@echo off
echo Starting build and deployment process...

echo Step 1: Clean build directories...
if exist build rmdir /s /q build
if exist public\build rmdir /s /q public\build

echo Step 2: Install dependencies...
npm install

echo Step 3: Run type checking...
npm run typecheck

echo Step 4: Build application...
npm run build

echo Step 5: Deploy to Cloudflare...
wrangler deploy

echo Step 6: Deploy database migrations...
wrangler d1 migrations apply inti-santri

echo Build and deployment complete!
echo Your app should be available at: https://santrionline.YOUR_SUBDOMAIN.workers.dev
pause
