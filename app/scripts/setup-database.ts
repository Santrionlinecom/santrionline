import { allSurahs } from '../lib/quran-data';

// Manual database setup script
export async function setupDatabase(db: D1Database) {
  console.log('🔧 Setting up database...');

  try {
    // 1. Create user table if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT NOT NULL DEFAULT 'santri',
        created_at INTEGER NOT NULL,
        username TEXT UNIQUE,
        bio TEXT,
        is_public INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'light',
        custom_domain TEXT
      );
    `);

    // 2. Create quran_surah table if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS quran_surah (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        total_ayah INTEGER NOT NULL
      );
    `);

    // 3. Create other essential tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_hafalan_quran (
        user_id TEXT NOT NULL,
        surah_id INTEGER NOT NULL,
        completed_ayah INTEGER DEFAULT 0 NOT NULL,
        PRIMARY KEY(user_id, surah_id),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (surah_id) REFERENCES quran_surah(id)
      );
    `);

    // 4. Insert all quran surahs
    console.log('📖 Seeding Quran surahs...');
    for (const surah of allSurahs) {
      await db
        .prepare('INSERT OR IGNORE INTO quran_surah (id, name, total_ayah) VALUES (?, ?, ?)')
        .bind(surah.number, surah.name, surah.numberOfAyahs)
        .run();
    }

    console.log('✅ Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

// For command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Direct execution not supported. Use from app code.');
}
