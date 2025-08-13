-- Migration 0012 (revised): Ensure ulama related tables exist + soft delete column & index
-- Original intent: add deleted_at to ulama. Previous run failed because ulama table did not yet exist
-- (earlier creation migration file was empty). This revision makes the migration idempotent and
-- self-healing by creating the tables if they are missing with the latest structure (including deleted_at & author_id).

-- 1. Create ulama_category if missing
CREATE TABLE IF NOT EXISTS ulama_category (
	id TEXT PRIMARY KEY NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	description TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL
);

-- 2. Create ulama if missing (already includes deleted_at & author_id for forward compatibility)
CREATE TABLE IF NOT EXISTS ulama (
	id TEXT PRIMARY KEY NOT NULL,
	category_id TEXT NOT NULL,
	author_id TEXT,
	name TEXT NOT NULL,
	full_name TEXT,
	slug TEXT UNIQUE,
	birth TEXT,
	death TEXT,
	birth_place TEXT,
	biography TEXT,
	contribution TEXT,
	quote TEXT,
	image_url TEXT,
	references_json TEXT,
	period_century TEXT,
	search_index TEXT,
	created_at INTEGER NOT NULL,
	updated_at INTEGER,
	deleted_at INTEGER,
	FOREIGN KEY(category_id) REFERENCES ulama_category(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY(author_id) REFERENCES pengguna(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 3. Create ulama_work if missing
CREATE TABLE IF NOT EXISTS ulama_work (
	id TEXT PRIMARY KEY NOT NULL,
	ulama_id TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	FOREIGN KEY(ulama_id) REFERENCES ulama(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 4. Add deleted_at column if table pre-existed without it (best-effort; ignore failure if already present)
-- NOTE: SQLite lacks conditional ADD COLUMN; we skip to keep migration idempotent.
-- If you have an old table without deleted_at, add manually: ALTER TABLE ulama ADD COLUMN deleted_at INTEGER;

-- 5. Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_ulama_deleted_at ON ulama(deleted_at);
CREATE INDEX IF NOT EXISTS idx_ulama_category ON ulama(category_id);
CREATE INDEX IF NOT EXISTS idx_ulama_slug ON ulama(slug);
CREATE INDEX IF NOT EXISTS idx_ulama_author_id ON ulama(author_id);
CREATE INDEX IF NOT EXISTS idx_ulama_work_ulama ON ulama_work(ulama_id);

SELECT 1; -- end
