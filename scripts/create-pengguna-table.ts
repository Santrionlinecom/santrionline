import { execSync } from 'node:child_process';

// Quick script to create pengguna table directly
function run(cmd: string) {
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn(`⚠️  Error: ${error}`);
  }
}

const CREATE_PENGGUNA_SQL = `
CREATE TABLE IF NOT EXISTS pengguna (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'santri',
  created_at INTEGER NOT NULL,
  username TEXT,
  bio TEXT,
  is_public INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'light',
  custom_domain TEXT
);
CREATE INDEX IF NOT EXISTS idx_pengguna_email ON pengguna(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_username ON pengguna(username);
`;

console.log('Creating pengguna table directly...');
run(`wrangler d1 execute inti-santri --local --command "${CREATE_PENGGUNA_SQL.replace(/"/g, '\\"')}"`);

console.log('Verifying table creation...');
run(`wrangler d1 execute inti-santri --local --command "SELECT name FROM sqlite_master WHERE type='table' AND name='pengguna';"`);
