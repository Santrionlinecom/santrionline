// Migration script to add parentCommentId column to comments table
// node add-parent-comment-migration.js
/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if better-sqlite3 is available
try {
  const { default: Database } = await import('better-sqlite3');

  const dbPath = path.join(
    __dirname,
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/65fc24d0f92dc148f01ade05d21a3a15f8147f452c64d03e41dab09b2bfea19c.sqlite',
  );

  if (!fs.existsSync(dbPath)) {
    console.log('Database file not found at:', dbPath);
    console.log('Please start the dev server first to create the local database.');
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  const db = new Database(dbPath);

  try {
    // Check if column already exists
    const tableInfo = db.prepare('PRAGMA table_info(comments)').all();
    const hasParentColumn = tableInfo.some((col) => col.name === 'parent_comment_id');

    if (hasParentColumn) {
      console.log('✅ parent_comment_id column already exists in comments table');
    } else {
      console.log('Adding parent_comment_id column to comments table...');

      // Add the column
      db.exec('ALTER TABLE comments ADD COLUMN parent_comment_id TEXT;');

      // Create index for performance
      db.exec(
        'CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);',
      );

      console.log('✅ Successfully added parent_comment_id column and index');
    }

    // Show current table structure
    console.log('\nCurrent comments table structure:');
    const updatedTableInfo = db.prepare('PRAGMA table_info(comments)').all();
    updatedTableInfo.forEach((col) => {
      console.log(
        `  ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`,
      );
    });
  } catch (error) {
    console.error('Migration error:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  } finally {
    db.close();
  }
} catch (err) {
  console.log('better-sqlite3 not available, trying alternative method...');
  console.log('Please install better-sqlite3: npm install better-sqlite3');
  console.log('Or run the dev server and use the drizzle migration instead.');
}
