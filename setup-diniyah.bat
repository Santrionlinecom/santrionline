@echo off
echo Setting up Diniyah tables in santri-db...

echo Creating diniyah_kitab table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS diniyah_kitab (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT);"

echo Creating diniyah_pelajaran table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS diniyah_pelajaran (id INTEGER PRIMARY KEY, kitab_id INTEGER NOT NULL, title TEXT NOT NULL, points INTEGER NOT NULL DEFAULT 0);"

echo Creating user_progres_diniyah table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user_progres_diniyah (user_id TEXT NOT NULL, pelajaran_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'not_started', completed_at INTEGER, PRIMARY KEY(user_id, pelajaran_id));"

echo Inserting kitab data...
wrangler d1 execute santri-db --command="INSERT OR IGNORE INTO diniyah_kitab (id, name, category, description) VALUES (1, 'Aqidatul Awam', 'Aqidah', 'Kitab dasar aqidah Ahlussunnah wal Jamaah');"

wrangler d1 execute santri-db --command="INSERT OR IGNORE INTO diniyah_kitab (id, name, category, description) VALUES (2, 'Hadits Arbain Nawawi', 'Hadits', '40 hadits pilihan Imam Nawawi');"

wrangler d1 execute santri-db --command="INSERT OR IGNORE INTO diniyah_kitab (id, name, category, description) VALUES (3, 'Safinatun Najah', 'Fiqih', 'Kitab fiqih dasar dalam mazhab Syafii');"

wrangler d1 execute santri-db --command="INSERT OR IGNORE INTO diniyah_kitab (id, name, category, description) VALUES (4, 'Bidayatul Hidayah', 'Tasawuf', 'Kitab tasawuf karya Imam Ghazali');"

echo Setup completed!
pause
