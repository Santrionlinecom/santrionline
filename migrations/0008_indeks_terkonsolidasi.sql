-- Migrasi 0008: Indeks Terkonsolidasi (terjemahan dari 0008_consolidated_indexes.sql)
CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_username ON pengguna(username);
-- Kolom-kolom (category, likes_count, comments_count, views_count, is_published, updated_at)
-- SUDAH ada di schema & sebagian besar environment sehingga ALTER sebelumnya menyebabkan
-- error "duplicate column name" dan menghentikan migrasi.
-- Jika Anda membuat database BARU dari baseline yang benar-benar lama dan kolom belum ada,
-- tambahkan manual dengan perintah berikut (jalankan satu per satu):
-- ALTER dihapus agar migrasi idempotent & tidak gagal pada DB yang sudah maju.
-- Tabel topup_requests belum ada di baseline, buat dulu agar index tidak gagal
CREATE TABLE IF NOT EXISTS `topup_requests` (
	`id` TEXT PRIMARY KEY NOT NULL,
	`user_id` TEXT NOT NULL,
	`amount` INTEGER NOT NULL,
	`currency` TEXT NOT NULL,
	`payment_method` TEXT NOT NULL,
	`payment_proof` TEXT,
	`bank_account` TEXT,
	`transfer_amount` INTEGER,
	`whatsapp_number` TEXT,
	`notes` TEXT,
	`status` TEXT NOT NULL DEFAULT 'pending',
	`admin_notes` TEXT,
	`processed_at` INTEGER,
	`created_at` INTEGER NOT NULL,
	FOREIGN KEY(`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_user_social_links_user ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_links_platform ON user_social_links(platform);
CREATE INDEX IF NOT EXISTS idx_user_social_links_visibility ON user_social_links(is_visible);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_user ON biolink_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_date ON biolink_analytics(date);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_user_date ON biolink_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_karya_author ON karya(author_id);
CREATE INDEX IF NOT EXISTS idx_karya_status ON karya(status);
CREATE INDEX IF NOT EXISTS idx_karya_slug ON karya(slug);
CREATE INDEX IF NOT EXISTS idx_transactions_dompet ON transactions(dompet_id);
CREATE INDEX IF NOT EXISTS idx_topup_requests_user ON topup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_karya ON orders(karya_id);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_seller ON purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_user_hafalan_surah ON user_hafalan_quran(surah_id);
CREATE INDEX IF NOT EXISTS idx_user_progres_diniyah_pelajaran ON user_progres_diniyah(pelajaran_id);
SELECT 1; -- end
