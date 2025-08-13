@echo off
echo Setting up full database schema for santri-db...

echo Creating user table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, avatar_url TEXT, role TEXT NOT NULL DEFAULT 'santri', created_at INTEGER NOT NULL, username TEXT UNIQUE, bio TEXT, is_public INTEGER DEFAULT 1, theme TEXT DEFAULT 'light', custom_domain TEXT);"

echo Creating quran_surah table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS quran_surah (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, total_ayah INTEGER NOT NULL);"

echo Creating user_hafalan_quran table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user_hafalan_quran (user_id TEXT NOT NULL, surah_id INTEGER NOT NULL, completed_ayah INTEGER DEFAULT 0 NOT NULL, PRIMARY KEY(user_id, surah_id));"

echo Creating diniyah_kitab table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS diniyah_kitab (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT);"

echo Creating diniyah_pelajaran table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS diniyah_pelajaran (id INTEGER PRIMARY KEY, kitab_id INTEGER NOT NULL, title TEXT NOT NULL, points INTEGER NOT NULL DEFAULT 0);"

echo Creating user_progres_diniyah table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user_progres_diniyah (user_id TEXT NOT NULL, pelajaran_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'not_started', completed_at INTEGER, PRIMARY KEY(user_id, pelajaran_id));"

echo Creating biolink tables...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user_social_links (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, platform TEXT NOT NULL, url TEXT NOT NULL, is_visible INTEGER DEFAULT 1, display_order INTEGER DEFAULT 0, created_at INTEGER NOT NULL);"

wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS biolink_analytics (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, visitor_count INTEGER DEFAULT 0, click_count INTEGER DEFAULT 0, date TEXT NOT NULL, created_at INTEGER NOT NULL);"

echo Creating dompet tables...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS dompet_santri (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, dincoin_balance INTEGER NOT NULL DEFAULT 0, dircoin_balance INTEGER NOT NULL DEFAULT 0);"

wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS transaction (id TEXT PRIMARY KEY, dompet_id TEXT NOT NULL, amount INTEGER NOT NULL, type TEXT NOT NULL, currency TEXT NOT NULL, description TEXT, created_at INTEGER NOT NULL);"

echo All tables created successfully!
echo Now you can run your application.
pause
