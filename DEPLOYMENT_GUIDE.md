# 🚀 Panduan Deployment Santri Online ke Cloudflare

## Prerequisites

1. ✅ Akun GitHub 
2. ✅ Akun Cloudflare (gratis)
3. ✅ Wrangler CLI terinstall
4. ✅ Node.js 20+ terinstall

## Setup Awal

### 1. Setup Cloudflare
```bash
# Login ke Cloudflare
npx wrangler auth login

# Atau gunakan API token
npx wrangler auth whoami
```

### 2. Dapatkan Cloudflare Account ID
- Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
- Pilih domain/workers
- Copy Account ID dari sidebar kanan

### 3. Buat API Token
- Pergi ke [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- Create Token -> Custom Token
- Permissions:
  - Zone:Zone:Read
  - Zone:Zone Settings:Edit
  - Account:Cloudflare Workers:Edit
  - Account:D1:Edit

## Setup Repository GitHub

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/santrionline.git
git push -u origin main
```

### 2. Setup GitHub Secrets
Buka repository GitHub -> Settings -> Secrets and variables -> Actions

Tambahkan secrets:
- `CLOUDFLARE_API_TOKEN`: Token yang dibuat tadi
- `CLOUDFLARE_ACCOUNT_ID`: Account ID dari dashboard

## Deployment Methods

### Method 1: Automatic via GitHub Actions ⭐ (Recommended)
```bash
# Push ke main branch
git add .
git commit -m "Deploy to production"
git push origin main
```
GitHub Actions akan otomatis build dan deploy!

### Method 2: Manual dari VS Code
```bash
# Run build script
.\build-and-deploy.bat

# Atau manual
npm run build
npm run deploy
```

### Method 3: Quick Deploy
```bash
npm run deploy:full
```

## Database Setup

### First Time Setup
```bash
# Buat database di Cloudflare
wrangler d1 create santri-db

# Apply migrations
wrangler d1 migrations apply santri-db

# Seed data (optional)
npm run db:seed:prod
```

### Update Database
```bash
# Generate new migration
npm run db:gen

# Apply to production
wrangler d1 migrations apply santri-db
```

## Custom Domain (Optional)

### 1. Setup di Cloudflare
- Add domain ke Cloudflare
- Update nameservers

### 2. Uncomment di wrangler.toml
```toml
[[routes]]
pattern = "santrionline.com/*"
zone_name = "santrionline.com"
```

### 3. Deploy ulang
```bash
npm run deploy
```

## Development Workflow

### 1. Local Development
```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

### 2. Test Production Build
```bash
# Build dan test
npm run build
npm start

# Open http://localhost:8787
```

### 3. Deploy
```bash
# Option 1: Auto via GitHub
git push origin main

# Option 2: Manual
npm run deploy:full
```

## Monitoring & Debugging

### View Logs
```bash
wrangler tail santrionline
```

### View Database
```bash
wrangler d1 execute santri-db --command "SELECT * FROM user LIMIT 10"
```

### Check Deployment Status
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [GitHub Actions](https://github.com/USERNAME/santrionline/actions)

## URLs

- **Development**: http://localhost:5173
- **Production**: https://santrionline.YOUR_SUBDOMAIN.workers.dev
- **Custom Domain**: https://santrionline.com (jika disetup)

## Troubleshooting

### Build Gagal
```bash
# Clear cache
rm -rf node_modules build
npm install
npm run build
```

### Database Error
```bash
# Check connection
wrangler d1 execute santri-db --command "SELECT 1"

# Recreate if needed
wrangler d1 create santri-db-new
```

### Deployment Error
```bash
# Check auth
wrangler auth whoami

# Re-auth if needed
wrangler auth login
```

## Tips

1. ✅ Selalu test local sebelum push ke GitHub
2. ✅ Gunakan GitHub Actions untuk deployment otomatis
3. ✅ Monitor logs setelah deployment
4. ✅ Backup database secara berkala
5. ✅ Use staging environment untuk testing major changes
