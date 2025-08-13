import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Apply all .sql migrations in ./migrations to the local D1 (development) database sequentially.
// Usage: npm run db:apply-all

const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');

function run(cmd: string) {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn(`⚠️  Command failed but continuing: ${error}`);
  }
}

function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql') && !f.startsWith('meta'))
    .sort((a, b) => a.localeCompare(b));

  if (!files.length) {
    console.log('No migration files found.');
    return;
  }

  console.log('Applying migrations to local D1 (binding DB)...');
  console.log('Files:');
  files.forEach(f => console.log(' -', f));

  for (const file of files) {
    const full = path.join(MIGRATIONS_DIR, file);
    // Quick existence / size check
    const content = readFileSync(full, 'utf8');
    if (!content.trim()) {
      console.log(`Skipping empty file ${file}`);
      continue;
    }
    run(`wrangler d1 execute inti-santri --local --file="${full}"`);
  }

  console.log('\nAll migrations executed.');
}

main();
