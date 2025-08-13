# 🔧 Database Setup Issues & Solutions

## ❌ **Problem**: "no such table: user" Error

### **Root Cause:**
- Cloudflare D1 database `santri-db` belum memiliki tabel yang dibutuhkan
- Aplikasi mencoba mengakses tabel `user` yang belum dibuat
- Auto-setup di kode belum berjalan karena error terjadi sebelum execution

### **Solutions Implemented:**

#### 1. **Enhanced Error Handling** ✅
- Menambahkan try-catch di semua database queries
- Fallback ke raw SQL jika Drizzle ORM gagal
- Auto-recovery untuk missing tables

#### 2. **Auto Database Setup** ✅
- Setup otomatis di `daftar.tsx` untuk membuat tabel `user`
- Setup otomatis di `dashboard.hafalan.tsx` untuk semua tabel diniyah
- Fallback insertion dengan raw SQL

#### 3. **Manual Setup Scripts** ✅
- `create-user-table.bat` - Setup tabel user
- `setup-full-database.bat` - Setup semua tabel
- `setup-diniyah.bat` - Setup tabel diniyah saja

## 🚀 **Quick Fix Steps:**

### **Option 1: Let Auto-Setup Work**
1. Coba akses `/daftar` - akan auto-create tabel user
2. Coba daftar user baru - akan test insert
3. Akses `/dashboard/hafalan` - akan auto-create tabel diniyah

### **Option 2: Manual Setup** 
```bash
# Run any of these scripts:
create-user-table.bat          # Just user table
setup-diniyah.bat             # Just diniyah tables  
setup-full-database.bat       # All tables
```

### **Option 3: Direct Wrangler Commands**
```bash
# Create user table manually
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, password_hash TEXT, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE);"

# Test if it works
wrangler d1 execute santri-db --command="SELECT count(*) FROM user;"
```

## 📋 **Required Tables Status:**

### **Core Tables:**
- ✅ `user` - Users and authentication
- ✅ `quran_surah` - Quran chapters  
- ✅ `user_hafalan_quran` - Quran memorization progress

### **Diniyah Tables:**
- ✅ `diniyah_kitab` - Islamic books
- ✅ `diniyah_pelajaran` - Lessons per book
- ✅ `user_progres_diniyah` - User progress tracking

### **Additional Tables:**
- ⚠️ `user_social_links` - For biolink feature
- ⚠️ `biolink_analytics` - Analytics data
- ⚠️ `dompet_santri` - Digital wallet
- ⚠️ `transaction` - Transaction history

## 🔍 **Testing Database:**

```bash
# Check what tables exist
wrangler d1 execute santri-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Test user table
wrangler d1 execute santri-db --command="SELECT count(*) FROM user;"

# Test diniyah tables
wrangler d1 execute santri-db --command="SELECT count(*) FROM diniyah_kitab;"
```

## 🎯 **Next Steps:**

1. **Test `/daftar` page** - Should auto-create user table
2. **Create a test account** - Verify insert works
3. **Test `/dashboard/hafalan`** - Should auto-create diniyah tables
4. **Monitor console logs** - Check for any remaining errors

---

**Database**: `santri-db` (ID: `43dd7a31-faaa-42c9-ad14-7ff2d1f96811`)  
**Status**: ⚡ Setup scripts ready, auto-setup implemented  
**Last Updated**: Aug 4, 2025
