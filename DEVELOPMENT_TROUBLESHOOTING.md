# 🔧 TROUBLESHOOTING GUIDE - Development Server Issues

## ❌ Error yang Anda alami:
```
[vite] server connection lost. Polling for restart...
WebSocket connection to 'ws://localhost:5174/' failed
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## 🎯 Penyebab Umum:
1. **Development server tidak berjalan**
2. **Port 5174 sedang digunakan oleh proses lain**
3. **Cache browser/development tools bermasalah**
4. **Proses Node.js yang menggantung**

## ✅ Solusi Step-by-Step:

### 1. 🚀 Restart Development Server
```bash
# Metode 1: Menggunakan script otomatis
start-dev-server.bat

# Metode 2: Manual
cd c:\Users\DELL\santrionline
npm run dev
```

### 2. 🛑 Kill Proses yang Menggantung
```bash
# Check proses yang menggunakan port 5174
netstat -ano | findstr :5174

# Kill proses berdasarkan PID
taskkill /PID [PID_NUMBER] /F
```

### 3. 🧹 Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules jika perlu
rm -rf node_modules
npm install
```

### 4. 🌐 Clear Browser Cache
- **Chrome**: Ctrl+Shift+R (hard refresh)
- **Firefox**: Ctrl+F5
- Atau buka Developer Tools → Network tab → "Disable cache"

### 5. 🔍 Check Dependencies
```bash
# Verifikasi semua dependencies
npm install

# Check untuk error
npm run typecheck
```

## 🚀 Quick Fix Command:
```bash
# All-in-one solution
cd c:\Users\DELL\santrionline && taskkill /IM node.exe /F & timeout /t 2 & npm run dev
```

## 🎯 Setelah Server Berjalan:
- ✅ Akses: `http://localhost:5174`
- ✅ Profil page: `http://localhost:5174/dashboard/profil`
- ✅ Console harus bersih dari error

## 📱 Test Halaman Profil:
1. Login ke dashboard
2. Klik dropdown profil di header
3. Pilih "Profil" 
4. Atau akses langsung: `/dashboard/profil`

## 🆘 Jika Masih Error:
1. Check log di terminal untuk error details
2. Pastikan database sudah disetup
3. Verifikasi semua file komponen UI ada
4. Restart VS Code dan terminal

## ⚡ Prevention Tips:
- Selalu gunakan `Ctrl+C` untuk stop server dengan proper
- Jangan close terminal tanpa stop server
- Regular restart development server jika performance menurun
