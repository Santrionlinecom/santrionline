import { execSync } from 'node:child_process';

// Script to align pengguna table with current schema
function run(cmd: string, description: string) {
  console.log(`\n🔧 ${description}`);
  console.log(`> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn(`⚠️  ${error}`);
  }
}

const commands = [
  // Add missing columns to pengguna table
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN updated_at INTEGER;"`,
    desc: 'Adding updated_at column'
  },
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN phone TEXT;"`,
    desc: 'Adding phone column'
  },
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN address TEXT;"`,
    desc: 'Adding address column'
  },
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN date_of_birth TEXT;"`,
    desc: 'Adding date_of_birth column'
  },
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN education TEXT;"`,
    desc: 'Adding education column'
  },
  {
    cmd: `wrangler d1 execute inti-santri --local --command "ALTER TABLE pengguna ADD COLUMN institution TEXT;"`,
    desc: 'Adding institution column'
  },
  // Verify table structure
  {
    cmd: `wrangler d1 execute inti-santri --local --command "PRAGMA table_info(pengguna);"`,
    desc: 'Verifying pengguna table structure'
  }
];

console.log('🚀 Updating pengguna table to match schema...');

commands.forEach(({ cmd, desc }) => {
  run(cmd, desc);
});

console.log('\n✅ Schema alignment complete!');
