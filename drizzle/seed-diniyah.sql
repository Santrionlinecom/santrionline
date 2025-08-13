-- Seed data for Diniyah curriculum
-- This follows the Ahlussunnah wal Jama'ah tradition

-- Insert Diniyah books
INSERT INTO diniyah_kitab (id, name) VALUES 
(1, 'Aqidatul Awam'),
(2, 'Hadits Arbain Nawawi'),
(3, 'Safinatun Najah'),
(4, 'Bidayatul Hidayah');

-- Insert lessons for Aqidatul Awam (Aqidah)
INSERT INTO diniyah_pelajaran (id, kitab_id, title) VALUES 
(1, 1, 'Pengenalan Aqidah'),
(2, 1, 'Sifat Wajib Allah'),
(3, 1, 'Sifat Mustahil Allah'),
(4, 1, 'Sifat Jaiz Allah'),
(5, 1, 'Sifat Rasul'),
(6, 1, 'Hal Jaiz bagi Rasul'),
(7, 1, 'Hal Mustahil bagi Rasul'),
(8, 1, 'Iman kepada Malaikat'),
(9, 1, 'Iman kepada Kitab Suci'),
(10, 1, 'Iman kepada Hari Akhir');

-- Insert lessons for Hadits Arbain Nawawi (Hadits)
INSERT INTO diniyah_pelajaran (id, kitab_id, title) VALUES 
(11, 2, 'Hadits 1: Amal dengan Niat'),
(12, 2, 'Hadits 2: Islam, Iman, Ihsan'),
(13, 2, 'Hadits 3: Rukun Islam'),
(14, 2, 'Hadits 4: Penciptaan Manusia'),
(15, 2, 'Hadits 5: Bidah dalam Agama'),
(16, 2, 'Hadits 6: Halal dan Haram'),
(17, 2, 'Hadits 7: Agama adalah Nasihat'),
(18, 2, 'Hadits 8: Darah yang Haram'),
(19, 2, 'Hadits 9: Taklif dan Kemampuan'),
(20, 2, 'Hadits 10: Rizki yang Baik'),
(21, 2, 'Hadits 11-20'),
(22, 2, 'Hadits 21-30'),
(23, 2, 'Hadits 31-40');

-- Insert lessons for Safinatun Najah (Fiqih)
INSERT INTO diniyah_pelajaran (id, kitab_id, title) VALUES 
(24, 3, 'Thaharah: Wudhu'),
(25, 3, 'Thaharah: Mandi Janabah'),
(26, 3, 'Thaharah: Tayammum'),
(27, 3, 'Shalat: Syarat dan Rukun'),
(28, 3, 'Shalat: Sunnah dan Makruh'),
(29, 3, 'Shalat: Hal-hal yang Membatalkan'),
(30, 3, 'Zakat: Hukum dan Nisab'),
(31, 3, 'Puasa: Rukun dan Syarat'),
(32, 3, 'Puasa: Hal-hal yang Membatalkan'),
(33, 3, 'Haji: Rukun dan Wajib');

-- Insert lessons for Bidayatul Hidayah (Tasawuf)
INSERT INTO diniyah_pelajaran (id, kitab_id, title) VALUES 
(34, 4, 'Adab dalam Ibadah'),
(35, 4, 'Adab Makan dan Minum'),
(36, 4, 'Adab Berbicara'),
(37, 4, 'Adab Bergaul'),
(38, 4, 'Adab Majelis Ilmu'),
(39, 4, 'Tazkiyatun Nafs'),
(40, 4, 'Akhlak kepada Allah'),
(41, 4, 'Akhlak kepada Rasul'),
(42, 4, 'Akhlak kepada Sesama'),
(43, 4, 'Riyadhah dan Mujahadah');
