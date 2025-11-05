# Android Keystore Setup for Santri Online

Untuk menandatangani aplikasi Android secara lokal, buat berkas keystore baru menggunakan `keytool` dari Java Development Kit (JDK).

## Langkah Cepat

Jalankan perintah berikut di terminal:

```bash
keytool -genkey -v -keystore santrionline.keystore \
  -alias santrionline -keyalg RSA -keysize 2048 -validity 10000
```

### Penjelasan Parameter

- `-genkey` – menghasilkan pasangan kunci baru dan menyimpannya dalam keystore.
- `-v` – menampilkan output yang lebih detail selama proses pembuatan.
- `-keystore santrionline.keystore` – nama berkas keystore yang akan dibuat.
- `-alias santrionline` – alias yang digunakan untuk mengidentifikasi entri kunci.
- `-keyalg RSA` – algoritma yang digunakan untuk menghasilkan kunci.
- `-keysize 2048` – panjang kunci RSA (disarankan minimal 2048 bit).
- `-validity 10000` – masa berlaku sertifikat dalam hari (sekitar 27 tahun).

## Setelah Menjalankan Perintah

1. Anda akan diminta mengatur kata sandi keystore dan memasukkan informasi identitas (nama, organisasi, dsb.).
2. Simpan berkas `santrionline.keystore` di lokasi aman dan jangan commit ke repository.
3. Catat kata sandi keystore serta alias untuk digunakan saat menandatangani aplikasi Android (misalnya lewat Gradle atau `jarsigner`).

> **Catatan:** Pastikan `keytool` tersedia pada PATH Anda. Jika Anda menggunakan OpenJDK atau Oracle JDK, utilitas ini sudah termasuk.
