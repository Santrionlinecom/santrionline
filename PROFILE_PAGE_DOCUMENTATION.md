# Halaman Profil Santri Online

## Overview
Halaman profil (`/dashboard/profil`) adalah halaman untuk mengelola informasi pribadi dan melihat statistik pembelajaran santri.

## Fitur Utama

### 1. **Informasi Profil**
- Avatar pengguna dengan opsi upload
- Nama lengkap dan email
- Level santri berdasarkan progress hafalan
- Persentase kelengkapan profil

### 2. **Statistik Pembelajaran**
- Jumlah surat yang telah dihafal
- Nilai rata-rata hafalan dan ujian
- Total koin (DinCoin + DirCoin) yang dimiliki

### 3. **Informasi Akun**
- Status role (Santri/Administrator)
- Tanggal bergabung
- Terakhir update profil

### 4. **Form Edit Profil**
Terdiri dari 3 bagian:

#### Data Dasar
- Nama lengkap (wajib)
- Email (wajib)
- Nomor telepon
- Tanggal lahir
- Alamat

#### Latar Belakang Pendidikan
- Tingkat pendidikan (SD/SMP/SMA/D3/S1/S2/S3)
- Institusi/sekolah

#### Tentang Saya
- Bio/deskripsi diri

## Level Santri
Sistem level otomatis berdasarkan progress hafalan:

- **Pemula**: Belum menghafal surat
- **Mubtadi**: 1+ surat selesai dihafal
- **Muntaliq**: 5+ surat selesai dihafal
- **Mutqin**: 10+ surat selesai dihafal
- **Hafidz/Hafidzah**: 30 surat selesai dihafal

## Database Migration
Untuk mendukung halaman profil, perlu menambahkan field baru ke tabel `user`:

```sql
ALTER TABLE user ADD COLUMN phone TEXT;
ALTER TABLE user ADD COLUMN address TEXT;
ALTER TABLE user ADD COLUMN date_of_birth TEXT;
ALTER TABLE user ADD COLUMN education TEXT;
ALTER TABLE user ADD COLUMN institution TEXT;
ALTER TABLE user ADD COLUMN updated_at INTEGER;
```

Jalankan migration dengan: `run-profile-migration.bat`

## Komponen UI Baru
- `Separator`: Untuk pemisah visual antar section
- Animasi dengan Framer Motion untuk smooth transitions

## Security & Validation
- Validasi input wajib (nama dan email)
- Sanitasi data sebelum disimpan ke database
- Protection dengan `requireUserId` middleware

## Usage
1. User mengakses `/dashboard/profil`
2. Melihat informasi profil dan statistik
3. Klik "Edit Profil" untuk mengubah data
4. Isi form dan klik "Simpan Perubahan"
5. Data tersimpan dan halaman di-refresh

## Integration
- Terintegrasi dengan sistem hafalan untuk statistik
- Terintegrasi dengan dompet untuk total koin
- Data profil dapat digunakan untuk biolink dan sertifikat
