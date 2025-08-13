# Cloudflare Pages Deployment Guide

## Build Configuration
- **Build Command:** `npm run build`
- **Build Output Directory:** `build/client`
- **Node.js Version:** 18+

## Configuration Files
- **`wrangler.toml`**: Used for Workers deployment
- **`wrangler.pages.toml`**: Used for Pages deployment

> **IMPORTANT:** Do not include both `main` and `pages_build_output_dir` in the same `wrangler.toml` file for Pages deployment!

## Prosedur Update Website

### Alur Kerja Update dan Deployment

1. **Membuat perubahan lokal**
   - Edit file-file yang diperlukan
   - Uji perubahan di lingkungan lokal dengan `npm run dev`

2. **Commit perubahan ke Git**
   - `git add .` (untuk menambahkan semua perubahan)
   - `git commit -m "Pesan commit yang deskriptif"`
   - `git push` (untuk mendorong perubahan ke GitHub)

3. **Deploy ke Cloudflare Pages**
   - Gunakan script deployment: `deploy-to-pages.bat`
   - Tunggu proses build dan deployment selesai

### Metode Deployment

#### Metode 1: Deploy dari Komputer Lokal (Direkomendasikan)
Gunakan script yang telah disediakan untuk deployment dari komputer lokal:
```bash
# Windows
deploy-to-pages.bat

# Linux/macOS (jika tersedia)
bash deploy-to-pages.sh
```

#### Metode 2: Auto-Deploy dari GitHub
Cloudflare Pages dapat dikonfigurasi untuk otomatis melakukan build dan deploy ketika ada push ke branch tertentu di GitHub:
1. Masuk ke dashboard Cloudflare Pages
2. Pilih project Santri Online
3. Klik tab "Settings" > "Builds & deployments"
4. Aktifkan "Auto-deploy" untuk branch `main`

## Environment Variables Required:
```
APP_ENV=production



## Database & Storage Bindings:
- **DB:** D1 Database (santri-db)
- **R2_BUCKET:** R2 Bucket (santri-online-files)

## Custom Domain:
After deployment, you can add your custom domain:
1. Go to Pages → Your Project → Custom domains
2. Add `santrionline.com` and `www.santrionline.com`
3. Configure DNS records as instructed

## Setting Up Subdomains:

### News Subdomain Setup (news.santrionline.com)
To create a news or blog section on a subdomain:

1. **Add the Subdomain in Cloudflare Pages:**
   - Go to Pages → Your Project → Custom domains
   - Click "Add domain"
   - Enter `news.santrionline.com`
   - Follow verification steps

2. **Configure DNS Settings:**
   - Go to Cloudflare DNS management for your domain
   - Create a new CNAME record:
     - Type: CNAME
     - Name: news
     - Target: Your Cloudflare Pages project URL (e.g., `your-project.pages.dev`)
     - Proxy status: Proxied (recommended)

3. **Route Traffic in Your Application:**
   - Add routing logic in your application to direct subdomain traffic
   - Example configuration in your app:
   ```js
   // In your routing configuration
   if (new URL(request.url).hostname.startsWith('news.')) {
     // Handle requests for the news subdomain
     return handleNewsSection(request);
   }
   ```

4. **Verify Configuration:**
   - Wait for DNS propagation (may take up to 24 hours)
   - Test the subdomain by visiting `news.santrionline.com`

## Notes:
- Functions are automatically handled via the `/functions` directory
- Static assets are served from `/public`
- Server-side rendering works via Cloudflare Workers runtime
