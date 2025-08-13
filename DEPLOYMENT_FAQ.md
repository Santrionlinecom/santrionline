# Deployment FAQ Santri Online

## Pertanyaan Umum Seputar Deployment

### Q: Bagaimana cara update website yang sudah terdeploy?
**A:** Ada dua opsi untuk melakukan update website:

1. **Update manual dari komputer lokal:**
   - Buat perubahan pada file-file yang diperlukan
   - Commit perubahan ke git: `git add .` kemudian `git commit -m "Deskripsi perubahan"`
   - Push ke GitHub: `git push`
   - Jalankan script deployment: `deploy-to-pages.bat`
   - Tunggu hingga proses deployment selesai

2. **Auto-deployment dari GitHub:**
   - Jika sudah diaktifkan, cukup push perubahan ke branch `main`
   - Cloudflare Pages akan otomatis mendeteksi perubahan dan melakukan build+deploy
   - Pantau status deployment di dashboard Cloudflare Pages

### Q: Apakah perubahan di GitHub langsung terlihat di website?
**A:** Tidak langsung. Ada dua kemungkinan:
1. Jika **auto-deployment sudah dikonfigurasi**, maka perubahan di GitHub akan otomatis di-deploy dalam beberapa menit
2. Jika **auto-deployment belum dikonfigurasi**, maka perlu menjalankan script `deploy-to-pages.bat` secara manual

### Q: Berapa lama waktu yang dibutuhkan untuk deployment?
**A:** Biasanya 2-5 menit, tergantung ukuran perubahan dan beban server Cloudflare.

### Q: Bagaimana jika terjadi error saat deployment?
**A:** 
1. Periksa pesan error di terminal
2. Pastikan tidak ada error pada kode
3. Verifikasi konfigurasi di `wrangler.pages.toml`
4. Jika masih berlanjut, coba lihat log di dashboard Cloudflare Pages

### Q: Apakah database ikut terupdate saat deployment?
**A:** Deployment hanya memperbarui kode aplikasi, bukan struktur atau data di database. Jika ada perubahan skema database:
1. Update skema database secara terpisah
2. Jalankan migrasi database jika diperlukan
3. Kemudian deploy perubahan kode

### Q: Bagaimana cara menghindari downtime saat deployment?
**A:** Cloudflare Pages memiliki sistem atomic deployment, yang berarti:
1. Website tetap online dengan versi lama selama proses build berlangsung
2. Setelah build sukses, transisi ke versi baru dilakukan secara instan
3. Tidak ada downtime selama proses deployment

### Q: Bagaimana cara melihat versi yang sedang live?
**A:** 
1. Kunjungi dashboard Cloudflare Pages
2. Pilih project Santri Online
3. Tab "Deployments" menunjukkan semua versi yang pernah di-deploy
4. Versi dengan label "Active" adalah yang sedang live

### Q: Apakah bisa mengembalikan ke versi sebelumnya jika ada masalah?
**A:** Ya, untuk rollback:
1. Buka dashboard Cloudflare Pages
2. Pilih project Santri Online
3. Tab "Deployments"
4. Cari versi yang ingin digunakan
5. Klik "Rollback to this deployment"

## Pengaturan Subdomain

### Q: Bagaimana cara menambahkan subdomain seperti news.santrionline.com?
**A:** Ada beberapa cara untuk mengelola subdomain:

1. **Menggunakan Custom Domain di Cloudflare Pages:**
   - Login ke dashboard Cloudflare
   - Pilih project Santri Online
   - Klik tab "Custom Domains"
   - Klik "Set up a custom domain"
   - Masukkan subdomain: `news.santrionline.com`
   - Ikuti petunjuk untuk memverifikasi domain
   - Perbarui DNS records di Cloudflare DNS

2. **Membuat Project Terpisah untuk News:**
   - Buat repository terpisah untuk website berita (misalnya `santrionline-news`)
   - Buat project baru di Cloudflare Pages
   - Deploy website berita ke project tersebut
   - Tambahkan custom domain `news.santrionline.com` ke project tersebut
   - Update DNS records di Cloudflare

### Q: Bagaimana cara mengelola konten berita secara terpisah?
**A:** Ada dua pendekatan utama:

1. **Solusi Terintegrasi (Satu Codebase):**
   - Tambahkan rute `/news/**` di aplikasi utama
   - Gunakan satu database yang sama
   - Pro: Manajemen data terpusat, lebih mudah berbagi komponen UI
   - Contra: Codebase bisa menjadi lebih kompleks

2. **Solusi Terpisah (Dua Codebase):**
   - Buat aplikasi terpisah khusus untuk berita
   - Gunakan database terpisah atau bersama
   - Integrasikan dengan API jika perlu berbagi data
   - Pro: Lebih mudah di-maintain, tim terpisah bisa bekerja secara independen
   - Contra: Perlu mengatur integrasi antar aplikasi

### Q: Bagaimana cara mengatur DNS untuk subdomain?
**A:** Di Cloudflare:
1. Login ke dashboard Cloudflare
2. Pilih domain `santrionline.com`
3. Klik tab "DNS"
4. Tambahkan record:
   - Type: CNAME
   - Name: news (untuk news.santrionline.com)
   - Target: santrionline.pages.dev atau URL Cloudflare Pages khusus untuk news
   - TTL: Auto
   - Proxy status: Proxied (recommended)
5. Klik "Save"

### Q: Bagaimana cara mengkonfigurasi routing untuk news.santrionline.com?
**A:** Anda perlu menambahkan logika routing di aplikasi untuk menangani permintaan dari subdomain:

1. **Mendeteksi subdomain dalam kode:**
   ```js
   // Contoh dalam Workers/Pages Functions
   export async function onRequest(context) {
     const url = new URL(context.request.url);
     const hostname = url.hostname;
     
     // Deteksi news subdomain
     if (hostname.startsWith('news.')) {
       // Logika khusus untuk news subdomain
       return await handleNewsContent(context);
     }
     
     // Handle normal website traffic
     return await context.next();
   }
   
   async function handleNewsContent(context) {
     // Custom logic untuk news/blog content
     // Bisa mengarahkan ke folder/route khusus
     return new Response("News Section", { status: 200 });
   }
   ```

2. **Menggunakan Routes di Cloudflare:**
   - Di dashboard Cloudflare Pages, buka project Anda
   - Navigasi ke tab "Functions"
   - Tambahkan custom route pattern untuk subdomain
   - Arahkan ke fungsi/handler yang sesuai

3. **Verifikasi routing berfungsi:**
   - Kunjungi subdomain `news.santrionline.com`
   - Pastikan konten yang ditampilkan sesuai dengan yang diharapkan

### Q: Apakah bisa menggunakan subdomain news untuk blog atau artikel berita?
**A:** Ya, subdomain news sangat cocok untuk konten blog atau berita dengan beberapa keuntungan:

1. **Pemisahan konten yang jelas:**
   - Konten berita/blog terpisah dari website utama
   - Pengalaman pengguna yang lebih fokus

2. **Pengelolaan SEO terpisah:**
   - Bisa mengoptimalkan meta tags khusus untuk konten berita
   - Lebih mudah untuk monitoring performa konten berita

3. **Fleksibilitas desain:**
   - Bisa menggunakan tema atau layout yang berbeda untuk bagian berita
   - Tidak harus terikat dengan design sistem website utama

4. **Cara implementasi:**
   - Buat folder khusus seperti `/src/news` atau `/src/blog` di project
   - Setup routing khusus untuk menangani request dari news subdomain
   - Buat komponen dan layout khusus untuk konten berita

### Q: Apa rekomendasi struktur untuk mengelola konten berita di subdomain?
**A:** Struktur yang disarankan:

1. **Struktur folder:**
   ```
   /src/routes/news/          # Semua route untuk news
     index.jsx                # Halaman utama news
     [slug].jsx               # Dynamic route untuk artikel
     categories/
       [category].jsx         # Route untuk kategori berita
     tags/
       [tag].jsx              # Route untuk tag berita
   /src/components/news/      # Komponen khusus untuk news
   /src/styles/news/          # Styling khusus untuk news
   ```

2. **Pengelolaan data:**
   - Tambahkan tabel `news_articles`, `news_categories`, dan `news_tags` di database
   - Buat API endpoints khusus untuk news content

3. **Routing yang disarankan:**
   - `news.santrionline.com/` → Halaman utama berita
   - `news.santrionline.com/article-slug` → Artikel individual
   - `news.santrionline.com/categories/nama-kategori` → List artikel per kategori
   - `news.santrionline.com/tags/nama-tag` → List artikel per tag

## Tips Penting

1. **Selalu test perubahan di lokal** sebelum melakukan deployment
2. **Commit perubahan secara teratur** dengan pesan yang jelas
3. **Backup database secara berkala** untuk menghindari kehilangan data
4. **Pantau logs** setelah deployment untuk memastikan semuanya berjalan normal
5. **Gunakan environment variables** untuk mengatur perilaku berbeda antara subdomain
6. **Subdomain harus responsive** dan kompatibel dengan berbagai perangkat
7. **Pertimbangkan caching strategy** khusus untuk konten berita di subdomain
