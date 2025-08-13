# Testing Guide - Fitur Karya

## ✅ PERBAIKAN YANG SUDAH DILAKUKAN:

### 1. **Form Integration** 
- ✅ Sidebar form fields (kategori, tags, SEO) sudah terintegrasi dengan main form
- ✅ Hidden fields mengirim data dari sidebar ke main form
- ✅ Pricing options (gratis/berbayar) berfungsi dengan benar

### 2. **Navigasi Tombol**
- ✅ Tombol "Tulis Karya Baru" → Link ke `/dashboard/karyaku/tulis`
- ✅ Tombol "Tulis Karya Pertama" → Link ke `/dashboard/karyaku/tulis`
- ✅ Tidak lagi menggunakan onClick handler yang bermasalah

### 3. **Marketplace Integration**
- ✅ Hanya menampilkan karya dengan status 'published'
- ✅ Menampilkan statistics yang akurat
- ✅ Karya bisa diklik untuk melihat detail
- ✅ Support untuk featured image dan kategori

### 4. **Database Schema**
- ✅ Tabel karya sudah enhanced dengan semua field yang diperlukan
- ✅ Support untuk slug, SEO, categories, tags, pricing

## 🚀 CARA TESTING:

### 1. **Setup Database**
```bash
cd c:\Users\DELL\santrionline
setup-karya-table.bat
```

### 2. **Start Development Server**
```bash
npm run dev
```

### 3. **Testing Flow**

#### A. Test Form Tulis Karya
1. Buka: `http://localhost:5173/dashboard/karyaku`
2. Klik "Tulis Karya Baru" → Harus redirect ke `/dashboard/karyaku/tulis`
3. Fill form:
   - **Judul**: "Contoh Artikel Islami"
   - **Konten**: Tulis artikel panjang (minimal 100 kata)
   - **Kategori**: Pilih "Artikel Islami" di sidebar
   - **Tags**: "islam,artikel,pendidikan"
   - **Pricing**: Pilih "Gratis"
4. Klik "Publikasikan"
5. Harus redirect ke `/dashboard/karyaku?success=published`

#### B. Test Marketplace
1. Buka: `http://localhost:5174/marketplace`
2. Karya yang baru dipublish harus muncul di daftar
3. Statistics harus update (Total Karya = 1)
4. Klik karya → harus masuk ke halaman detail

#### C. Test Detail Karya
1. Di marketplace, klik salah satu karya
2. Harus redirect ke `/karya/{slug}`
3. Menampilkan konten lengkap
4. View count bertambah setiap akses

## 📋 CHECKLIST TESTING:

### Form Tulis Karya
- [ ] Tombol "Tulis Karya Baru" berfungsi
- [ ] Form bisa diisi lengkap
- [ ] Sidebar fields (kategori, tags, pricing) tersimpan
- [ ] Preview mode berfungsi
- [ ] Word count dan reading time akurat
- [ ] Submit berhasil dan redirect

### Marketplace
- [ ] Hanya karya published yang muncul
- [ ] Statistics akurat
- [ ] Card karya menampilkan info lengkap
- [ ] Featured image muncul jika ada
- [ ] Kategori dan pricing ditampilkan
- [ ] Link ke detail berfungsi

### Detail Karya
- [ ] Konten lengkap ditampilkan
- [ ] Meta info (author, date, views) akurat
- [ ] SEO tags benar
- [ ] View count bertambah
- [ ] Related karya muncul (jika ada)

## 🐛 TROUBLESHOOTING:

### Jika Form Tidak Submit:
1. Check browser console untuk error
2. Pastikan semua required fields terisi
3. Check network tab untuk request gagal

### Jika Karya Tidak Muncul di Marketplace:
1. Pastikan status = 'published'
2. Check database: `SELECT * FROM karya WHERE status='published';`
3. Refresh halaman marketplace

### Jika Database Error:
```bash
# Test koneksi database
test-db-connection.bat

# Reset schema jika perlu
setup-karya-enhanced.sql
```

## 📁 FILES YANG DIUBAH:

1. `/app/routes/dashboard.karyaku.tulis.tsx` - Form tulis karya
2. `/app/routes/dashboard.karyaku.tsx` - Navigasi tombol
3. `/app/routes/marketplace.tsx` - Marketplace dengan filter published
4. `/app/routes/karya.$slug.tsx` - Detail karya
5. `/app/routes/api.karya.tsx` - API endpoints
6. `setup-karya-enhanced.sql` - Database schema

## 🎯 EKSPEKTASI HASIL:

1. **User bisa menulis karya baru** dengan form yang lengkap
2. **Karya published muncul di marketplace** dan bisa diakses publik
3. **Detail karya menampilkan konten lengkap** dengan metadata
4. **Database menyimpan semua field** dengan benar
5. **Flow end-to-end berfungsi**: Tulis → Publish → Marketplace → Detail

---

**Status: READY FOR TESTING** ✅
