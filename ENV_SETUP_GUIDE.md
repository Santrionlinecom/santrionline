# ENV Setup Guide

Ringkas & langsung bisa dipakai. Fokus: Cloudflare + GitHub Actions + lokal.

## 0. Daftar Variabel

Wajib:
- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- DATABASE_ID (ID D1)
- SESSION_SECRET

Opsional / observability:
- APP_ENV (local|staging|production)
- LOG_LEVEL (trace|debug|info|warn|error) default: info
- LOG_SQL (0/1) aktifkan log query
- LOG_DEBUG_SAMPLE (0.0–1.0) sampling debug
- FEATURE_EXPERIMENTAL (0/1)
- SENTRY_DSN (jika pakai)
- APP_VERSION / COMMIT_SHA (diisi CI)

## 1. Cloudflare Dashboard

1. Buka Dashboard: https://dash.cloudflare.com/
2. Ambil Account ID:
   - Masuk ke halaman overview akun: https://dash.cloudflare.com/<ACCOUNT_ID>
   - Copy Account ID (tampil di sidebar/overview).
3. Ambil D1 Database ID:
   - Buka: https://dash.cloudflare.com/<ACCOUNT_ID>/workers/d1
   - Klik database yang dipakai → Overview → Database ID.
4. Buat API Token baru:
   - Halaman token: https://dash.cloudflare.com/profile/api-tokens
   - Create Token → Custom
   - Permissions (Account scope):
     - Workers Scripts: Edit
     - D1 Database: Edit
     - Account Settings: Read
   - (Tambahkan lain jika nanti perlu: KV Storage: Edit, R2: Edit, dsb.)
   - Restrict to Account: pilih akun Anda.
   - Generate & COPY SEKALI (simpan di password manager).
5. Revoke token lama yang sudah terekspos (jika ada).

## 2. GitHub Repository Secrets

URL langsung (ganti owner/repo):
https://github.com/Santrionlinecom/santrionline/settings/secrets/actions

Tambahkan (New repository secret):
| Name | Value |
|------|-------|
| CLOUDFLARE_ACCOUNT_ID | <Account ID> |
| CLOUDFLARE_API_TOKEN  | <API Token Baru> |
| DATABASE_ID           | <D1 Database ID> |

Jika workflow referensi nama berbeda (misal CLOUDFLARE_DATABASE_ID) samakan satu konvensi.

Tidak perlu tanda kutip pada GitHub Secrets.

## 3. File Lokal (.env)

File `.env` SUDAH ada & di-ignore git. Isi seperti berikut (contoh):

```
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_API_TOKEN=cf_token_xxxxxxxxxxxxx
DATABASE_ID=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
SESSION_SECRET=<hasil generate>
APP_ENV=local
LOG_LEVEL=info
LOG_SQL=0
LOG_DEBUG_SAMPLE=0.1
FEATURE_EXPERIMENTAL=0
SENTRY_DSN=
```

Generate SESSION_SECRET (PowerShell):
```
[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
```
Salin output (64 hex chars) → paste ke SESSION_SECRET.

Atau (jika ada OpenSSL): `openssl rand -hex 48`

## 4. Validasi Lokal

1. Pastikan sudah `npm install`.
2. Jalankan dev: `npm run dev`
3. Akses http://localhost:3000/health → harus `ok`.

Jika error terkait kredensial Cloudflare saat migrasi / worker binding:
- Pastikan wrangler.toml (jika ada) konsisten dengan DATABASE_ID.
- Atau jalankan ulang dengan session terbaru setelah set `.env`.

## 5. Validasi GitHub Actions

1. Commit perubahan sanitasi (tanpa nilai sensitif).
2. Push ke branch → buka tab Actions.
3. Lihat workflow deploy/build → pastikan tidak ada error "missing CLOUDFLARE_API_TOKEN".
4. Jika error: cek nama secret & referensi di `deploy.yml` (case sensitive).

## 6. Rotasi Token (Jika Bocor)

1. Revoke token lama (API Tokens page).
2. Buat token baru dengan scope sama.
3. Update GitHub Secret (Edit) CLOUDFLARE_API_TOKEN.
4. Update `.env` lokal.
5. Trigger redeploy (commit atau workflow dispatch).

## 7. Checklist Cepat

[] Token lama direvoke
[] Token baru dibuat & disimpan
[] Account ID & Database ID dicatat
[] Secrets GitHub terisi 3 variabel utama
[] `.env` lokal diisi & tidak di-commit
[] `/health` lokal OK
[] Action deploy sukses

## 8. Troubleshooting Singkat

| Gejala | Penyebab Umum | Perbaikan |
|--------|---------------|-----------|
| 403 / Unauthorized deploy | Token scope kurang | Tambah Workers Scripts:Edit / D1 Database:Edit |
| Variable kosong saat runtime | Nama beda di workflow | Samakan env name & secret name |
| Build tidak baca LOG_SQL | Nilai string "1" vs number | Pastikan parsing di kode, atau isi 1 tanpa kutip |
| Session error | SESSION_SECRET pendek | Gunakan ≥ 32 chars random |

## 9. Keamanan

- Jangan share screenshot token.
- Hindari commit `.env` (sudah di-ignore; tetap cek sebelum commit).
- Putuskan akses orang yang tidak perlu di Cloudflare.
- Rotasi token tiap beberapa bulan atau saat anggota tim keluar.

---
Butuh otomatisasi (script generate / cek env)? Tambah issue: "feat: env doctor".
