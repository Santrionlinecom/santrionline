-- Create karya table
CREATE TABLE IF NOT EXISTS karya (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    file_url TEXT,
    created_at INTEGER NOT NULL,
    content_type TEXT DEFAULT 'text',
    content TEXT,
    excerpt TEXT,
    status TEXT DEFAULT 'draft',
    slug TEXT,
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT,
    category TEXT,
    published_at INTEGER,
    updated_at INTEGER,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_free INTEGER DEFAULT 0,
    reading_time INTEGER,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    karya_id TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES user(id),
    FOREIGN KEY (karya_id) REFERENCES karya(id)
);

-- Create community tables if they don't exist
CREATE TABLE IF NOT EXISTS community_post (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS post_comment (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES community_post(id),
    FOREIGN KEY (author_id) REFERENCES user(id)
);
