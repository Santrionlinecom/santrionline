-- Enhanced Community Database Migration
-- Add community posting, commenting, and liking features

-- Drop existing community tables if they exist (to recreate with new structure)
DROP TABLE IF EXISTS post_like;
DROP TABLE IF EXISTS post_comment;
DROP TABLE IF EXISTS community_post;

-- Create community_post table with enhanced features
CREATE TABLE community_post (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'umum' CHECK (category IN ('hafalan', 'kajian', 'pengalaman', 'tanya-jawab', 'event', 'teknologi', 'umum')),
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Create post_comment table
CREATE TABLE post_comment (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_post(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);

-- Create post_like table
CREATE TABLE post_like (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_post(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  UNIQUE(post_id, user_id) -- Ensure one like per user per post
);

-- Create indexes for better performance
CREATE INDEX idx_community_post_author ON community_post(author_id);
CREATE INDEX idx_community_post_category ON community_post(category);
CREATE INDEX idx_community_post_created ON community_post(created_at DESC);
CREATE INDEX idx_community_post_published ON community_post(is_published);

CREATE INDEX idx_post_comment_post ON post_comment(post_id);
CREATE INDEX idx_post_comment_author ON post_comment(author_id);
CREATE INDEX idx_post_comment_created ON post_comment(created_at DESC);

CREATE INDEX idx_post_like_post ON post_like(post_id);
CREATE INDEX idx_post_like_user ON post_like(user_id);
CREATE INDEX idx_post_like_unique ON post_like(post_id, user_id);

-- Insert sample community posts for demonstration
INSERT INTO community_post (id, author_id, title, content, category, likes_count, comments_count, views_count, created_at) VALUES 
('post_1', 'user_test_123', 'Tips Menghafal Al-Quran untuk Pemula', 'Assalamualaikum warahmatullahi wabarakatuh. Saya ingin berbagi pengalaman tentang cara menghafal Al-Quran yang efektif untuk pemula. Setelah 2 tahun menjalani program tahfidz, ada beberapa tips yang sangat membantu:

1. **Konsistensi adalah Kunci**: Lebih baik menghafal sedikit tapi konsisten setiap hari daripada menghafal banyak tapi tidak rutin.

2. **Pilih Waktu Terbaik**: Waktu setelah shalat Fajr biasanya paling baik karena pikiran masih fresh.

3. **Gunakan Mushaf yang Sama**: Ini membantu memori visual kita mengingat letak ayat di halaman.

4. **Muraja''ah Rutin**: Jangan lupakan ayat yang sudah dihafal. Buatlah jadwal muraja''ah harian.

5. **Doa dan Istighfar**: Jangan lupa berdoa kepada Allah agar dimudahkan dalam menghafal.

Semoga bermanfaat untuk teman-teman yang sedang berjuang menghafal Al-Quran. Barakallahu fiikum!', 'hafalan', 45, 12, 234, strftime('%s', 'now') * 1000),

('post_2', 'user_test_123', 'Mengintegrasikan Teknologi dalam Pembelajaran Islam', 'Bagaimana pendapat teman-teman tentang penggunaan aplikasi dan teknologi digital dalam mempelajari agama Islam? 

Di era digital ini, banyak sekali tools yang bisa membantu:
- Aplikasi Al-Quran digital dengan tajwid
- Platform pembelajaran online seperti SantriOnline
- Video kajian dari ustadz terpercaya
- Grup diskusi WhatsApp untuk saling mengingatkan

Namun, tetap harus hati-hati dengan sumber yang kita gunakan. Pastikan selalu merujuk pada ulama yang kredibel dan manhaj yang benar.

Apa pengalaman teman-teman menggunakan teknologi untuk belajar agama?', 'teknologi', 32, 8, 156, strftime('%s', 'now') * 1000 - 86400000),

('post_3', 'user_test_123', 'Pengalaman Umrah Pertama Kali', 'Alhamdulillah, baru saja kembali dari tanah suci setelah melaksanakan umrah untuk pertama kalinya. Subhanallah, pengalaman yang luar biasa dan ingin saya bagikan kepada teman-teman.

**Persiapan Spiritual:**
- Istighfar dan tobat nasuha
- Belajar doa-doa umrah
- Niat yang benar hanya untuk Allah

**Tips Praktis:**
- Bawa sandal yang nyaman untuk thawaf
- Siapkan fisik dengan olahraga rutin
- Pelajari manasik umrah dengan baik

**Kesan yang Tak Terlupakan:**
Saat pertama kali melihat Ka''bah, subhanallah... air mata langsung turun. Perasaan yang sulit digambarkan dengan kata-kata. Semoga Allah memberikan kesempatan kepada kita semua untuk berkunjung ke rumah-Nya.

Aamiin ya Rabbal alamiin.', 'pengalaman', 67, 23, 345, strftime('%s', 'now') * 1000 - 172800000),

('post_4', 'user_test_123', 'Diskusi: Hukum Trading Cryptocurrency dalam Islam', 'Assalamualaikum, saya ingin bertanya kepada para ustadz dan teman-teman yang paham tentang hukum trading cryptocurrency menurut pandangan Islam.

**Pertanyaan saya:**
1. Apakah trading crypto halal atau haram?
2. Bagaimana dengan konsep gharar (ketidakpastian) dalam crypto?
3. Apakah ada perbedaan antara investasi jangka panjang vs trading harian?

Saya sudah baca beberapa fatwa, tapi masih ada yang berbeda pendapat. Ada yang bilang haram karena spekulatif, ada juga yang bilang boleh dengan syarat tertentu.

Mohon pencerahan dari teman-teman yang lebih paham. Jazakumullahu khairan.', 'tanya-jawab', 28, 15, 189, strftime('%s', 'now') * 1000 - 259200000);

-- Insert sample comments
INSERT INTO post_comment (id, post_id, author_id, content, created_at) VALUES 
('comment_1', 'post_1', 'user_test_123', 'Jazakallahu khairan atas tips-nya akhi. Sangat bermanfaat sekali. Saya juga sedang berusaha menghafal dan tips nomor 4 tentang muraja''ah memang sangat penting.', strftime('%s', 'now') * 1000 - 3600000),
('comment_2', 'post_1', 'user_test_123', 'Alhamdulillah, saya sudah menerapkan tips ini dan memang efektif. Terutama yang konsistensi, walaupun cuma 1 ayat sehari tapi rutin, hasilnya lebih bagus daripada target tinggi tapi bolong-bolong.', strftime('%s', 'now') * 1000 - 7200000),
('comment_3', 'post_2', 'user_test_123', 'Setuju banget! Teknologi memang harus dimanfaatkan dengan bijak. Saya pakai aplikasi Quran digital dan sangat membantu untuk belajar tajwid.', strftime('%s', 'now') * 1000 - 1800000),
('comment_4', 'post_3', 'user_test_123', 'Masya Allah, semoga saya juga bisa segera ke sana. Aamiin. Terima kasih sudah berbagi pengalaman yang inspiring ini.', strftime('%s', 'now') * 1000 - 5400000),
('comment_5', 'post_4', 'user_test_123', 'Setahu saya, kebanyakan ulama kontemporer cenderung mengatakan haram karena unsur spekulasi yang tinggi. Tapi memang masih ada perbedaan pendapat.', strftime('%s', 'now') * 1000 - 9000000);

-- Insert sample likes
INSERT INTO post_like (id, post_id, user_id, created_at) VALUES 
('like_1', 'post_1', 'user_test_123', strftime('%s', 'now') * 1000 - 1800000),
('like_2', 'post_2', 'user_test_123', strftime('%s', 'now') * 1000 - 3600000),
('like_3', 'post_3', 'user_test_123', strftime('%s', 'now') * 1000 - 7200000);

-- Update counts in posts (this would normally be done via triggers or application logic)
UPDATE community_post SET 
  comments_count = (SELECT COUNT(*) FROM post_comment WHERE post_id = community_post.id),
  likes_count = (SELECT COUNT(*) FROM post_like WHERE post_id = community_post.id);

-- Show success message
SELECT 'Community database migration completed successfully!' as message;
