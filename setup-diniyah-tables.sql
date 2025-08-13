-- Setup Tabel Diniyah untuk Database santri-db
-- Jalankan di Cloudflare D1 Console

-- 1. Tabel untuk menyimpan daftar kitab diniyah
CREATE TABLE IF NOT EXISTS diniyah_kitab (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
);

-- 2. Tabel untuk menyimpan pelajaran dalam setiap kitab
CREATE TABLE IF NOT EXISTS diniyah_pelajaran (
    id INTEGER PRIMARY KEY,
    kitab_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (kitab_id) REFERENCES diniyah_kitab(id)
);

-- 3. Tabel untuk menyimpan progress diniyah per user
CREATE TABLE IF NOT EXISTS user_progres_diniyah (
    user_id TEXT NOT NULL,
    pelajaran_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at INTEGER, -- timestamp
    PRIMARY KEY(user_id, pelajaran_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (pelajaran_id) REFERENCES diniyah_pelajaran(id)
);

-- 4. Insert data kitab diniyah
INSERT OR IGNORE INTO diniyah_kitab (id, name, category, description) VALUES
(1, 'Aqidatul Awam', 'Aqidah', 'Kitab dasar aqidah Ahlussunnah wal Jama''ah'),
(2, 'Hadits Arbain Nawawi', 'Hadits', '40 hadits pilihan Imam Nawawi'),
(3, 'Safinatun Najah', 'Fiqih', 'Kitab fiqih dasar dalam mazhab Syafi''i'),
(4, 'Bidayatul Hidayah', 'Tasawuf', 'Kitab tasawuf karya Imam Ghazali');

-- 5. Insert pelajaran untuk Aqidatul Awam
INSERT OR IGNORE INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
(1, 1, 'Pengenalan Aqidah', 5),
(2, 1, 'Sifat Wajib Allah', 10),
(3, 1, 'Sifat Mustahil Allah', 8),
(4, 1, 'Sifat Jaiz Allah', 5),
(5, 1, 'Sifat Rasul', 12),
(6, 1, 'Hal Jaiz bagi Rasul', 8),
(7, 1, 'Hal Mustahil bagi Rasul', 7),
(8, 1, 'Iman kepada Malaikat', 10),
(9, 1, 'Iman kepada Kitab Suci', 8),
(10, 1, 'Iman kepada Hari Akhir', 12);

-- 6. Insert pelajaran untuk Hadits Arbain Nawawi
INSERT OR IGNORE INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
(11, 2, 'Hadits 1: Amal dengan Niat', 3),
(12, 2, 'Hadits 2: Islam, Iman, Ihsan', 4),
(13, 2, 'Hadits 3: Rukun Islam', 3),
(14, 2, 'Hadits 4: Penciptaan Manusia', 4),
(15, 2, 'Hadits 5: Bidah dalam Agama', 3),
(16, 2, 'Hadits 6: Halal dan Haram', 4),
(17, 2, 'Hadits 7: Agama adalah Nasihat', 3),
(18, 2, 'Hadits 8: Darah yang Haram', 4),
(19, 2, 'Hadits 9: Taklif dan Kemampuan', 3),
(20, 2, 'Hadits 10: Rizki yang Baik', 4),
(21, 2, 'Hadits 11-20', 30),
(22, 2, 'Hadits 21-30', 30),
(23, 2, 'Hadits 31-40', 30);

-- 7. Insert pelajaran untuk Safinatun Najah
INSERT OR IGNORE INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
(24, 3, 'Thaharah: Wudhu', 8),
(25, 3, 'Thaharah: Mandi Janabah', 6),
(26, 3, 'Thaharah: Tayammum', 5),
(27, 3, 'Shalat: Syarat dan Rukun', 12),
(28, 3, 'Shalat: Sunnah dan Makruh', 10),
(29, 3, 'Shalat: Hal-hal yang Membatalkan', 8),
(30, 3, 'Zakat: Hukum dan Nisab', 10),
(31, 3, 'Puasa: Rukun dan Syarat', 8),
(32, 3, 'Puasa: Hal-hal yang Membatalkan', 7),
(33, 3, 'Haji: Rukun dan Wajib', 12);

-- 8. Insert pelajaran untuk Bidayatul Hidayah
INSERT OR IGNORE INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
(34, 4, 'Adab dalam Ibadah', 8),
(35, 4, 'Adab Makan dan Minum', 6),
(36, 4, 'Adab Berbicara', 7),
(37, 4, 'Adab Bergaul', 8),
(38, 4, 'Adab Majelis Ilmu', 9),
(39, 4, 'Tazkiyatun Nafs', 10),
(40, 4, 'Akhlak kepada Allah', 12),
(41, 4, 'Akhlak kepada Rasul', 8),
(42, 4, 'Akhlak kepada Sesama', 9),
(43, 4, 'Riyadhah dan Mujahadah', 11);
