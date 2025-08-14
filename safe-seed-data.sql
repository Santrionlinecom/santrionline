-- SAFE SEED DATA - NO APOSTROPHES, PROPER FOREIGN KEY ORDER
-- This fixes "near am syntax error" by removing problematic characters

-- Insert user first (no dependencies)
INSERT OR REPLACE INTO user (id, name, email, password_hash, role, created_at, username)
VALUES ('user_test_123', 'Santri Test', 'test@santrionline.com', 'password123hash', 'santri', 1754302221, 'santritest');

-- Insert sample ustadzfarhan user
INSERT OR REPLACE INTO user (id, name, email, password_hash, role, created_at, username)
VALUES ('user_ustadzfarhan', 'Ustadz Farhan Maulana', 'ustadzfarhan@santrionline.com', 'password123hash', 'ustadz', 1754302221, 'ustadzfarhan');

-- Insert wallet (depends on user)
INSERT OR REPLACE INTO dompet_santri (id, user_id, dincoin_balance, dircoin_balance) 
VALUES ('wallet_test_123', 'user_test_123', 150, 75);

-- Insert Quran surahs (NO APOSTROPHES - this fixes syntax error)
INSERT OR REPLACE INTO quran_surah (id, name, total_ayah) VALUES 
(1, 'Al-Fatihah', 7),
(2, 'Al-Baqarah', 286),
(3, 'Ali Imran', 200),
(4, 'An-Nisa', 176),
(5, 'Al-Maidah', 120),
(6, 'Al-Anam', 165),
(7, 'Al-Araf', 206),
(8, 'Al-Anfal', 75),
(9, 'At-Taubah', 129),
(10, 'Yunus', 109),
(67, 'Al-Mulk', 30),
(78, 'An-Naba', 40),
(103, 'Al-Asr', 3),
(108, 'Al-Kauthar', 3),
(109, 'Al-Kafirun', 6),
(110, 'An-Nasr', 3),
(111, 'Al-Masad', 5),
(112, 'Al-Ikhlas', 4),
(113, 'Al-Falaq', 5),
(114, 'An-Nas', 6);

-- Insert diniyah kitab (no dependencies)
INSERT OR REPLACE INTO diniyah_kitab (id, name, category, description) VALUES 
(1, 'Aqidatul Awam', 'Aqidah', 'Kitab dasar aqidah'),
(2, 'Hadits Arbain Nawawi', 'Hadits', '40 hadits pilihan'),
(3, 'Safinatun Najah', 'Fiqih', 'Kitab fiqih dasar'),
(4, 'Bidayatul Hidayah', 'Tasawuf', 'Kitab tasawuf');

-- Insert diniyah pelajaran (depends on kitab)
INSERT OR REPLACE INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES 
(1, 1, 'Pengenalan Aqidah', 5),
(2, 1, 'Sifat Wajib Allah', 10),
(3, 1, 'Sifat Mustahil Allah', 8),
(11, 2, 'Hadits 1: Amal dengan Niat', 3),
(12, 2, 'Hadits 2: Islam Iman Ihsan', 4),
(24, 3, 'Thaharah: Wudhu', 8),
(25, 3, 'Thaharah: Mandi Janabah', 6),
(34, 4, 'Adab dalam Ibadah', 8),
(35, 4, 'Adab Makan dan Minum', 6);

-- Insert test progress (depends on user and above tables)
INSERT OR REPLACE INTO user_hafalan_quran (user_id, surah_id, completed_ayah) VALUES 
('user_test_123', 1, 7),
('user_test_123', 112, 4),
('user_test_123', 113, 5);

INSERT OR REPLACE INTO user_progres_diniyah (user_id, pelajaran_id, status, completed_at) VALUES 
('user_test_123', 1, 'completed', 1754302221),
('user_test_123', 2, 'in_progress', NULL),
('user_test_123', 11, 'completed', 1754302221);

SELECT 'All data inserted successfully - No syntax errors, no foreign key errors!' as message;
