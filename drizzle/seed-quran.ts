// seed-quran.ts
import type { AppLoadContext } from '@remix-run/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';
import { getDb } from '../app/db/drizzle.server';
import { quran_surah } from '../app/db/schema';
import { allSurahs } from '../app/lib/quran-data';

function asRemixContext(env: { DB: D1Database }): AppLoadContext {
  return { cloudflare: { env } } as unknown as AppLoadContext;
}

export async function seedQuranSurahs(context: { env: { DB: D1Database } }) {
  const db = getDb(asRemixContext(context.env));

  console.log('🌱 Seeding Quran Surahs...');

  const surahsToInsert = allSurahs.map((s) => ({
    id: s.number,
    name: s.name,
    totalAyah: s.numberOfAyahs,
  }));

  try {
    for (const surah of surahsToInsert) {
      // Di Drizzle D1 biasanya pakai .run() (bukan .execute())
      await db.insert(quran_surah).values(surah).onConflictDoNothing().run?.();
    }
    console.log(`✅ Successfully seeded ${surahsToInsert.length} surahs`);
  } catch (error) {
    console.error('❌ Error seeding surahs:', error);
    throw error;
  }
}

export async function checkSurahsExist(context: { env: { DB: D1Database } }) {
  const db = getDb(asRemixContext(context.env));
  try {
    const result = await db.select().from(quran_surah).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking surahs:', error);
    return false;
  }
}
