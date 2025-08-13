-- Verification script untuk memastikan data Al-Quran lengkap
-- Script ini memeriksa sample data dari berbagai juz

-- Total surah harus 114
SELECT 'Total Surah:' as info, COUNT(*) as count FROM quran_surah;

-- Surah terpendek dan terpanjang
SELECT 'Surah Terpendek:' as info, name, total_ayah 
FROM quran_surah 
WHERE total_ayah = (SELECT MIN(total_ayah) FROM quran_surah);

SELECT 'Surah Terpanjang:' as info, name, total_ayah 
FROM quran_surah 
WHERE total_ayah = (SELECT MAX(total_ayah) FROM quran_surah);

-- Sample surah dari juz awal, tengah, dan akhir
SELECT 'Juz 1 (Al-Fatihah):' as info, id, name, total_ayah 
FROM quran_surah WHERE id = 1;

SELECT 'Juz 15 (Ya-Sin):' as info, id, name, total_ayah 
FROM quran_surah WHERE id = 36;

SELECT 'Juz 30 (An-Nas):' as info, id, name, total_ayah 
FROM quran_surah WHERE id = 114;

-- Beberapa surah populer untuk hafalan
SELECT 'Surah Populer untuk Hafalan:' as info, id, name, total_ayah 
FROM quran_surah 
WHERE id IN (1, 2, 18, 36, 55, 67, 112, 113, 114)
ORDER BY id;
