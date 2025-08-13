-- Biolink Migration for Production Database
-- Adding biolink columns to existing user table

-- Add biolink columns to user table (ignore errors if already exist)
ALTER TABLE user ADD COLUMN username TEXT;
ALTER TABLE user ADD COLUMN bio TEXT;
ALTER TABLE user ADD COLUMN is_public INTEGER DEFAULT 1;
ALTER TABLE user ADD COLUMN theme TEXT DEFAULT 'light';
ALTER TABLE user ADD COLUMN custom_domain TEXT;

-- Create unique index for username
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username_unique ON user(username);

-- Create user_social_links table
CREATE TABLE IF NOT EXISTS user_social_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK(platform IN ('tiktok', 'facebook', 'instagram', 'youtube', 'twitter', 'tokopedia', 'shopee', 'whatsapp', 'telegram', 'linkedin', 'github', 'website')),
  url TEXT NOT NULL,
  is_visible INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create biolink_analytics table
CREATE TABLE IF NOT EXISTS biolink_analytics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  visitor_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_links_user ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON user_social_links(platform);
CREATE INDEX IF NOT EXISTS idx_social_links_visible ON user_social_links(is_visible);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_user ON biolink_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_date ON biolink_analytics(date);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_user_date ON biolink_analytics(user_id, date);

-- Insert sample data for testing
-- INSERT OR IGNORE INTO user_social_links (id, user_id, platform, url, is_visible, display_order, created_at)
-- SELECT 'sample_1', id, 'instagram', 'https://instagram.com/santrionline', 1, 1, strftime('%s', 'now')
-- FROM user LIMIT 1;
