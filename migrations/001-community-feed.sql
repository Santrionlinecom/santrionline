-- Migrasi untuk fitur komunitas feed
-- File: 001-community-feed.sql

-- 1. Update tabel posts untuk fitur feed (rename dari community_post ke posts)
DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  content TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  share_parent_id TEXT, -- nullable: post sumber share
  FOREIGN KEY(author_id) REFERENCES pengguna(id),
  FOREIGN KEY(share_parent_id) REFERENCES posts(id)
);

-- 2. Tabel gambar untuk posts
CREATE TABLE IF NOT EXISTS post_images (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  url TEXT NOT NULL,
  width INTEGER, 
  height INTEGER,
  idx INTEGER DEFAULT 0,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 3. Tabel likes
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(post_id, user_id),
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE
);

-- 4. Tabel comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES pengguna(id) ON DELETE CASCADE
);

-- 5. Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_images_post ON post_images(post_id, idx);

-- 6. Migrate data dari community_post ke posts (jika ada)
INSERT OR IGNORE INTO posts (id, author_id, content, created_at, updated_at)
SELECT id, authorId, content, 
       CAST(strftime('%s', datetime(createdAt/1000, 'unixepoch')) AS INTEGER) * 1000,
       CAST(strftime('%s', datetime(updatedAt/1000, 'unixepoch')) AS INTEGER) * 1000
FROM community_post;

-- 7. Migrate data dari post_like ke likes (jika ada)
INSERT OR IGNORE INTO likes (id, post_id, user_id, created_at)
SELECT id, postId, userId, 
       CAST(strftime('%s', datetime(createdAt/1000, 'unixepoch')) AS INTEGER) * 1000
FROM post_like;

-- 8. Migrate data dari post_comment ke comments (jika ada)
INSERT OR IGNORE INTO comments (id, post_id, user_id, content, created_at)
SELECT id, postId, authorId, content,
       CAST(strftime('%s', datetime(createdAt/1000, 'unixepoch')) AS INTEGER) * 1000
FROM post_comment;
