-- Schema untuk fitur sertifikat dan raport
-- Menambahkan tabel untuk menyimpan informasi sertifikat santri

-- Tabel untuk menyimpan data sertifikat
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    certificate_type TEXT NOT NULL, -- '1_juz', '5_juz', '10_juz', 'hafidz'
    total_juz INTEGER NOT NULL,
    total_score REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    requested_date TEXT NOT NULL,
    approved_date TEXT,
    approved_by TEXT, -- admin user_id yang menyetujui
    rejection_reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel untuk menyimpan pencapaian hafalan dan pembelajaran
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'hafalan', 'kitab', 'ujian'
    target TEXT NOT NULL, -- 'Juz 1', 'Tajwid Dasar', etc
    score INTEGER NOT NULL, -- 0-100
    completed_date TEXT NOT NULL,
    verified_by TEXT, -- mentor/admin yang memverifikasi
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel untuk menyimpan kitab/pembelajaran yang diselesaikan
CREATE TABLE IF NOT EXISTS completed_books (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_name TEXT NOT NULL,
    book_category TEXT NOT NULL, -- 'quran', 'tajwid', 'fiqh', 'akhlak', etc
    completion_date TEXT NOT NULL,
    final_score INTEGER,
    certified_by TEXT, -- mentor yang mensertifikasi
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (certified_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, book_name) -- Mencegah duplikasi kitab yang sama
);

-- Tabel untuk menyimpan riwayat download sertifikat
CREATE TABLE IF NOT EXISTS certificate_downloads (
    id TEXT PRIMARY KEY,
    certificate_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    download_type TEXT NOT NULL, -- 'digital', 'physical'
    download_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index untuk performance
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_completed_books_user_id ON completed_books(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_books_category ON completed_books(book_category);

-- View untuk mendapatkan summary data santri
CREATE VIEW IF NOT EXISTS santri_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(CASE WHEN a.type = 'hafalan' THEN 1 END) as total_juz_hafalan,
    COUNT(DISTINCT cb.id) as total_books_completed,
    ROUND(AVG(a.score), 2) as average_score,
    MAX(a.completed_date) as last_achievement_date,
    (SELECT COUNT(*) FROM certificates c WHERE c.user_id = u.id AND c.status = 'approved') as approved_certificates,
    (SELECT COUNT(*) FROM certificates c WHERE c.user_id = u.id AND c.status = 'pending') as pending_certificates
FROM users u
LEFT JOIN achievements a ON u.id = a.user_id
LEFT JOIN completed_books cb ON u.id = cb.user_id
WHERE u.role = 'santri'
GROUP BY u.id, u.username, u.email;

-- Trigger untuk update timestamp
CREATE TRIGGER IF NOT EXISTS update_certificates_timestamp 
    AFTER UPDATE ON certificates
    FOR EACH ROW
BEGIN
    UPDATE certificates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert sample data untuk testing
INSERT OR IGNORE INTO achievements (id, user_id, type, target, score, completed_date, verified_by) VALUES
('ach_001', 'user_001', 'hafalan', 'Juz 1', 95, '2024-01-15', 'admin_001'),
('ach_002', 'user_001', 'hafalan', 'Juz 2', 92, '2024-02-20', 'admin_001'),
('ach_003', 'user_001', 'hafalan', 'Juz 3', 94, '2024-03-25', 'admin_001'),
('ach_004', 'user_001', 'hafalan', 'Juz 4', 96, '2024-05-10', 'admin_001'),
('ach_005', 'user_001', 'hafalan', 'Juz 5', 98, '2024-06-15', 'admin_001'),
('ach_006', 'user_001', 'kitab', 'Tajwid Dasar', 89, '2024-04-01', 'admin_001');

INSERT OR IGNORE INTO completed_books (id, user_id, book_name, book_category, completion_date, final_score, certified_by) VALUES
('book_001', 'user_001', 'Iqro 1-6', 'quran_basic', '2024-01-01', 90, 'admin_001'),
('book_002', 'user_001', 'Al-Qur\'an Juz 1-5', 'quran', '2024-06-15', 95, 'admin_001'),
('book_003', 'user_001', 'Tajwid Dasar', 'tajwid', '2024-04-01', 89, 'admin_001');

INSERT OR IGNORE INTO certificates (id, user_id, certificate_type, total_juz, total_score, status, requested_date, approved_date, approved_by) VALUES
('cert_001', 'user_001', '5_juz', 5, 95.8, 'approved', '2024-07-01', '2024-08-01', 'admin_001');
