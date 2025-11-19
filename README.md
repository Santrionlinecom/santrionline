# Santri Online - Platform Digital Terintegrasi untuk Santri

🕌 **Super App untuk Komunitas Santri dan Pesantren** 🕌

Dibuat oleh **Yogik Pratama Aprilian**

## 🌟 Tentang Proyek

Platform Digital Terintegrasi untuk Santri adalah sebuah Super App yang dirancang khusus untuk memenuhi kebutuhan komunitas santri dan pesantren. Platform ini menggabungkan berbagai layanan dalam satu aplikasi yang mudah digunakan.

## 🌐 Website & Media Sosial

**Website Utama:**

- 🌍 [santrionline.com](https://santrionline.com)
- 🌍 [santrionline.my.id](https://santrionline.my.id)

**Media Sosial:**

- 📸 [Instagram](https://instagram.com/idsantrionline)
- 👥 [Facebook](https://facebook.com/santrionline.my.id)
- 🎵 [TikTok](https://www.tiktok.com/@santrionline.com)
- 📺 [YouTube](https://www.youtube.com/@websantri)
- 🐦 [Twitter/X](https://x.com/Websantrionline)

**E-commerce:**

- 🛒 [Shopee](https://shopee.co.id/onlinesantri)
- 🛍️ [Tokopedia](https://tokopedia.com/santrionline)

## 🎯 Target Pengguna

- Santri di seluruh Indonesia
- Pesantren dan lembaga pendidikan Islam
- Komunitas Islam yang mengikuti paham Ahlus Sunnah wal Jama'ah

## 📚 Pedoman Konten

Platform ini mengikuti pedoman konten berdasarkan:

- ☪️ Pandangan Ahlus Sunnah wal Jama'ah
- 📖 Berdasarkan 4 mazhab dan tasawuf
- 🚫 Menghindari pandangan yang menyerupai Wahabi

## 🛠️ Teknologi Inti

Remix + Vite + Cloudflare Workers (Wrangler), Drizzle ORM (D1 / SQLite), TailwindCSS, Radix UI, TypeScript strict.

## ⚙️ Struktur Proyek (Ringkas)

```
app/
	routes/         -> Route Remix
	components/     -> Komponen UI
	db/             -> schema.ts (Drizzle)
	lib/, utils/    -> Helper & util
drizzle/          -> File migrasi hasil generate drizzle-kit
sql/legacy/       -> Patch SQL lama (tidak dipakai langsung)
migrations/       -> (Historical) – akan dipusatkan di drizzle/ ke depan
.github/workflows/-> CI (quality + deploy)
```

## 🚀 Development Cepat

```sh
npm install
cp .env.example .env  # isi variabel
npm run dev           # jalankan dev server (Remix + Vite)
```

Cloudflare local preview:

```sh
npm run build
npm start
```

## 🗄️ Database & Migrasi

- Schema utama: `app/db/schema.ts`
- Generate migrasi baru (akan memakai drizzle-kit standar):
  ```sh
  npm run db:gen
  ```
- Push (eksperimental) / apply otomatis via Wrangler (prod):
  ```sh
  npm run deploy:db
  ```
- Patch manual lama dipindah ke `sql/legacy/` agar root bersih.
- Seed:
  ```sh
  npm run db:seed
  ```

## ✅ Quality Tooling

- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format` / `npm run format:check`
- Test (Vitest): `npm test` / watch: `npm run test:watch`

CI (GitHub Actions) otomatis: lint + typecheck + test + build.

## 🔐 Environment

Salin `.env.example` -> `.env` lalu isi:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `DATABASE_ID`
- `SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ADMIN_EMAILS`

Jangan commit `.env`.

Panduan lengkap konfigurasi Supabase Auth tersedia di
[`SUPABASE_AUTH_SETUP.md`](./SUPABASE_AUTH_SETUP.md).

## 📱 Android Keystore

Untuk kebutuhan signing aplikasi Android, ikuti langkah pada
[`ANDROID_KEYSTORE_GUIDE.md`](./ANDROID_KEYSTORE_GUIDE.md) untuk membuat berkas keystore baru menggunakan `keytool`.

## 🩺 Health Check

Worker expose endpoint:

```
/health  -> { status: "ok" }
/status  -> info binding/env minimal
```

## 🧪 Testing

Vitest + Testing Library. Tambah test baru di `app/**/__tests__/*.test.(ts|tsx)`.
Contoh sederhana ada di `app/components/__tests__/`.

## 📦 Deployment

Build & deploy Worker:

```sh
npm run build
npm run deploy
```

Full (migrasi + deploy):

```sh
npm run deploy:full
```

## 🔄 Sinkronisasi Deployment, Domain, dan SEO

- **Otomatisasi update:** Repository ini sudah disiapkan untuk proses build dan deploy otomatis melalui Cloudflare Pages. Aktifkan auto-deploy pada branch `main` sehingga setiap push terbaru akan langsung diproses dan dipublikasi tanpa perlu langkah manual tambahan.【F:CLOUDFLARE_PAGES_DEPLOYMENT.md†L27-L44】【F:DEPLOYMENT_FAQ.md†L1-L26】
- **Integrasi domain real-time:** Konfigurasi `wrangler.toml` dan `wrangler.pages.toml` menyertakan binding database, R2 storage, serta output build yang kompatibel dengan Cloudflare Pages. Tambahkan custom domain (`santrionline.com` dan variannya) melalui dashboard Pages—bukan lewat blok `routes`—agar konfigurasi Pages tetap valid saat build berjalan.【F:wrangler.toml†L1-L14】【F:CLOUDFLARE_PAGES_DEPLOYMENT.md†L46-L77】【F:DEPLOYMENT_FAQ.md†L65-L116】
- **Kesiapan indexing Google:** Fitur komunitas dan konten di dalam aplikasi dirancang agar SEO-friendly dan dapat terindeks oleh Google secara real-time, sehingga setiap pembaruan konten akan ikut terbaca crawler setelah deployment terbaru aktif.【F:KOMUNITAS_FEATURE_DOCUMENTATION.md†L5-L29】

## 🧹 Legacy SQL

File `fix-*` dan patch besar historis dipindahkan ke `sql/legacy/` untuk arsip. Jangan modifikasi, gunakan migrasi baru melalui drizzle.

## 🤝 Kontribusi

Lihat `CONTRIBUTING.md`.

## 📝 Lisensi

MIT – lihat `LICENSE`.

## SantriOnline App (Cloudflare Pages + D1 + R2)

Aplikasi ini siap dijalankan di Cloudflare Pages dengan backend Functions, database D1, dan storage R2.

### Deploy ke Cloudflare Pages
1. Jalankan `npm install` lalu `npm run build` untuk memastikan build sukses.
2. Commit dan push ke GitHub. Di Cloudflare Pages buat project baru, pilih repo ini.
3. Build command: `npm run build:pages` atau `npm run build` (Pages akan memakai output `build/client`).
4. Output folder: `build/client`.
5. Aktifkan Pages Functions agar route Remix berjalan.

### Konfigurasi `wrangler.toml`
File sudah menyiapkan binding:
- D1: `SANTRI_DB`
- R2: `SANTRI_BUCKET`
Custom domain dan routing diatur di dashboard Cloudflare Pages setelah project terhubung; blok `routes` tidak digunakan untuk Pages.

Jika membuat database baru jalankan:
```bash
wrangler d1 create santrionline-app
wrangler d1 migrations apply santrionline-app
```

### Binding Environment di Cloudflare
Tambahkan variable berikut di Pages > Settings > Environment Variables:
- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `MOONWA_API_KEY`

Tambahkan D1 binding `SANTRI_DB` dan R2 binding `SANTRI_BUCKET` sesuai `wrangler.toml`.

### DNS untuk produksi
1. Di Cloudflare DNS tambahkan record CNAME:
   - Name: `app`
   - Target: `<project-name>.pages.dev`
   - Proxy status: Proxied (awan oranye)
2. Verifikasi custom domain di Pages dan hubungkan `app.santrionline.com`.

### Catatan runtime
- Semua loader dan action Remix memakai Web Fetch API yang kompatibel dengan runtime Cloudflare Pages.
- Hindari modul native Node karena Functions berjalan di lingkungan Workers.
