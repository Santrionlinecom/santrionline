import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the local D1 database
const dbPath = path.join(__dirname, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/65fc24d0f92dc148f01ade05d21a3a15f8147f452c64d03e41dab09b2bfea19c.sqlite');

console.log('🔍 Checking database path:', dbPath);

try {
  const db = new Database(dbPath);
  
  console.log('✅ Connected to database');
  
  // Check if topup_requests table exists
  const topupTableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='topup_requests'
  `).get();
  
  if (topupTableExists) {
    console.log('✅ topup_requests table already exists');
  } else {
    console.log('❌ topup_requests table does not exist, creating...');
    
    // Create the table
    db.exec(`
      CREATE TABLE IF NOT EXISTS topup_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL CHECK (currency IN ('dincoin', 'dircoin')),
        transfer_amount INTEGER,
        payment_method TEXT NOT NULL,
        bank_account TEXT,
        whatsapp_number TEXT,
        payment_proof TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        admin_notes TEXT,
        processed_at INTEGER,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user (id)
      );
    `);
    
    console.log('✅ topup_requests table created successfully');
  }

  // Check if purchases table exists
  const purchasesTableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='purchases'
  `).get();
  
  if (purchasesTableExists) {
    console.log('✅ purchases table already exists');
  } else {
    console.log('❌ purchases table does not exist, creating...');
    
    // Create the purchases table
    db.exec(`
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        buyer_id TEXT NOT NULL,
        seller_id TEXT NOT NULL,
        karya_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL CHECK (currency IN ('dincoin', 'dircoin')),
        platform_fee INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at INTEGER NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES user (id),
        FOREIGN KEY (seller_id) REFERENCES user (id),
        FOREIGN KEY (karya_id) REFERENCES karya (id)
      );
    `);
    
    console.log('✅ purchases table created successfully');
  }
  
  // List all tables to verify
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 All tables in database:');
  tables.forEach(table => console.log(`  - ${table.name}`));
  
  db.close();
  console.log('✅ Database connection closed');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Trying to install better-sqlite3...');
}
