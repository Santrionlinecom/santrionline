-- Manual fix for biolink tables
-- Create the missing tables that are causing the errors

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

-- Add biolink columns to user table if they don't exist
ALTER TABLE user ADD COLUMN username TEXT;
ALTER TABLE user ADD COLUMN bio TEXT;
ALTER TABLE user ADD COLUMN is_public INTEGER DEFAULT 1;
ALTER TABLE user ADD COLUMN theme TEXT DEFAULT 'light';
ALTER TABLE user ADD COLUMN custom_domain TEXT;
