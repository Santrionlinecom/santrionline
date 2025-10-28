# Panduan Konfigurasi Supabase Auth (Google OAuth)

Integrasi Supabase Auth menggantikan implementasi Google OAuth manual. Ikuti langkah berikut agar alur
`/auth/login → Google → /auth/callback → /dashboard` berjalan lancar baik di lokal maupun produksi.

## 1. Siapkan OAuth Client di Google Cloud

1. Buka [Google Cloud Console](https://console.cloud.google.com/) dan pilih project yang ingin digunakan.
2. Konfigurasikan **OAuth consent screen** lalu publish ke mode produksi.
3. Masuk ke **APIs & Services → Credentials** dan buat **OAuth client ID** bertipe **Web application**.
4. Tambahkan redirect URL berikut:
   - `https://santrionline.com/auth/callback`
   - `https://<domain-preview>/auth/callback` (opsional untuk staging/preview)
   - `http://localhost:8788/auth/callback` (untuk development lokal)
5. Salin **Client ID** dan **Client Secret** yang dihasilkan.

## 2. Aktifkan Provider Google di Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih project Anda.
2. Masuk ke **Authentication → Providers → Google**.
3. Aktifkan provider, kemudian isi `Client ID` dan `Client Secret` dari langkah sebelumnya.
4. Pastikan kolom **Redirect URLs** berisi daftar URL pada langkah 1 (Supabase secara otomatis
   mem-forward ke `/auth/callback` di aplikasi Remix).

## 3. Set Environment Variables

Tambahkan variabel berikut di file `.env` dan di `wrangler.toml` (bagian `[vars]`):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
ADMIN_EMAILS="admin@santrionline.com,founder@santrionline.com"
```

> `ADMIN_EMAILS` dipakai untuk auto-assign role `admin` ketika email pengguna ada pada allowlist.

## 4. Sinkronisasi Database

Schema baru menambahkan tabel `users` di D1. Jalankan perintah berikut setelah memperbarui kode:

```sh
npm run db:push
```

Perintah di atas menggunakan `drizzle-kit push` (driver `d1-http`) sehingga bekerja untuk lokal maupun remote,
selama `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_ID`, dan `CLOUDFLARE_API_TOKEN` telah terisi.

## 5. Uji Lokal

1. Jalankan server dev Remix + Vite:
   ```sh
   npm run dev
   ```
2. Buka `http://localhost:8788/` dan klik tombol **Lanjutkan dengan Google**.
3. Setelah login berhasil, pastikan pengguna diarahkan ke `/dashboard` dan tabel `users` berisi data profil.

## 6. Troubleshooting

- **401 Unauthorized ketika callback**: cek kembali `SUPABASE_URL` dan `SUPABASE_ANON_KEY`, pastikan cocok dengan project Supabase.
- **Email tidak dapat role admin**: pastikan alamat email tercantum pada `ADMIN_EMAILS` (case-insensitive).
- **Data profil tidak tersimpan**: verifikasi bahwa D1 dapat diakses (`npm run deploy:db` atau cek log Worker).
- **Logout tidak membersihkan sesi**: cookie `sb:session` harus muncul di response `/auth/logout`. Jika tidak,
  pastikan Worker memiliki akses menulis header `Set-Cookie` (tidak terblokir oleh middleware lain).

Setelah semua langkah dijalankan, deploy ulang aplikasi (`npm run deploy`) agar perubahan Supabase Auth berlaku di produksi.
