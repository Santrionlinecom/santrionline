-- Add parentCommentId column to comments table
-- This migration adds support for nested comments/replies

-- Add the parent_comment_id column
ALTER TABLE comments ADD COLUMN parent_comment_id TEXT;

-- Add foreign key constraint (if your SQLite version supports it)
-- Note: SQLite in some versions doesn't support adding foreign keys after table creation
-- In that case, this constraint will be enforced at the application level

-- Create an index for better performance on parent comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Optional: Update any existing test data or seed data if needed
-- UPDATE comments SET parent_comment_id = NULL WHERE parent_comment_id IS NULL;
