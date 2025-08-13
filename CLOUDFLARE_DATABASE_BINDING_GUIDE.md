# Panduan Verifikasi Database D1 di Cloudflare Pages

## Masalah
Fungsi daftar dan masuk di https://santrionline.pages.dev tidak bekerja dengan baik karena binding database D1 belum dikonfigurasi dengan tepat.

## Solusi

### 1. Migrasi Database
Migrasi database sudah dilakukan dengan perintah:
```
npx wrangler d1 migrations apply santri-db --remote
```

Ada beberapa konflik migrasi yang telah diperbaiki:

1. Konflik pada `0002_enhanced_karya.sql`:
   - Membuat file migrasi baru `0005_enhanced_karya.sql`
   - Menghapus file migrasi lama `0002_enhanced_karya.sql`

2. Konflik pada `0004_biolink_features.sql`:
   - Membuat file migrasi baru `0006_biolink_features_fixed.sql`
   - Menghapus file migrasi lama `0004_biolink_features.sql`

### 2. Verifikasi Binding Database di Cloudflare Pages
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Buka Pages > santrionline
3. Klik "Settings" > "Functions"
4. Periksa apakah ada binding untuk D1 Database:
   - Nama: `DB`
   - Database: `santri-db`

Jika binding tidak ada, tambahkan melalui interface Cloudflare:
- Klik "Add binding"
- Pilih "D1 database"
- Masukkan nama binding: `DB`
- Pilih database: `santri-db`
- Klik "Save"

### 3. Verifikasi Environment Variables
Pastikan variabel lingkungan berikut sudah diatur:
- `APP_ENV` = `production`
- `SESSION_SECRET` = [nilai rahasia]

### 4. Deploy Ulang Aplikasi
Setelah binding dan environment variables dikonfigurasi, deploy ulang aplikasi menggunakan:
```
deploy-to-pages.bat
```

### 5. Verifikasi Fungsi Daftar dan Masuk
- Buka https://santrionline.pages.dev/daftar
- Buat akun baru
- Coba login dengan akun yang baru dibuat

### Kontak untuk Bantuan Lebih Lanjut
Jika masalah masih berlanjut, hubungi administrator database atau Cloudflare untuk dukungan lebih lanjut.

## Catatan Penting tentang Migrasi Database

Saat membuat migrasi database baru, perhatikan hal-hal berikut:

1. **Hindari Duplikasi**: Pastikan Anda tidak mencoba menambahkan kolom atau tabel yang sudah ada dalam database.

2. **Cek Migrasi Sebelumnya**: Sebelum membuat migrasi baru, periksa file-file migrasi sebelumnya untuk memahami skema tabel yang sudah ada.

3. **Gunakan Statement Kondisional**: Gunakan statement SQL seperti `IF NOT EXISTS` atau `CREATE INDEX IF NOT EXISTS` untuk menghindari error duplikasi.

4. **Pengujian Lokal**: Uji migrasi database secara lokal terlebih dahulu sebelum menerapkannya ke lingkungan produksi.

5. **Solusi Masalah Duplikasi**: Jika terjadi error "duplicate column", berikut langkah penanganannya:
   - Buat file migrasi baru dengan nomor yang lebih tinggi
   - Hapus atau komentari statement yang menyebabkan duplikasi
   - Hapus file migrasi lama yang bermasalah
