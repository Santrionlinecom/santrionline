PRAGMA foreign_keys=OFF;

-- Tabel akun utama (pengganti `user`)
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `email` TEXT NOT NULL UNIQUE,
  `password_hash` TEXT NOT NULL,
  `avatar_url` TEXT,
  `role` TEXT NOT NULL DEFAULT 'santri',
  `created_at` INTEGER NOT NULL,
  -- Kolom yang ditambahkan di migrasi incremental lama:
  `username` TEXT,
  `bio` TEXT,
  `is_public` INTEGER DEFAULT 1,
  `theme` TEXT DEFAULT 'light',
  `custom_domain` TEXT
);
CREATE INDEX IF NOT EXISTS idx_pengguna_email ON pengguna(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_username ON pengguna(username);

-- Karya (produk / konten premium)
CREATE TABLE IF NOT EXISTS `karya` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `author_id` TEXT NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT,
  `price` INTEGER NOT NULL,
  `file_url` TEXT,
  `created_at` INTEGER NOT NULL,
  `content_type` TEXT DEFAULT 'text',
  `content` TEXT,
  `excerpt` TEXT,
  `status` TEXT DEFAULT 'draft',
  `slug` TEXT,
  `featured_image` TEXT,
  `seo_title` TEXT,
  `seo_description` TEXT,
  `seo_keywords` TEXT,
  `tags` TEXT,
  `category` TEXT,
  `published_at` INTEGER,
  `updated_at` INTEGER,
  `view_count` INTEGER DEFAULT 0,
  `download_count` INTEGER DEFAULT 0,
  `is_free` INTEGER DEFAULT 0,
  `reading_time` INTEGER,
  FOREIGN KEY (`author_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Diniyah / Pendidikan
CREATE TABLE IF NOT EXISTS `diniyah_kitab` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `category` TEXT NOT NULL DEFAULT 'umum',
  `description` TEXT
);
CREATE TABLE IF NOT EXISTS `diniyah_pelajaran` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `kitab_id` INTEGER NOT NULL,
  `title` TEXT NOT NULL,
  `points` INTEGER DEFAULT 0 NOT NULL,
  FOREIGN KEY (`kitab_id`) REFERENCES `diniyah_kitab`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS `user_progres_diniyah` (
  `user_id` TEXT NOT NULL,
  `pelajaran_id` INTEGER NOT NULL,
  `status` TEXT DEFAULT 'not_started' NOT NULL,
  `completed_at` INTEGER,
  PRIMARY KEY(`user_id`, `pelajaran_id`),
  FOREIGN KEY (`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (`pelajaran_id`) REFERENCES `diniyah_pelajaran`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Hafalan Qur'an
CREATE TABLE IF NOT EXISTS `quran_surah` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `total_ayah` INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS `user_hafalan_quran` (
  `user_id` TEXT NOT NULL,
  `surah_id` INTEGER NOT NULL,
  `completed_ayah` INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY(`user_id`, `surah_id`),
  FOREIGN KEY (`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (`surah_id`) REFERENCES `quran_surah`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Dompet & Transaksi
CREATE TABLE IF NOT EXISTS `dompet_santri` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `dincoin_balance` INTEGER DEFAULT 0 NOT NULL,
  `dircoin_balance` INTEGER DEFAULT 0 NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `dompet_id` TEXT NOT NULL,
  `amount` INTEGER NOT NULL,
  `type` TEXT NOT NULL,
  `currency` TEXT NOT NULL,
  `description` TEXT,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`dompet_id`) REFERENCES `dompet_santri`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Analitik & Biolink
CREATE TABLE IF NOT EXISTS `biolink_analytics` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `visitor_count` INTEGER DEFAULT 0,
  `click_count` INTEGER DEFAULT 0,
  `date` TEXT NOT NULL,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS `user_social_links` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `platform` TEXT NOT NULL,
  `url` TEXT NOT NULL,
  `is_visible` INTEGER DEFAULT 1,
  `display_order` INTEGER DEFAULT 0,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Orders & Purchases (ecommerce ringan)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `buyer_id` TEXT NOT NULL,
  `karya_id` TEXT NOT NULL,
  `total_amount` INTEGER NOT NULL,
  `status` TEXT DEFAULT 'pending' NOT NULL,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`buyer_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (`karya_id`) REFERENCES `karya`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `buyer_id` TEXT NOT NULL,
  `seller_id` TEXT NOT NULL,
  `karya_id` TEXT NOT NULL,
  `amount` INTEGER NOT NULL,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY (`buyer_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (`seller_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (`karya_id`) REFERENCES `karya`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

PRAGMA foreign_keys=ON;
SELECT 1; -- end baseline
