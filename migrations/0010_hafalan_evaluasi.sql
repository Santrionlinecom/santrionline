-- Migrasi 0010: Tabel evaluasi hafalan untuk menyimpan skor per surah
CREATE TABLE IF NOT EXISTS `hafalan_evaluasi` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `user_id` TEXT NOT NULL,
  `surah_id` INTEGER NOT NULL,
  `score` INTEGER NOT NULL,
  `notes` TEXT,
  `created_at` INTEGER NOT NULL,
  FOREIGN KEY(`user_id`) REFERENCES `pengguna`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY(`surah_id`) REFERENCES `quran_surah`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_hafalan_eval_user ON hafalan_evaluasi(user_id);
CREATE INDEX IF NOT EXISTS idx_hafalan_eval_user_surah ON hafalan_evaluasi(user_id, surah_id);
SELECT 1;
