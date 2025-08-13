-- =================================================================
-- Manual Database Setup for SantriOnline
-- Description: Setup lengkap database untuk development
-- Created: 2025-08-04
-- Usage: npx wrangler d1 execute santrionlinedb --local --file=manual-setup.sql
-- =================================================================

-- 1. Drop existing tables (untuk clean setup)
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS `user_hafalan_quran`;
DROP TABLE IF EXISTS `user_progres_diniyah`;
DROP TABLE IF EXISTS `user_social_links`;
DROP TABLE IF EXISTS `biolink_analytics`;
DROP TABLE IF EXISTS `post_comment`;
DROP TABLE IF EXISTS `community_post`;
DROP TABLE IF EXISTS `transaction`;
DROP TABLE IF EXISTS `dompet_santri`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `karya`;
DROP TABLE IF EXISTS `ijazah`;
DROP TABLE IF EXISTS `diniyah_pelajaran`;
DROP TABLE IF EXISTS `diniyah_kitab`;
DROP TABLE IF EXISTS `quran_surah`;
DROP TABLE IF EXISTS `user`;

PRAGMA foreign_keys = ON;

-- =================================================================
-- 2. Core Tables Creation
-- =================================================================

-- User table (tabel utama pengguna)
CREATE TABLE `user` (
    `id` TEXT PRIMARY KEY NOT NULL,
    `name` TEXT NOT NULL,
    `email` TEXT NOT NULL UNIQUE,
    `password_hash` TEXT NOT NULL,
    `avatar_url` TEXT,
    `role` TEXT NOT NULL DEFAULT 'santri',
    `created_at` INTEGER NOT NULL,
    `username` TEXT UNIQUE,
    `bio` TEXT,
    `is_public` INTEGER DEFAULT 1,
    `theme` TEXT DEFAULT 'light',
    `custom_domain` TEXT
);

-- Quran surah table
CREATE TABLE `quran_surah` (
    `id` INTEGER PRIMARY KEY NOT NULL,
    `name` TEXT NOT NULL,
    `total_ayah` INTEGER NOT NULL
);

-- User hafalan Quran table
CREATE TABLE `user_hafalan_quran` (
    `user_id` TEXT NOT NULL,
    `surah_id` INTEGER NOT NULL,
    `completed_ayah` INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY(`user_id`, `surah_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`surah_id`) REFERENCES `quran_surah`(`id`) ON DELETE CASCADE
);

-- Social media links table
CREATE TABLE `user_social_links` (
    `id` TEXT PRIMARY KEY NOT NULL,
    `user_id` TEXT NOT NULL,
    `platform` TEXT NOT NULL,
    `url` TEXT NOT NULL,
    `is_visible` INTEGER DEFAULT 1,
    `display_order` INTEGER DEFAULT 0,
    `created_at` INTEGER NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

-- Biolink analytics table
CREATE TABLE `biolink_analytics` (
    `id` TEXT PRIMARY KEY NOT NULL,
    `user_id` TEXT NOT NULL,
    `visitor_count` INTEGER DEFAULT 0,
    `click_count` INTEGER DEFAULT 0,
    `date` TEXT NOT NULL,
    `created_at` INTEGER NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

-- =================================================================
-- 3. Indexes untuk performa
-- =================================================================

CREATE INDEX `idx_user_email` ON `user`(`email`);
CREATE INDEX `idx_user_username` ON `user`(`username`);
CREATE INDEX `idx_hafalan_user_id` ON `user_hafalan_quran`(`user_id`);
CREATE INDEX `idx_hafalan_surah_id` ON `user_hafalan_quran`(`surah_id`);
CREATE INDEX `idx_social_links_user_id` ON `user_social_links`(`user_id`);
CREATE INDEX `idx_social_links_platform` ON `user_social_links`(`platform`);
CREATE INDEX `idx_biolink_analytics_user_id` ON `biolink_analytics`(`user_id`);
CREATE INDEX `idx_biolink_analytics_date` ON `biolink_analytics`(`date`);

-- =================================================================
-- 4. Seed Data - Quran Surahs (114 surahs)
-- =================================================================

INSERT INTO `quran_surah` (`id`, `name`, `total_ayah`) VALUES 
(1, 'Al-Fatihah', 7),
(2, 'Al-Baqarah', 286),
(3, 'Ali Imran', 200),
(4, 'An-Nisa', 176),
(5, 'Al-Ma''idah', 120),
(6, 'Al-An''am', 165),
(7, 'Al-A''raf', 206),
(8, 'Al-Anfal', 75),
(9, 'At-Tawbah', 129),
(10, 'Yunus', 109),
(11, 'Hud', 123),
(12, 'Yusuf', 111),
(13, 'Ar-Ra''d', 43),
(14, 'Ibrahim', 52),
(15, 'Al-Hijr', 99),
(16, 'An-Nahl', 128),
(17, 'Al-Isra', 111),
(18, 'Al-Kahf', 110),
(19, 'Maryam', 98),
(20, 'Taha', 135),
(21, 'Al-Anbya', 112),
(22, 'Al-Hajj', 78),
(23, 'Al-Mu''minun', 118),
(24, 'An-Nur', 64),
(25, 'Al-Furqan', 77),
(26, 'Asy-Syu''ara', 227),
(27, 'An-Naml', 93),
(28, 'Al-Qasas', 88),
(29, 'Al-''Ankabut', 69),
(30, 'Ar-Rum', 60),
(31, 'Luqman', 34),
(32, 'As-Sajdah', 30),
(33, 'Al-Ahzab', 73),
(34, 'Saba', 54),
(35, 'Fatir', 45),
(36, 'Ya-Sin', 83),
(37, 'As-Saffat', 182),
(38, 'Sad', 88),
(39, 'Az-Zumar', 75),
(40, 'Ghafir', 85),
(41, 'Fussilat', 54),
(42, 'Asy-Syura', 53),
(43, 'Az-Zukhruf', 89),
(44, 'Ad-Dukhan', 59),
(45, 'Al-Jathiyah', 37),
(46, 'Al-Ahqaf', 35),
(47, 'Muhammad', 38),
(48, 'Al-Fath', 29),
(49, 'Al-Hujurat', 18),
(50, 'Qaf', 45),
(51, 'Adz-Dzariyah', 60),
(52, 'At-Tur', 49),
(53, 'An-Najm', 62),
(54, 'Al-Qamar', 55),
(55, 'Ar-Rahman', 78),
(56, 'Al-Waqi''ah', 96),
(57, 'Al-Hadid', 29),
(58, 'Al-Mujadila', 22),
(59, 'Al-Hasyr', 24),
(60, 'Al-Mumtahanah', 13),
(61, 'As-Saf', 14),
(62, 'Al-Jumu''ah', 11),
(63, 'Al-Munafiqun', 11),
(64, 'At-Taghabun', 18),
(65, 'At-Talaq', 12),
(66, 'At-Tahrim', 12),
(67, 'Al-Mulk', 30),
(68, 'Al-Qalam', 52),
(69, 'Al-Haqqah', 52),
(70, 'Al-Ma''arij', 44),
(71, 'Nuh', 28),
(72, 'Al-Jinn', 28),
(73, 'Al-Muzzammil', 20),
(74, 'Al-Muddaththir', 56),
(75, 'Al-Qiyamah', 40),
(76, 'Al-Insan', 31),
(77, 'Al-Mursalat', 50),
(78, 'An-Naba', 40),
(79, 'An-Nazi''at', 46),
(80, '''Abasa', 42),
(81, 'At-Takwir', 29),
(82, 'Al-Infitar', 19),
(83, 'Al-Mutaffifin', 36),
(84, 'Al-Insyiqaq', 25),
(85, 'Al-Buruj', 22),
(86, 'At-Tariq', 17),
(87, 'Al-A''la', 19),
(88, 'Al-Ghasyiyah', 26),
(89, 'Al-Fajr', 30),
(90, 'Al-Balad', 20),
(91, 'Asy-Syams', 15),
(92, 'Al-Lail', 21),
(93, 'Ad-Duha', 11),
(94, 'Asy-Syarh', 8),
(95, 'At-Tin', 8),
(96, 'Al-''Alaq', 19),
(97, 'Al-Qadr', 5),
(98, 'Al-Bayyinah', 8),
(99, 'Az-Zalzalah', 8),
(100, 'Al-''Adiyat', 11),
(101, 'Al-Qari''ah', 11),
(102, 'At-Takathur', 8),
(103, 'Al-''Asr', 3),
(104, 'Al-Humazah', 9),
(105, 'Al-Fil', 5),
(106, 'Quraisy', 4),
(107, 'Al-Ma''un', 7),
(108, 'Al-Kautsar', 3),
(109, 'Al-Kafirun', 6),
(110, 'An-Nasr', 3),
(111, 'Al-Masad', 5),
(112, 'Al-Ikhlas', 4),
(113, 'Al-Falaq', 5),
(114, 'An-Nas', 6);

-- =================================================================
-- 5. Demo Data untuk Testing
-- =================================================================

-- Insert demo user
INSERT INTO `user` (
    `id`, 
    `name`, 
    `email`, 
    `password_hash`, 
    `role`, 
    `created_at`,
    `username`,
    `bio`
) VALUES (
    'demo_user_123', 
    'Demo Santri', 
    'demo@santrionline.com', 
    '$2b$10$demo.hash.untuk.testing', 
    'santri', 
    strftime('%s', 'now'),
    'demosantri',
    'Ini adalah akun demo untuk testing SantriOnline'
);

-- =================================================================
-- 6. Verification Query
-- =================================================================

SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_surahs FROM quran_surah;
SELECT COUNT(*) as total_users FROM user;

-- =================================================================
-- End Manual Setup
-- =================================================================
