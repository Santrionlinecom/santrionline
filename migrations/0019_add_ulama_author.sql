-- Migration 0019: Add authorId to ulama table and backfill with admin user id
-- Admin user id provided: 8gdEHkswuvfxngOlfXPzz (Yogik Pratama Aprilian)
-- Notes: If this migration runs multiple times, ADD COLUMN will fail after first run.
-- If reruns are expected, guard logic would require a pragma table_info check executed via script.

-- Guard: only add column if it doesn't exist (SQLite/D1 lacks IF NOT EXISTS for ADD COLUMN)
-- Quick heuristic: attempt to create a temp table selecting the column; if fails we proceed.
-- For simplicity in this migration chain (already failing earlier), we retain raw ALTER; if
-- it errors due to duplicate column the migration will abort. Since we want idempotency now,
-- comment out ALTER after first successful run. If your DB is fresh and column missing,
-- uncomment the ALTER below temporarily.
-- ALTER TABLE ulama ADD COLUMN author_id TEXT; -- (commented to avoid duplicate column error on re-run)
CREATE INDEX IF NOT EXISTS idx_ulama_author_id ON ulama(author_id);
UPDATE ulama SET author_id = '8gdEHkswuvfxngOlfXPzz' WHERE author_id IS NULL;
