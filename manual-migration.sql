-- Manual migration for Santri Online production database
-- This will create all necessary tables for biolink functionality

-- Create user_social_links table
CREATE TABLE IF NOT EXISTS user_social_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_visible INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Create biolink_analytics table  
CREATE TABLE IF NOT EXISTS biolink_analytics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  visitor_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Add username column to user table if not exists
-- Note: This might fail if column already exists, which is fine
-- ALTER TABLE user ADD COLUMN username TEXT;
-- ALTER TABLE user ADD COLUMN bio TEXT;
-- ALTER TABLE user ADD COLUMN is_public INTEGER DEFAULT 1;
-- ALTER TABLE user ADD COLUMN theme TEXT DEFAULT 'light';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_social_links_user ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_user ON biolink_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_biolink_analytics_date ON biolink_analytics(date);
