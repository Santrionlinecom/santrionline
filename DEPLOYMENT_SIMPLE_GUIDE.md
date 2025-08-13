# DEPLOYMENT GUIDE - SANTRI ONLINE

Sekarang hanya ada 2 script deployment yang tersedia:

## 🏠 LOCALHOST DEVELOPMENT
**File:** `deploy-localhost.bat`
**Gunakan untuk:** Development dan testing lokal

**Cara menggunakan:**
```cmd
deploy-localhost.bat
```

**Yang dilakukan script ini:**
1. Mengecek dan install dependencies jika diperlukan
2. Build aplikasi untuk development
3. Menjalankan development server di http://localhost:3000

---

## 🌐 PRODUCTION DEPLOYMENT  
**File:** `deploy-main-only.bat`
**Gunakan untuk:** Deploy ke production (santrionline.com)

**Cara menggunakan:**
```cmd
deploy-main-only.bat
```

**Yang dilakukan script ini:**
1. Mengecek perubahan git yang belum di-commit
2. Build aplikasi untuk production
3. Deploy ke Cloudflare Pages (domain utama saja)
4. Hanya deploy ke https://santrionline.com

---

## 📝 CATATAN PENTING

- **Localhost**: Gunakan `deploy-localhost.bat` untuk development
- **Production**: Gunakan `deploy-main-only.bat` untuk deploy live
- Semua script deploy lainnya sudah dihapus untuk menyederhanakan workflow
- Hanya domain utama santrionline.com yang aktif, subdomain sudah dinonaktifkan

---

**Terakhir diupdate:** 8 Agustus 2025
