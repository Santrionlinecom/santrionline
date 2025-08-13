# 📜 Fitur Sertifikat & Raport - Santri Online

## Overview
Fitur sertifikat dan raport memungkinkan santri untuk mendapatkan pengakuan resmi atas pencapaian hafalan Al-Qur'an dan pembelajaran kitab-kitab Islam. Setiap sertifikat dilengkapi dengan raport progress yang mendetail.

## 🎯 Fitur Utama

### 1. **Sertifikat Digital & Fisik**
- ✅ Halaman depan: Sertifikat dengan nama, tanda tangan, dan stempel
- ✅ Halaman belakang: Raport progress dengan detail hafalan dan kitab
- ✅ Format PDF ukuran A4 siap cetak
- ✅ QR Code untuk verifikasi digital
- ✅ Download hanya setelah disetujui admin

### 2. **Sistem Persetujuan Admin**
- ✅ Admin dapat melihat semua pengajuan sertifikat
- ✅ Proses approve/reject dengan alasan
- ✅ Dashboard khusus untuk admin
- ✅ Tracking status real-time

### 3. **Progress Tracking**
- ✅ Pencatatan hafalan per juz dengan nilai
- ✅ Tracking pembelajaran kitab-kitab
- ✅ Visualisasi progress menuju milestone
- ✅ Riwayat pencapaian lengkap

## 📁 Struktur File

```
app/
├── routes/
│   ├── sertifikat.tsx                 # Halaman utama sertifikat
│   ├── dashboard.sertifikat.tsx       # Dashboard santri
│   └── admin.sertifikat.tsx           # Dashboard admin
├── utils/
│   └── certificate-generator.ts       # Generator PDF
└── styles/
    └── certificate-print.css          # CSS print
```

## 🗄️ Database Schema

### Tables Created:
1. **certificates** - Data sertifikat
2. **achievements** - Pencapaian hafalan/kitab
3. **completed_books** - Kitab yang diselesaikan
4. **certificate_downloads** - Riwayat download
5. **santri_summary** - View summary data

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install jspdf html2canvas
npm install --save-dev @types/html2canvas
```

### 2. Setup Database
```bash
# Jalankan script setup database
setup-certificate-db.bat
```

### 3. Configure Routes
Routes sudah dibuat dan siap digunakan:
- `/sertifikat` - Halaman publik sertifikat
- `/dashboard/sertifikat` - Dashboard santri
- `/admin/sertifikat` - Panel admin

## 📋 Jenis Sertifikat

### 1. **Sertifikat 1 Juz**
- Minimal hafalan: 1 juz lengkap
- Nilai minimal: 80
- Syarat: Konsistensi muroja'ah 30 hari

### 2. **Sertifikat 5 Juz**
- Minimal hafalan: 5 juz lengkap
- Nilai minimal: 85
- Syarat: Ujian komprehensif

### 3. **Sertifikat 10 Juz**
- Minimal hafalan: 10 juz lengkap
- Nilai minimal: 90
- Syarat: Kemampuan qira'ah dengan berbagai metode

### 4. **Sertifikat Hafidz/Hafidzah**
- Minimal hafalan: 30 juz (full Qur'an)
- Nilai minimal: 95
- Syarat: Ijazah sanad dari mentor

## 🔄 Workflow Proses

### Untuk Santri:
1. **Belajar & Hafalan** → Sistem mencatat progress
2. **Cek Kelayakan** → Dashboard menampilkan status
3. **Ajukan Sertifikat** → Request dikirim ke admin
4. **Menunggu Approval** → Admin review & verifikasi
5. **Download Sertifikat** → Setelah disetujui

### Untuk Admin:
1. **Review Pengajuan** → Cek data hafalan & nilai
2. **Verifikasi Progress** → Validasi pencapaian
3. **Approve/Reject** → Keputusan dengan alasan
4. **Monitor Statistics** → Dashboard overview

## 📊 Data Structure

### SantriData Interface:
```typescript
interface SantriData {
  name: string;
  nisn: string;
  totalJuz: number;
  completedBooks: string[];
  achievements: Achievement[];
  totalScore: number;
  isApprovedByAdmin: boolean;
  certificateId: string;
  approvedDate: string;
  approvedBy: string;
}
```

### Achievement Interface:
```typescript
interface Achievement {
  type: 'Hafalan' | 'Kitab';
  target: string;
  completedDate: string;
  score: number;
}
```

## 🎨 Design Features

### Sertifikat (Halaman Depan):
- ✅ Header dengan logo Santri Online
- ✅ Judul besar "SERTIFIKAT HAFALAN AL-QUR'AN"
- ✅ Nama santri dengan underline
- ✅ NISN dan detail pencapaian
- ✅ Tanda tangan digital dengan nama penanda tangan
- ✅ QR Code dengan ID sertifikat

### Raport (Halaman Belakang):
- ✅ Data santri lengkap
- ✅ Daftar kitab yang diselesaikan
- ✅ Timeline pencapaian per juz/kitab
- ✅ Nilai dan tanggal completion
- ✅ Footer dengan timestamp dan verifikasi

## 🔒 Security Features

1. **Verifikasi Admin** - Hanya admin yang bisa approve
2. **QR Code Validation** - Setiap sertifikat memiliki ID unik
3. **Download Tracking** - Log semua aktivitas download
4. **Digital Signature** - Nama dan tanggal penanda tangan
5. **Watermark** - Gradien background untuk anti-pemalsuan

## 📱 Responsive Design

- ✅ Mobile-friendly interface
- ✅ Print-optimized CSS
- ✅ A4 size PDF output
- ✅ High-quality canvas rendering

## 🚀 Future Enhancements

### Phase 2:
- [ ] Email notification saat sertifikat disetujui
- [ ] Bulk certificate generation
- [ ] Advanced QR code dengan blockchain verification
- [ ] Integration dengan sistem rapor sekolah
- [ ] Export data untuk akreditasi

### Phase 3:
- [ ] Mobile app untuk scan QR code
- [ ] AI-powered assessment
- [ ] Gamification dengan badges
- [ ] Social sharing features

## 🧪 Testing

### Test Cases:
1. **Generate PDF** - Pastikan format A4 correct
2. **Admin Approval** - Test approve/reject flow
3. **Download Security** - Hanya approved yang bisa download
4. **Progress Tracking** - Validate calculation accuracy
5. **Database Integrity** - Test foreign key constraints

### Test Data Available:
- Sample santri dengan 5 juz hafalan
- Mock achievements dan completed books
- Admin approval workflow

## 📞 Support

Jika ada masalah dengan fitur sertifikat:
1. Cek console browser untuk error
2. Validasi database connection
3. Pastikan dependencies terinstall
4. Hubungi admin sistem

## 📝 Changelog

### v1.0.0 (August 2024)
- ✅ Initial release
- ✅ Basic PDF generation
- ✅ Admin approval system
- ✅ Progress tracking
- ✅ Responsive design

---

**🎓 Santri Online Certificate System - Memberdayakan Pendidikan Islam Digital**
