import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

console.log('🔍 Checking database setup...');

// Check if the local database file exists
const dbPath =
  './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/65fc24d0f92dc148f01ade05d21a3a15f8147f452c64d03e41dab09b2bfea19c.sqlite';

if (fs.existsSync(dbPath)) {
  console.log('✅ Local database file exists');

  // Check file size
  const stats = fs.statSync(dbPath);
  console.log(`📊 Database size: ${stats.size} bytes`);

  if (stats.size === 0) {
    console.log('⚠️  Database file is empty - this might be the issue');
  }
} else {
  console.log('❌ Local database file does not exist');
  console.log('📁 Database should be at:', dbPath);
}

// Check if migration files exist
const migrationFiles = ['fix-biolink-tables.sql', 'migrations/0004_biolink_features.sql'];

migrationFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ Migration file exists: ${file}`);
  } else {
    console.log(`❌ Migration file missing: ${file}`);
  }
});

console.log('🔧 Database check complete.');
