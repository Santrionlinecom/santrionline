-- Migration 0011: Karya audit + indexes + events table
-- Date: 2025-08-09

-- 1. Add columns if not exists (D1/SQLite doesn’t support IF NOT EXISTS on ALTER COLUMN directly)
-- Strategy: create temp table or attempt ALTER inside try (manual). Provide raw statements; run selectively.

-- NOTE (2025-08-09): The two ALTER TABLE statements that originally added
-- last_status_changed_at and deleted_at have been removed because the columns
-- already exist in current environments. Re‑running this migration caused
-- 'duplicate column name' errors and aborted before indexes/events were created.
-- If (in a brand new database) these columns are still missing, add them manually:
--   ALTER TABLE karya ADD COLUMN last_status_changed_at INTEGER; -- timestamp
--   ALTER TABLE karya ADD COLUMN deleted_at INTEGER;              -- timestamp
-- Then re-run this file (without the ALTERs) to create indexes & events table.

-- 2. Create indexes (ignore errors if already exist)
CREATE INDEX IF NOT EXISTS idx_karya_status_deleted_author ON karya(status, deleted_at, author_id);
CREATE INDEX IF NOT EXISTS idx_karya_slug ON karya(slug);

-- 3. Events table
CREATE TABLE IF NOT EXISTS karya_events (
  id TEXT PRIMARY KEY,
  karya_id TEXT NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_karya_events_created_at ON karya_events(created_at);
CREATE INDEX IF NOT EXISTS idx_karya_events_karya_id ON karya_events(karya_id);

-- 4. Backfill last_status_changed_at for existing rows
UPDATE karya SET last_status_changed_at = COALESCE(published_at, updated_at, created_at) WHERE last_status_changed_at IS NULL;
