# Database Migration Documentation

## Overview
Dokumentasi ini menjelaskan struktur dan penggunaan file-file SQL untuk database SantriOnline yang telah dibersihkan dan dirapikan.

## File Struktur

### 1. Migration Files

#### `migrations/0000_rich_bullseye.sql`
- **Deskripsi**: Migration awal untuk membuat tabel-tabel dasar
- **Tabel yang dibuat**: 
  - `user` - Tabel pengguna utama
  - `quran_surah` - Tabel daftar surah Al-Quran
  - `user_hafalan_quran` - Tracking hafalan per user
  - Dan tabel-tabel lainnya

#### `migrations/0003_quran_surahs_seed.sql`
- **Deskripsi**: Seed data untuk 114 surah Al-Quran
- **Format**: Rapi dengan header dan footer yang jelas
- **Data**: Lengkap semua surah dengan nama dan jumlah ayat

#### `migrations/0004_biolink_features.sql`
- **Deskripsi**: Menambahkan fitur biolink untuk pengguna
- **Fitur baru**:
  - Kolom biolink di tabel `user`
  - Tabel `user_social_links`
  - Tabel `biolink_analytics`
  - Index untuk optimasi performa

### 2. Setup Files

#### `manual-setup.sql`
- **Deskripsi**: Setup lengkap database dari nol
- **Fitur**:
  - Drop dan recreate semua tabel
  - Insert semua data surah
  - Demo user untuk testing
  - Verification queries
  - Dokumentasi lengkap dalam file

#### `setup-database.bat`
- **Deskripsi**: Script Windows untuk setup otomatis
- **Proses**:
  1. Persiapan direktori
  2. Setup database tables
  3. Verifikasi setup
  4. Feedback ke user

## Format yang Diterapkan

### 1. Header Standard
```sql
-- =================================================================
-- Migration XXXX: Nama Migration
-- Description: Deskripsi singkat
-- Created: YYYY-MM-DD
-- =================================================================
```

### 2. Section Separator
```sql
-- =================================================================
-- N. Nama Section
-- =================================================================
```

### 3. Footer Standard
```sql
-- =================================================================
-- End Migration XXXX
-- =================================================================
```

### 4. Table Naming Convention
- Menggunakan backticks untuk nama tabel: `table_name`
- Konsisten dengan format Drizzle ORM
- Foreign key constraints yang jelas

### 5. Index Naming Convention
- Format: `idx_table_column`
- Contoh: `idx_user_email`, `idx_social_links_user_id`

## Cara Penggunaan

### Setup Development Database
```bash
# Windows
setup-database.bat

# Manual
npx wrangler d1 execute santrionlinedb --local --file=manual-setup.sql
```

### Verifikasi Setup
```sql
SELECT COUNT(*) as total_surahs FROM quran_surah;
SELECT COUNT(*) as total_users FROM user;
```

### Reset Database
```sql
-- Jalankan manual-setup.sql (sudah include DROP tables)
```

## Best Practices

1. **Konsistensi Format**: Semua file menggunakan format header-body-footer yang sama
2. **Dokumentasi**: Setiap file memiliki komentar yang jelas
3. **Indentasi**: Menggunakan 4 spasi untuk indentasi
4. **Naming**: Nama tabel dan kolom konsisten dengan schema TypeScript
5. **Safety**: Menggunakan `IF NOT EXISTS` dan `OR IGNORE` untuk safe operations

## Error Handling

Jika mengalami error:

1. **Table already exists**: Normal, gunakan `IF NOT EXISTS`
2. **Foreign key constraint**: Pastikan tabel parent sudah ada
3. **Data conflict**: Gunakan `OR IGNORE` untuk insert
4. **Permission error**: Pastikan wrangler sudah login

## Testing

Setelah setup, test dengan:
```bash
npm run dev
# Akses /dashboard/hafalan untuk test quran data
# Akses /daftar untuk test user registration
```

## Maintenance

- Update migration files saat ada perubahan schema
- Regenerate manual-setup.sql jika ada perubahan major
- Test semua migrations di fresh database
- Update dokumentasi ini saat ada perubahan
