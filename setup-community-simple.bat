@echo off
echo ====================================
echo   Setup Community Feed Database
echo ====================================
echo.

echo Checking database connection...
wrangler d1 execute inti-santri --command="SELECT 1;"

echo.
echo Creating community tables...

echo [1/6] Creating posts table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, author_id TEXT NOT NULL, content TEXT, created_at INTEGER NOT NULL, updated_at INTEGER, share_parent_id TEXT);"

echo [2/6] Creating post_images table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS post_images (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, url TEXT NOT NULL, width INTEGER, height INTEGER, idx INTEGER DEFAULT 0);"

echo [3/6] Creating likes table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS likes (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(post_id, user_id));"

echo [4/6] Creating comments table...
wrangler d1 execute inti-santri --command="CREATE TABLE IF NOT EXISTS comments (id TEXT PRIMARY KEY, post_id TEXT NOT NULL, user_id TEXT NOT NULL, content TEXT NOT NULL, created_at INTEGER NOT NULL);"

echo [5/6] Creating indexes...
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);"
wrangler d1 execute inti-santri --command="CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);"

echo [6/6] Adding sample data...
wrangler d1 execute inti-santri --command="INSERT OR IGNORE INTO posts (id, author_id, content, created_at) VALUES ('sample-post-1', 'admin', 'Welcome to SantriOnline Community! 🌟', strftime('%%s', 'now') * 1000);"

echo.
echo Verifying setup...
wrangler d1 execute inti-santri --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('posts', 'post_images', 'likes', 'comments');"

echo.
echo ====================================
echo   Community Feed Setup Complete!
echo ====================================
echo.
echo You can now access:
echo - Community Feed: http://localhost:5173/community
echo - Dashboard: http://localhost:5173/dashboard/komunitas
echo.
pause
