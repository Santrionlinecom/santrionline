// Simple migration to add parent_comment_id to comments table
// Run this with: node update-comments-table.js

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateCommentsTable() {
  // Check for the database path
  const possiblePaths = [
    './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/1894c81af137d69097075d0399d1e4599353655ca7f60540edf147ec2272fabc.sqlite',
    './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/65fc24d0f92dc148f01ade05d21a3a15f8147f452c64d03e41dab09b2bfea19c.sqlite',
    './local.db',
    './database.db',
  ];

  let dbPath = null;
  for (const p of possiblePaths) {
    const fullPath = path.resolve(__dirname, p);
    if (fs.existsSync(fullPath)) {
      dbPath = fullPath;
      break;
    }
  }

  if (!dbPath) {
    console.log('❌ No database found. Please start the dev server first.');
    console.log('Looking for database at these paths:');
    possiblePaths.forEach((p) => console.log(`  - ${path.resolve(__dirname, p)}`));
    return;
  }

  console.log(`📀 Found database at: ${dbPath}`);

  try {
    const db = new Database(dbPath);

    // Check current schema
    const tableInfo = db.prepare('PRAGMA table_info(comments)').all();
    console.log('Current comments table schema:');
    tableInfo.forEach((col) => {
      console.log(
        `  ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`,
      );
    });

    // Check if parent_comment_id already exists
    const hasParentColumn = tableInfo.some((col) => col.name === 'parent_comment_id');

    if (hasParentColumn) {
      console.log('✅ parent_comment_id column already exists!');
    } else {
      console.log('🔄 Adding parent_comment_id column...');

      // Add the column
      db.exec('ALTER TABLE comments ADD COLUMN parent_comment_id TEXT;');

      // Create index for performance
      db.exec(
        'CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments(parent_comment_id);',
      );

      console.log('✅ Successfully added parent_comment_id column and index!');

      // Show updated schema
      const updatedTableInfo = db.prepare('PRAGMA table_info(comments)').all();
      console.log('Updated comments table schema:');
      updatedTableInfo.forEach((col) => {
        console.log(
          `  ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`,
        );
      });
    }

    db.close();
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Check if better-sqlite3 is available
try {
  await updateCommentsTable();
} catch (error) {
  console.log('❌ Migration failed. Error:', error.message);
  console.log('💡 Make sure better-sqlite3 is installed: npm install better-sqlite3');
}
