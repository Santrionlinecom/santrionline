@echo off
echo Creating missing database tables...

echo Creating karya table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS karya (id TEXT PRIMARY KEY, author_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT, price INTEGER NOT NULL, file_url TEXT, created_at INTEGER NOT NULL, content_type TEXT DEFAULT 'text', content TEXT, excerpt TEXT, status TEXT DEFAULT 'draft', slug TEXT, featured_image TEXT, seo_title TEXT, seo_description TEXT, seo_keywords TEXT, tags TEXT, category TEXT, published_at INTEGER, updated_at INTEGER, view_count INTEGER DEFAULT 0, download_count INTEGER DEFAULT 0, is_free INTEGER DEFAULT 0, reading_time INTEGER);"

echo Creating orders table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, buyer_id TEXT NOT NULL, karya_id TEXT NOT NULL, total_amount INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at INTEGER NOT NULL);"

echo Creating community_post table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS community_post (id TEXT PRIMARY KEY, author_id TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, created_at INTEGER NOT NULL);"

echo Creating post_comment table...
wrangler d1 execute santri-db --local --command="CREATE TABLE IF NOT EXISTS post_comment (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, author_id TEXT NOT NULL, content TEXT NOT NULL, created_at INTEGER NOT NULL);"

echo All missing tables created successfully!
pause
