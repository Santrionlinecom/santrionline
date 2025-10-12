# Panduan Konfigurasi Google OAuth

Integrasi Google OAuth memungkinkan pengguna melakukan login/daftar melalui akun Google.
Ikuti langkah berikut agar fitur berfungsi penuh di lingkungan produksi maupun lokal.

> 💡 **Alternatif lebih sederhana:** Jika Anda lebih nyaman menggunakan Firebase Authentication untuk
> menangani Google Sign-In (tanpa mengelola OAuth consent screen secara manual),
> lihat panduan [`FIREBASE_AUTH_SETUP.md`](./FIREBASE_AUTH_SETUP.md). Kedua metode dapat berjalan bersamaan.

## 1. Siapkan Credential di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Pilih atau buat project baru khusus untuk Santri Online.
3. Masuk ke **APIs & Services → OAuth consent screen** dan lengkapi informasi aplikasi.
4. Pada tab **Scopes**, tambahkan scope berikut:
   - `openid`
   - `email`
   - `profile`
5. Simpan dan publish consent screen (untuk production gunakan mode "In Production").
6. Buka **APIs & Services → Credentials** kemudian pilih **Create Credentials → OAuth client ID**.
7. Pilih tipe aplikasi **Web application** dan isikan:
   - **Authorized JavaScript origins**: domain utama aplikasi, misalnya `https://santrionline.com`.
   - **Authorized redirect URIs**: `https://santrionline.com/auth/google/callback`
     (tambahkan domain staging/preview jika ada, mis. `https://dev.santrionline.com/auth/google/callback`).

   > ✅ Jika layar konfigurasi Anda mirip dengan contoh berikut—memuat domain utama pada **Authorized JavaScript origins** dan jalur `/auth/google/callback` pada **Authorized redirect URIs**—berarti pengisian sudah benar. Pastikan tidak ada spasi atau slash tambahan di akhir URL agar Google tidak menolak redirect.

8. Setelah credential dibuat, salin `Client ID` dan `Client Secret`.

## 2. Konfigurasi Environment Variable di Cloudflare

Tambahkan variabel berikut pada konfigurasi Worker/Pages (Wrangler):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Gunakan nilai yang didapat dari langkah sebelumnya. Untuk percobaan lokal, Anda bisa menambahkan
variabel yang sama ke file `.env` atau men-export langsung di shell sebelum menjalankan `npm run dev`.

> Catatan: variabel ini sudah dicantumkan di `env-vars-for-cloudflare.txt` sebagai referensi.

## 3. Jalankan Migrasi D1

Integrasi Google OAuth menambahkan kolom `google_id` pada tabel `user`. Pastikan migrasi sudah dijalankan:

```sh
npx wrangler d1 migrations apply santrionline --remote
```

Ganti `santrionline` dengan nama binding D1 Anda jika berbeda. Untuk lingkungan lokal, jalankan
perintah yang sama tanpa flag `--remote` atau gunakan skrip migrasi yang telah disediakan di repo.

## 4. Deploy Ulang Aplikasi

Setelah environment dan migrasi siap:

1. Build aplikasi: `npm run build`.
2. Deploy Worker/Pages sesuai prosedur yang biasa digunakan.
3. Lakukan uji coba login Google di `https://santrionline.com/masuk` dan `https://santrionline.com/daftar`.

## 5. Troubleshooting Singkat

- **Error 500 "Google OAuth belum dikonfigurasi"**: pastikan kedua environment variable terisi dan
  dapat diakses oleh Worker.
- **Redirect mismatch**: cek kembali URL pada OAuth client di Google Cloud harus persis dengan
  alamat `/auth/google/callback` yang digunakan.
- **Akun tidak dibuat**: periksa log Worker untuk memastikan D1 dapat diakses dan migrasi sudah diterapkan.

Jika membutuhkan scope tambahan (misal Google Classroom) tambahkan di Google Console lalu sesuaikan
parameter `scope` pada `app/routes/auth.google.tsx`.
