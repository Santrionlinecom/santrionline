# Firebase Authentication Setup untuk Login Google

Panduan ini membantu Anda mengaktifkan tombol **Masuk/Daftar dengan Google (Firebase)** tanpa perlu mengonfigurasi manual OAuth Client di Google Cloud Console. Firebase menangani integrasi Google Sign-In di sisi front-end, sementara aplikasi SantriOnline memverifikasi token Firebase untuk membuat atau memperbarui akun pengguna di D1.

## 1. Buat dan Konfigurasi Proyek Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/) lalu buat proyek baru atau pilih proyek yang sudah ada.
2. Buka menu **Authentication → Sign-in method** dan aktifkan penyedia **Google**.
   - Pastikan Anda melengkapi informasi email support dan domain yang diizinkan jika diminta.
3. Di halaman yang sama, tambahkan domain berikut ke daftar _Authorized domains_:
   - `localhost`
   - `127.0.0.1`
   - Domain produksi Anda, misal `santrionline.com`
4. Masih di Firebase Console, buka menu **Project settings → General → Your apps** dan buat aplikasi web baru jika belum ada.
   - Catat konfigurasi Firebase yang ditampilkan (`apiKey`, `authDomain`, `projectId`, dan `appId`).

> **Catatan:** Firebase secara otomatis membuat OAuth Client di Google Cloud yang diperlukan untuk Google Sign-In, sehingga Anda tidak perlu mengatur konsen screen secara manual.

## 2. Isi Variabel Lingkungan

Tambahkan nilai konfigurasi Firebase Anda ke file environment:

- `.env` atau `.env.production`
- `.env.new` (template untuk developer baru)
- `env-vars-for-cloudflare.txt`
- Variabel Secrets di Cloudflare Dashboard (`wrangler secret put` atau UI)

Variabel yang dibutuhkan:

```
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_APP_ID=1:1234567890:web:abcdef123456
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
```

> **Tips:** `FIREBASE_API_KEY` bukan informasi rahasia, tetapi tetap simpan di environment agar konsisten dengan konfigurasi lain.
> Field tambahan seperti `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_MEASUREMENT_ID`, dan `FIREBASE_STORAGE_BUCKET`
> membantu menjaga konfigurasi web Firebase tetap sinkron dengan Firebase Console sehingga popup login
> menggunakan kredensial yang sama persis.

## 3. Deploy & Sinkronisasi

1. Commit perubahan konfigurasi Anda dan deploy ulang worker Remix.
2. Jika menggunakan Cloudflare Pages, jalankan kembali build untuk memastikan variabel tersuntik.
3. Tidak ada migrasi database tambahan yang diperlukan; skema pengguna sudah mendukung penyimpanan akun Firebase di kolom `google_id`.

## 4. Uji Coba

1. Buka `/masuk` atau `/daftar`.
2. Pastikan muncul tombol **Masuk/Daftar dengan Google (Firebase)**.
3. Klik tombol tersebut dan selesaikan proses login popup dari Firebase.
4. Setelah berhasil, Anda akan diarahkan ke dashboard (atau halaman `redirectTo` jika diberikan) dengan sesi pengguna yang sudah terbuat.

Jika login gagal, pastikan:

- Domain aplikasi sudah terdaftar di Firebase Authentication → Authorized domains.
- Token Firebase belum kedaluwarsa (token hanya berlaku selama ~1 jam).
- Variabel lingkungan di worker sudah di-_redeploy_ dan dapat dibaca (cek log Cloudflare).

## 5. Pertanyaan Umum

### Apakah saya masih perlu Google OAuth manual?

Tidak. Anda bisa menonaktifkan atau mengabaikan tombol Google OAuth standar (yang menggunakan `/auth/google`) dengan tidak mengisi `GOOGLE_CLIENT_ID/SECRET`. Tombol tersebut otomatis disembunyikan ketika kredensial tidak tersedia.

### Bisakah saya menggunakan kedua metode sekaligus?

Ya. Jika variabel Google OAuth **dan** Firebase terisi, halaman login akan menampilkan kedua tombol sehingga Anda bebas memilih metode yang paling nyaman.

### Di mana data pengguna disimpan?

Pengguna yang login melalui Firebase tetap disimpan di database D1 aplikasi ini. Firebase hanya menyediakan proses autentikasi, sementara data profil, dompet, dan role pengguna tetap berada di D1 sesuai dengan logika aplikasi.

---

Dengan mengikuti langkah di atas, Anda dapat menggunakan Firebase Authentication untuk Google Sign-In tanpa harus mengelola konsen screen Google Cloud secara manual.
