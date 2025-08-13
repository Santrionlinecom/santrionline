@echo off
echo Checking and creating essential tables...

echo Creating user table...
wrangler d1 execute santri-db --command="CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, password_hash TEXT, avatar_url TEXT, role TEXT DEFAULT 'santri', created_at INTEGER, username TEXT UNIQUE, bio TEXT, is_public INTEGER DEFAULT 1, theme TEXT DEFAULT 'light', custom_domain TEXT);"

echo Checking if user table exists...
wrangler d1 execute santri-db --command="INSERT OR IGNORE INTO user (id, name, email, password_hash, created_at, role) VALUES ('test123', 'Test User', 'test@example.com', 'hash', 1640995200000, 'santri');"

echo Deleting test user...
wrangler d1 execute santri-db --command="DELETE FROM user WHERE id = 'test123';"

echo User table setup complete!
pause
