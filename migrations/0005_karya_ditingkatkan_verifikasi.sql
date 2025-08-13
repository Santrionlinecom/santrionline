-- Migrasi 0005: Karya Ditingkatkan (verifikasi dari 0005_enhanced_karya.sql)
SELECT 1; -- dummy
SELECT CASE WHEN COUNT(*) = 1 THEN 'Kolom content_type sudah ada' ELSE 'Kolom content_type belum ada' END FROM pragma_table_info('karya') WHERE name = 'content_type';
