-- Enhanced karya table with all necessary fields for content management
CREATE TABLE IF NOT EXISTS karya (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    content_type TEXT DEFAULT 'text',
    excerpt TEXT,
    status TEXT DEFAULT 'draft',
    slug TEXT,
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT,
    category TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    is_free INTEGER DEFAULT 0,
    file_url TEXT,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER,
    published_at INTEGER,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_karya_author ON karya(author_id);
CREATE INDEX IF NOT EXISTS idx_karya_status ON karya(status);
CREATE INDEX IF NOT EXISTS idx_karya_category ON karya(category);
CREATE INDEX IF NOT EXISTS idx_karya_created_at ON karya(created_at);
CREATE INDEX IF NOT EXISTS idx_karya_slug ON karya(slug);

-- Insert sample karya if empty (optional)
INSERT OR IGNORE INTO karya (
    id, author_id, title, description, content, content_type, 
    excerpt, status, slug, category, price, is_free, 
    view_count, download_count, reading_time, created_at, updated_at
) VALUES (
    'sample-karya-1',
    'sample-user-id',
    'Contoh Karya: Adab Menuntut Ilmu',
    'Panduan lengkap tentang adab dan etika dalam menuntut ilmu menurut ajaran Islam',
    '# Adab Menuntut Ilmu

Menuntut ilmu adalah kewajiban setiap muslim. Namun, dalam prosesnya, ada adab dan etika yang harus dijaga.

## 1. Niat yang Ikhlas

Niatkan menuntut ilmu karena Allah SWT, bukan untuk mencari popularitas atau materi.

## 2. Hormati Guru

Guru adalah penunjuk jalan menuju ilmu. Hormatilah beliau dengan sepenuh hati.

## 3. Konsisten dalam Belajar

Belajarlah secara konsisten, sedikit demi sedikit namun berkelanjutan.

---

*Wallahu a''lam bisshawab*',
    'text',
    'Panduan lengkap tentang adab dan etika dalam menuntut ilmu menurut ajaran Islam. Mencakup niat ikhlas, menghormati guru, dan konsistensi belajar.',
    'published',
    'adab-menuntut-ilmu',
    'Artikel Islami',
    0,
    1,
    125,
    8,
    5,
    1641024000,
    1641024000
);
