#!/usr/bin/env node

// Verification script to confirm D1 database binding and schema alignment
import { execSync } from 'node:child_process';

console.log('🔍 D1 Database Verification\n');

// Check remote tables
console.log('📊 Remote Database Tables:');
try {
  execSync('wrangler d1 execute inti-santri --remote --command "SELECT name FROM sqlite_master WHERE type=\'table\';"', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error checking remote tables:', error.message);
}

console.log('\n📋 Remote pengguna Table Structure:');
try {
  execSync('wrangler d1 execute inti-santri --remote --command "PRAGMA table_info(pengguna);"', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error checking pengguna structure:', error.message);
}

console.log('\n🔢 Total records in pengguna table:');
try {
  execSync('wrangler d1 execute inti-santri --remote --command "SELECT COUNT(*) as total_users FROM pengguna;"', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error counting records:', error.message);
}

console.log('\n✅ Verification complete!');
console.log('📝 Next steps:');
console.log('1. Test registration at http://localhost:8787/daftar');
console.log('2. Check Cloudflare D1 Studio dashboard');
console.log('3. Verify no more "updated_at" column errors');
