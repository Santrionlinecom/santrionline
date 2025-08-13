# 🌐 STRUKTUR SISTEM SANTRIONLINE.COM - DOKUMENTASI LENGKAP

**Domain:** santrionline.com  
**Platform:** Remix + React + TypeScript + Cloudflare  
**Database:** Cloudflare D1 (inti-santri)  
**CDN:** Cloudflare Pages

---

## 📁 **STRUKTUR ROUTING LENGKAP**

### 🏠 **HALAMAN UTAMA (PUBLIC)**

```
🌐 santrionline.com/
├── /                           → Landing Page (_index.tsx)
├── /masuk                      → Halaman Login (masuk.tsx)
├── /daftar                     → Halaman Registrasi (daftar.tsx)
├── /keluar                     → Logout Handler (keluar.tsx)
├── /faq                        → FAQ / Bantuan (faq.tsx)
├── /fitur-lengkap             → Daftar Fitur Lengkap (fitur-lengkap.tsx)
├── /demo-biolink              → Demo Biolink (demo-biolink.tsx)
├── /biografi-ulama            → Biografi Ulama Public (biografi-ulama.tsx)
├── /biografi-ulama/[id]       → Detail Ulama (biografi-ulama.$id.tsx)
├── /komunitas                 → Komunitas Public (komunitas.tsx)
├── /komunitas/[id]            → Detail Post Komunitas (komunitas.$postId.tsx)
├── /marketplace               → Marketplace Public (marketplace.tsx)
├── /marketplace/[id]          → Detail Karya (marketplace.$karyaId.tsx)
├── /tutorial                  → Tutorial Lengkap (tutorial.tsx)
├── /kontak                    → Kontak Kami (kontak.tsx)
├── /kajian                    → Kajian Islam (kajian.tsx)
├── /tentang                   → Tentang Kami (tentang.tsx)
└── /[username]                → Biolink Profile ($username.tsx)
```

### 🏫 **DASHBOARD SANTRI (AUTHENTICATED)**

```
🔐 santrionline.com/dashboard/
├── /dashboard                 → Dashboard Utama (dashboard._index.tsx)
├── /dashboard/hafalan         → Hafalan Al-Quran (dashboard.hafalan.tsx)
├── /dashboard/diniyah         → Diniyah/Kitab Kuning (dashboard.diniyah.tsx)
├── /dashboard/karyaku         → Kelola Karya (dashboard.karyaku.tsx)
├── /dashboard/karyaku/tulis   → Tulis Karya Baru (dashboard.karyaku.tulis.tsx)
├── /dashboard/komunitas       → Komunitas Dashboard (dashboard.komunitas.tsx)
├── /dashboard/komunitas/buat-post → Buat Post Baru (dashboard.komunitas.buat-post.tsx)
├── /dashboard/dompet          → Dompet Digital (dashboard.dompet.tsx)
├── /dashboard/topup/manual    → Top Up Manual (dashboard.topup.manual.tsx)
├── /dashboard/sertifikat      → Sertifikat/Ijazah (dashboard.sertifikat.tsx)
├── /dashboard/biolink         → Biolink Analytics (dashboard.biolink.tsx)
├── /dashboard/profil          → Profil Pribadi (dashboard.profil.tsx)
├── /dashboard/pengaturan      → Pengaturan Akun (dashboard.pengaturan.tsx)
└── /dashboard/ulama           → Database Ulama (dashboard.ulama.tsx)
```

### 👨‍💼 **ADMIN PANEL (ADMIN ONLY)**

```
🛡️ santrionline.com/admin/
├── /admin/sertifikat          → Kelola Sertifikat (admin.sertifikat.tsx)
├── /admin/karya-audit         → Audit Karya (admin.karya-audit.tsx)
├── /dashboard/admin/pengguna  → Kelola Pengguna (dashboard.admin.pengguna.tsx)
└── /dashboard/admin/akademik  → Kelola Akademik (dashboard.admin.akademik.tsx)
```

### 🔌 **API ENDPOINTS**

```
📡 santrionline.com/api/
├── /api/hafalan/stream        → Hafalan Progress Stream (api.hafalan.stream.tsx)
├── /api/community/posts       → Community Posts API (api.community.posts.tsx)
├── /api/community/likes       → Like/Unlike Posts (api.community.likes.tsx)
├── /api/community/comments    → Comments Management (api.community.comments.tsx)
├── /api/karya                 → Karya Management API (api.karya.tsx)
├── /api/purchase              → Purchase Handler (api.purchase.tsx)
└── /api/biolink-analytics     → Biolink Analytics API (api.biolink-analytics.tsx)
```

---

## 🗂️ **SISTEM FITUR BERDASARKAN MODUL**

### 📖 **MODUL PEMBELAJARAN**

| Link                  | File TSX                 | Deskripsi                  |
| --------------------- | ------------------------ | -------------------------- |
| `/dashboard/hafalan`  | `dashboard.hafalan.tsx`  | Hafalan Al-Quran 114 Surat |
| `/dashboard/diniyah`  | `dashboard.diniyah.tsx`  | Kitab Diniyah/Fiqih        |
| `/api/hafalan/stream` | `api.hafalan.stream.tsx` | Hafalan Progress API       |

### 🎨 **MODUL MARKETPLACE**

| Link                       | File TSX                      | Deskripsi            |
| -------------------------- | ----------------------------- | -------------------- |
| `/marketplace`             | `marketplace.tsx`             | Marketplace Public   |
| `/marketplace/[id]`        | `marketplace.$karyaId.tsx`    | Detail Karya         |
| `/dashboard/karyaku`       | `dashboard.karyaku.tsx`       | Kelola Karya Santri  |
| `/dashboard/karyaku/tulis` | `dashboard.karyaku.tulis.tsx` | Tulis Karya Baru     |
| `/api/karya`               | `api.karya.tsx`               | Karya Management API |
| `/api/purchase`            | `api.purchase.tsx`            | Pembelian Karya      |
| `/admin/karya-audit`       | `admin.karya-audit.tsx`       | Audit Karya Admin    |

### 👥 **MODUL KOMUNITAS**

| Link                             | File TSX                            | Deskripsi            |
| -------------------------------- | ----------------------------------- | -------------------- |
| `/komunitas`                     | `komunitas.tsx`                     | Komunitas Public     |
| `/komunitas/[id]`                | `komunitas.$postId.tsx`             | Detail Post          |
| `/dashboard/komunitas`           | `dashboard.komunitas.tsx`           | Dashboard Komunitas  |
| `/dashboard/komunitas/buat-post` | `dashboard.komunitas.buat-post.tsx` | Buat Post Baru       |
| `/api/community/posts`           | `api.community.posts.tsx`           | Posts Management API |
| `/api/community/likes`           | `api.community.likes.tsx`           | Like/Unlike API      |
| `/api/community/comments`        | `api.community.comments.tsx`        | Comments API         |

### 💰 **MODUL KEUANGAN**

| Link                      | File TSX                     | Deskripsi                        |
| ------------------------- | ---------------------------- | -------------------------------- |
| `/dashboard/dompet`       | `dashboard.dompet.tsx`       | Dompet Digital (DinCoin/DirCoin) |
| `/dashboard/topup/manual` | `dashboard.topup.manual.tsx` | Top Up Manual                    |

### 🎓 **MODUL SERTIFIKAT**

| Link                    | File TSX                   | Deskripsi               |
| ----------------------- | -------------------------- | ----------------------- |
| `/dashboard/sertifikat` | `dashboard.sertifikat.tsx` | Sertifikat Santri       |
| `/admin/sertifikat`     | `admin.sertifikat.tsx`     | Kelola Sertifikat Admin |

### 📚 **MODUL ULAMA**

| Link                   | File TSX                 | Deskripsi              |
| ---------------------- | ------------------------ | ---------------------- |
| `/biografi-ulama`      | `biografi-ulama.tsx`     | Database Ulama Public  |
| `/biografi-ulama/[id]` | `biografi-ulama.$id.tsx` | Detail Ulama           |
| `/dashboard/ulama`     | `dashboard.ulama.tsx`    | Kelola Ulama Dashboard |

### 🔗 **MODUL BIOLINK**

| Link                     | File TSX                    | Deskripsi              |
| ------------------------ | --------------------------- | ---------------------- |
| `/[username]`            | `$username.tsx`             | Biolink Profile Public |
| `/dashboard/biolink`     | `dashboard.biolink.tsx`     | Biolink Analytics      |
| `/demo-biolink`          | `demo-biolink.tsx`          | Demo Biolink           |
| `/api/biolink-analytics` | `api.biolink-analytics.tsx` | Analytics API          |

### ⚙️ **MODUL MANAJEMEN**

| Link                        | File TSX                       | Deskripsi       |
| --------------------------- | ------------------------------ | --------------- |
| `/dashboard/profil`         | `dashboard.profil.tsx`         | Profil Pribadi  |
| `/dashboard/pengaturan`     | `dashboard.pengaturan.tsx`     | Pengaturan Akun |
| `/dashboard/admin/pengguna` | `dashboard.admin.pengguna.tsx` | Kelola Pengguna |
| `/dashboard/admin/akademik` | `dashboard.admin.akademik.tsx` | Kelola Akademik |

---

## 🔐 **SISTEM AUTENTIKASI & OTORISASI**

### **Public Access (Tanpa Login)**

- Landing Page `/`
- Biografi Ulama `/biografi-ulama`
- Komunitas Read-Only `/komunitas`
- Marketplace Browse `/marketplace`
- Biolink Profiles `/[username]`
- FAQ `/faq`

### **Authenticated Users (Santri)**

- Dashboard Lengkap `/dashboard/*`
- Hafalan Management
- Komunitas Interaksi
- Marketplace Upload
- Biolink Personal

### **Admin Only**

- Admin Panel `/admin/*`
- User Management
- Content Moderation
- System Configuration

---

## 📊 **DATABASE STRUKTUR**

### **Core Tables**

- `pengguna` → User Management
- `dompet_santri` → Digital Wallet
- `user_social_links` → Biolink Data

### **Pembelajaran Tables**

- `quran_surah` → 114 Surat Al-Quran
- `user_hafalan_quran` → Hafalan Progress
- `diniyah_kitab` → Kitab Diniyah
- `diniyah_pelajaran` → Pelajaran/Bab
- `user_progres_diniyah` → Progress Diniyah

### **Content Tables**

- `karya` → Marketplace Content
- `community_post` → Forum Posts
- `post_comment` → Comments
- `ulama` → Biografi Database
- `ulama_category` → Kategori Ulama

### **Transaction Tables**

- `transactions` → Financial Records
- `orders` → Purchase Orders
- `biolink_analytics` → Analytics Data

---

## 🚀 **TEKNOLOGI STACK**

### **Frontend**

- **Framework:** Remix + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **Charts:** Recharts

### **Backend**

- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Session:** Cloudflare KV

### **Deployment**

- **Hosting:** Cloudflare Pages
- **CDN:** Cloudflare Global Network
- **Domain:** santrionline.com
- **SSL:** Cloudflare SSL

---

## 📱 **RESPONSIVE DESIGN**

### **Desktop Navigation**

- Sidebar Dashboard
- Full Feature Access
- Admin Panel

### **Mobile Navigation**

- Bottom Navigation Bar (5 buttons)
- Compressed Dashboard
- Touch-Optimized UI

---

## 🔄 **ALUR SISTEM UTAMA**

### **New User Journey**

1. Landing Page `/`
2. Register `/register`
3. Dashboard `/dashboard`
4. Setup Profile `/dashboard/profil`
5. Start Learning `/dashboard/hafalan`

### **Learning Flow**

1. Hafalan Progress `/dashboard/hafalan`
2. Diniyah Study `/dashboard/diniyah`
3. Certificate Generation `/dashboard/sertifikat`

### **Content Creation Flow**

1. Create Post `/dashboard/komunitas/buat-post`
2. Upload Karya `/dashboard/karyaku/tulis`
3. Manage Content `/dashboard/karyaku`

### **Monetization Flow**

1. Top Up Wallet `/dashboard/topup/manual`
2. Purchase Content `/marketplace/[id]`
3. Sell Content `/dashboard/karyaku`

---

## ⚡ **API INTEGRATION**

### **Real-time Features**

- Hafalan Progress Streaming
- Community Live Updates
- Biolink Analytics Tracking

### **External Services**

- Payment Gateway Integration
- Email Notifications
- Analytics Dashboard

---

**📝 Catatan:** Dokumentasi ini mencakup seluruh struktur sistem SantriOnline.com yang dapat diakses melalui domain Cloudflare. Setiap file TSX memiliki routing yang spesifik dan fungsi yang terdefinisi dengan jelas dalam ekosistem pembelajaran Islam digital.

**🔄 Update:** August 11, 2025 - Sistem telah terintegrasi penuh dengan database "inti-santri" dan semua fitur utama telah berfungsi optimal.
