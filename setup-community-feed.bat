@echo off
echo Setting up Community Feed database schema...

echo 1. Creating posts table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, author_id TEXT NOT NULL, content TEXT, created_at INTEGER NOT NULL, updated_at INTEGER, share_parent_id TEXT, FOREIGN KEY(author_id) REFERENCES pengguna(id), FOREIGN KEY(share_parent_id) REFERENCES posts(id));"

echo 2. Creating post_images table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS post_images (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, url TEXT NOT NULL, width INTEGER, height INTEGER, idx INTEGER DEFAULT 0, FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE);"

echo 3. Creating likes table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS likes (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(post_id, user_id), FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE);"

echo 4. Creating comments table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS comments (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, content TEXT NOT NULL, created_at INTEGER NOT NULL, FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE);"

echo 5. Creating indexes...
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_post_images_post ON post_images(post_id, idx);"

echo 6. Verifying table creation...
wrangler d1 execute inti-santri --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('posts', 'post_images', 'likes', 'comments');"

echo 7. Inserting dummy data...
wrangler d1 execute inti-santri --command="INSERT OR IGNORE INTO posts (id, author_id, content, created_at) VALUES ('post-1', 'admin', 'Selamat datang di komunitas SantriOnline! Mari berbagi dan belajar bersama 🤝', strftime('%%s', 'now') * 1000);" 

echo Community Feed setup complete!
pause
