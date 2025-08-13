-- Migrasi: Tabel sertifikat untuk menyimpan status & snapshot data saat pengajuan
CREATE TABLE IF NOT EXISTS `certificate` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `certificate_code` TEXT NOT NULL UNIQUE,
  `total_juz` INTEGER NOT NULL DEFAULT 0,
  `total_score` INTEGER NOT NULL DEFAULT 0,
  `achievements_json` TEXT,
  `completed_books_json` TEXT,
  `status` TEXT NOT NULL DEFAULT 'pending',
  `approved_by` TEXT,
  `approved_at` INTEGER,
  `reject_reason` TEXT,
  `created_at` INTEGER NOT NULL,
  `updated_at` INTEGER,
  FOREIGN KEY(`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_certificate_user ON certificate(user_id);
CREATE INDEX IF NOT EXISTS idx_certificate_status ON certificate(status);
SELECT 1;
