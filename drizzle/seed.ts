import { allSurahs } from '../app/lib/quran-data';
import fs from 'fs';
import path from 'path';

console.log('🌱 Generating seed SQL script...');

const statements = allSurahs.map(surah => {
  // Menghindari error karena ada tanda kutip (') di dalam nama, seperti pada "Ali 'Imran"
  const escapedName = surah.name.replace(/'/g, "''");
  
  // PERBAIKAN: Mengganti 'totalAyah' menjadi 'total_ayah' agar sesuai dengan skema Anda
  return `INSERT INTO quran_surah (id, name, total_ayah) VALUES (${surah.number}, '${escapedName}', ${surah.numberOfAyahs}) ON CONFLICT(id) DO NOTHING;`;
});

const sqlScript = `
-- =================================================================
--  Seed data untuk tabel quran_surah
--  Dihasilkan secara otomatis oleh drizzle/seed.ts
-- =================================================================
${statements.join('\n')}
`;

// Tentukan lokasi output file
const outputPath = path.join(process.cwd(), 'drizzle', 'seed.sql');

// Pastikan folder 'drizzle' ada
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// Tulis file seed.sql
fs.writeFileSync(outputPath, sqlScript);

console.log(`✅ SQL seed file generated successfully at: ${outputPath}`);
