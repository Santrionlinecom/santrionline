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

Jangan commit `.env`.

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

## 🧹 Legacy SQL
File `fix-*` dan patch besar historis dipindahkan ke `sql/legacy/` untuk arsip. Jangan modifikasi, gunakan migrasi baru melalui drizzle.

## 🤝 Kontribusi
Lihat `CONTRIBUTING.md`.

## 📝 Lisensi
MIT – lihat `LICENSE`.
