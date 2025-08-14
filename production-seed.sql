-- Production seed data for Santri Online
-- This will populate initial data for production

-- Insert sample admin user with biolink
INSERT OR IGNORE INTO user (
  id, name, email, username, bio, is_public, theme, password_hash, role, created_at
) VALUES (
  'admin-001',
  'Admin Santri Online', 
  'admin@santrionline.com', 
  'admin', 
  'Administrator Santri Online - Platform pembelajaran digital untuk para santri', 
  1, 
  'light', 
  '$2a$10$dummy.hash.for.admin.user.placeholder.security', 
  'admin', 
  strftime('%s', 'now')
);

-- Insert sample ustadzfarhan profile
INSERT OR IGNORE INTO user (
  id, name, email, username, bio, is_public, theme, password_hash, role, created_at
) VALUES (
  'ustadzfarhan-001',
  'Ustadz Farhan Maulana',
  'ustadzfarhan@santrionline.com',
  'ustadzfarhan',
  '🎓 Alumni Al-Azhar Kairo | 📖 Pengajar Kitab Kuning | 🕌 Imam Masjid',
  1,
  'dark',
  '$2a$10$dummy.hash.for.ustadzfarhan.user.placeholder.security',
  'ustadz',
  strftime('%s', 'now')
);

-- Insert sample social media links for admin
INSERT OR IGNORE INTO user_social_links (
  id, user_id, platform, url, is_visible, display_order, created_at
) VALUES
('social-001', 'admin-001', 'instagram', 'https://instagram.com/santrionline', 1, 1, strftime('%s', 'now')),
('social-002', 'admin-001', 'facebook', 'https://facebook.com/santrionline', 1, 2, strftime('%s', 'now')),
('social-003', 'admin-001', 'youtube', 'https://youtube.com/@santrionline', 1, 3, strftime('%s', 'now')),
('social-004', 'admin-001', 'website', 'https://santrionline.com', 1, 4, strftime('%s', 'now'));

-- Insert social media links for ustadzfarhan
INSERT OR IGNORE INTO user_social_links (
  id, user_id, platform, url, is_visible, display_order, created_at
) VALUES
('social-uf-001', 'ustadzfarhan-001', 'youtube', 'https://youtube.com/@ustadzfarhan', 1, 1, strftime('%s', 'now')),
('social-uf-002', 'ustadzfarhan-001', 'instagram', 'https://instagram.com/ustadzfarhan', 1, 2, strftime('%s', 'now')),
('social-uf-003', 'ustadzfarhan-001', 'website', 'https://ustadzfarhan.com', 1, 3, strftime('%s', 'now')),
('social-uf-004', 'ustadzfarhan-001', 'whatsapp', 'https://wa.me/628123456789', 1, 4, strftime('%s', 'now')),
('social-uf-005', 'ustadzfarhan-001', 'twitter', 'https://twitter.com/ustadzfarhan', 1, 5, strftime('%s', 'now'));

-- Insert sample biolink analytics
INSERT OR IGNORE INTO biolink_analytics (
  id, user_id, visitor_count, click_count, date, created_at
) VALUES 
('analytics-001', 'admin-001', 0, 0, date('now'), strftime('%s', 'now'));

-- Insert sample Quran surahs (popular ones)
INSERT OR IGNORE INTO quran_surah (id, name, total_ayah) VALUES
(1, 'Al-Fatihah', 7),
(2, 'Al-Baqarah', 286),
(3, 'Ali-Imran', 200),
(36, 'Yasin', 83),
(55, 'Ar-Rahman', 78),
(67, 'Al-Mulk', 30),
(112, 'Al-Ikhlas', 4),
(113, 'Al-Falaq', 5),
(114, 'An-Nas', 6);

-- Insert sample diniyah kitab
INSERT OR IGNORE INTO diniyah_kitab (id, name) VALUES
(1, 'Tafsir Al-Quran'),
(2, 'Hadits Shahih'),
(3, 'Fiqh Ibadah'),
(4, 'Akhlaq dan Tasawuf'),
(5, 'Sirah Nabawiyah');

-- Insert sample diniyah pelajaran
INSERT OR IGNORE INTO diniyah_pelajaran (id, kitab_id, title) VALUES
(1, 1, 'Pengenalan Tafsir Al-Quran'),
(2, 1, 'Metode Tafsir'),
(3, 2, 'Hadits tentang Ibadah'),
(4, 2, 'Hadits tentang Akhlaq'),
(5, 3, 'Fiqh Shalat'),
(6, 3, 'Fiqh Zakat'),
(7, 4, 'Akhlaq kepada Allah'),
(8, 4, 'Akhlaq kepada Sesama'),
(9, 5, 'Kelahiran Nabi Muhammad SAW'),
(10, 5, 'Hijrah ke Madinah');

-- Insert sample karya for admin
INSERT OR IGNORE INTO karya (
  id, author_id, title, description, price, content_type, content, excerpt, 
  status, slug, category, published_at, created_at, updated_at, 
  view_count, download_count, is_free, reading_time
) VALUES (
  'karya-001',
  'admin-001',
  'Panduan Biolink Santri Online',
  'Panduan lengkap menggunakan fitur biolink di platform Santri Online',
  0,
  'html',
  '<h1>Panduan Biolink Santri Online</h1><p>Biolink adalah fitur yang memungkinkan setiap santri memiliki halaman profil personal yang dapat dibagikan ke media sosial.</p>',
  'Panduan lengkap menggunakan fitur biolink untuk para santri',
  'published',
  'panduan-biolink-santri-online',
  'Tutorial',
  strftime('%s', 'now'),
  strftime('%s', 'now'),
  strftime('%s', 'now'),
  0,
  0,
  1,
  5
);

-- Create dompet for admin
INSERT OR IGNORE INTO dompet_santri (
  id, user_id, dincoin_balance, dircoin_balance
) VALUES (
  'dompet-001', 'admin-001', 1000, 500
);
