-- Migrasi 0006: Perbaikan Fitur Biolink (dari 0006_biolink_features_fixed.sql)
-- Catatan: disesuaikan dengan skema Bahasa Indonesia (tabel pengguna)
SELECT 1; -- placeholder
CREATE INDEX IF NOT EXISTS `idx_pengguna_username` ON `pengguna`(`username`);
SELECT 1 FROM sqlite_master WHERE type='table' AND name='user_social_links';
CREATE INDEX IF NOT EXISTS `idx_social_links_user_id` ON `user_social_links`(`user_id`);
CREATE INDEX IF NOT EXISTS `idx_social_links_platform` ON `user_social_links`(`platform`);
CREATE INDEX IF NOT EXISTS `idx_social_links_order` ON `user_social_links`(`display_order`);
SELECT 1 FROM sqlite_master WHERE type='table' AND name='biolink_analytics';
CREATE INDEX IF NOT EXISTS `idx_biolink_analytics_user_id` ON `biolink_analytics`(`user_id`);
CREATE INDEX IF NOT EXISTS `idx_biolink_analytics_date` ON `biolink_analytics`(`date`);
