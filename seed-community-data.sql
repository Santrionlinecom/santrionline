-- Dummy data untuk komunitas feed
-- File: seed-community-data.sql

-- Insert dummy posts
INSERT OR IGNORE INTO posts (id, author_id, content, created_at) VALUES 
('post-1', 'admin', 'Selamat datang di komunitas SantriOnline! 🕌 
Mari kita berbagi ilmu, pengalaman, dan saling mendukung dalam perjalanan spiritual kita. 

Disini kita bisa:
✅ Berbagi tips hafalan Quran
✅ Diskusi kajian Islam
✅ Sharing pengalaman santri
✅ Bertanya tentang ilmu agama

Jangan lupa untuk selalu menjaga adab dalam berdiskusi ya! 🤲', CAST(strftime('%s', 'now') AS INTEGER) * 1000),

('post-2', 'admin', 'Tips Hafalan Quran untuk Pemula 📖

1. Mulai dengan surah-surah pendek
2. Buat jadwal hafalan harian yang konsisten
3. Gunakan metode muraja''ah (mengulang)
4. Pahami makna ayat yang dihafal
5. Berdoa sebelum mulai hafalan

Siapa yang mau sharing pengalaman hafalan mereka? 💪

#HafalanQuran #TipsHafalan', CAST(strftime('%s', 'now', '-2 hours') AS INTEGER) * 1000),

('post-3', 'admin', 'Subhanallah, pagi ini saya merasakan keajaiban tadabbur Al-Quran 🌅

Ketika membaca QS. Al-Fajr ayat 27-30, hati ini tersentuh mendalam. Bagaimana Allah SWT menggambarkan jiwa yang tenang dan ridha.

"Hai jiwa yang tenang, kembalilah kepada Tuhanmu dengan hati yang puas lagi diridhai-Nya"

Ya Allah, jadikanlah kami termasuk jiwa-jiwa yang tenang... Aamiin 🤲

#Tadabbur #AlQuran #Refleksi', CAST(strftime('%s', 'now', '-4 hours') AS INTEGER) * 1000),

('post-4', 'admin', 'Sharing: Setup Santri Tech Corner! 💻

Alhamdulillah, akhirnya bisa setup workspace yang nyaman untuk belajar coding sambil mengaji. 

Yang sudah saya siapkan:
- Al-Quran digital di tablet
- Laptop untuk coding
- Buku catatan hadits
- Timer untuk pembagian waktu belajar
- Tasbih untuk istighfar saat stuck coding 😅

Teknologi memang tools, tapi jangan sampai lupa ibadah ya! Balance is key 🔄

#SantriTech #ProductiveMuslim #CodingLife', CAST(strftime('%s', 'now', '-6 hours') AS INTEGER) * 1000);

-- Insert dummy comments
INSERT OR IGNORE INTO comments (id, post_id, user_id, content, created_at) VALUES 
('comment-1', 'post-1', 'admin', 'Sangat excited dengan komunitas ini! Semoga bisa jadi wadah yang bermanfaat untuk semua santri 🙏', CAST(strftime('%s', 'now', '-30 minutes') AS INTEGER) * 1000),

('comment-2', 'post-2', 'admin', 'Jazakallahu khairan untuk tipsnya! Saya lagi struggling dengan hafalan Surah Al-Baqarah nih. Ada tips khusus untuk surah panjang?', CAST(strftime('%s', 'now', '-1 hour') AS INTEGER) * 1000),

('comment-3', 'post-2', 'admin', 'Untuk surah panjang, coba bagi per 5 ayat dulu. Setelah lancar, tambah jadi 10 ayat. Konsistensi lebih penting dari kuantitas!', CAST(strftime('%s', 'now', '-45 minutes') AS INTEGER) * 1000),

('comment-4', 'post-3', 'admin', 'Masya Allah, makasih sudah sharing. Saya juga sering nangis kalau baca surah Al-Fajr. Ayat-ayatnya menyentuh banget 😭', CAST(strftime('%s', 'now', '-2 hours') AS INTEGER) * 1000),

('comment-5', 'post-4', 'admin', 'Setup-nya keren! Saya juga programmer muslim, tapi kadang suka lupa sholat kalau lagi focus coding 😅 Thanks for the reminder!', CAST(strftime('%s', 'now', '-3 hours') AS INTEGER) * 1000),

('comment-6', 'post-4', 'admin', 'Wah santri tech juga! Mind sharing tech stack apa yang lagi dipelajari? Saya lagi belajar React nih', CAST(strftime('%s', 'now', '-2.5 hours') AS INTEGER) * 1000);

-- Insert dummy likes
INSERT OR IGNORE INTO likes (id, post_id, user_id, created_at) VALUES 
('like-1', 'post-1', 'admin', CAST(strftime('%s', 'now', '-20 minutes') AS INTEGER) * 1000),
('like-2', 'post-2', 'admin', CAST(strftime('%s', 'now', '-1 hour') AS INTEGER) * 1000),
('like-3', 'post-3', 'admin', CAST(strftime('%s', 'now', '-2 hours') AS INTEGER) * 1000),
('like-4', 'post-4', 'admin', CAST(strftime('%s', 'now', '-3 hours') AS INTEGER) * 1000);
