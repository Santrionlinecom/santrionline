-- Migration 0013 (revised): Ensure karya_audit table exists then add indexes
CREATE TABLE IF NOT EXISTS karya_audit (
	id TEXT PRIMARY KEY,
	karya_id TEXT NOT NULL,
	user_id TEXT,
	action TEXT NOT NULL, -- e.g. create/update/status/delete
	before_json TEXT,
	after_json TEXT,
	created_at INTEGER NOT NULL,
	FOREIGN KEY(karya_id) REFERENCES karya(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY(user_id) REFERENCES pengguna(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_karya_audit ON karya_audit (created_at);
CREATE INDEX IF NOT EXISTS idx_karya_audit_user ON karya_audit (user_id);
CREATE INDEX IF NOT EXISTS idx_karya_audit_karya ON karya_audit (karya_id);
CREATE INDEX IF NOT EXISTS idx_karya_audit_action ON karya_audit (action);
SELECT 1; -- end