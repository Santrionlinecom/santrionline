import { useMemo } from 'react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link, useSearchParams } from '@remix-run/react';
import { eq, and, sql, asc, inArray, type SQL } from 'drizzle-orm';
import { getDb } from '~/db/drizzle.server';
import { ulama, ulama_category, ulama_work, user } from '~/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import {
  BookOpen,
  Calendar,
  MapPin,
  Star,
  User,
  Scroll,
  Heart,
  GraduationCap,
  Filter,
  Search,
  X,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Biografi Ulama Ahli Sunnah wal Jamaah - Santri Online' },
    {
      name: 'description',
      content:
        'Pelajari biografi dan karya ulama besar Ahli Sunnah wal Jamaah dari 4 madzhab fiqih dan para imam tasawuf. Mengenal sejarah dan pemikiran para salafus shalih.',
    },
    {
      name: 'keywords',
      content:
        'biografi ulama, ahli sunnah wal jamaah, imam 4 madzhab, imam hanafi, imam maliki, imam syafii, imam hanbali, tasawuf, ulama salaf',
    },
  ];
};

interface UlamaDisplay {
  id: string;
  categoryId: string;
  name: string;
  fullName?: string | null;
  slug?: string | null;
  birth?: string | null;
  death?: string | null;
  birthPlace?: string | null;
  biography?: string | null;
  contribution?: string | null;
  quote?: string | null;
  periodCentury?: string | null;
  authorId?: string | null;
  authorName?: string;
  majorWorks: string[];
  category: string; // slug
}

const UlamaCard = ({ ulama, category }: { ulama: UlamaDisplay; category: string }) => (
  <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 group">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link to={`/biografi-ulama/${ulama.id}`} prefetch="intent">
            <CardTitle className="text-lg font-bold mb-2 group-hover:text-primary transition-colors underline-offset-4 hover:underline">
              {ulama.name}
            </CardTitle>
          </Link>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {ulama.authorName && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="w-3 h-3 mr-1" /> Ditambahkan oleh {ulama.authorName}
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {ulama.birth} - {ulama.death}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {ulama.birthPlace}
            </div>
          </div>
        </div>
        <div className="ml-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{ulama.biography || ''}</p>

        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Scroll className="w-4 h-4 mr-1" />
            Karya Utama:
          </h4>
          <ul className="space-y-1">
            {ulama.majorWorks.map((work: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="w-1 h-1 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                {work}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Kontribusi:
          </h4>
          <p className="text-sm text-muted-foreground">{ulama.contribution || ''}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

type UlamaRow = typeof ulama.$inferSelect;
type UlamaWorkRow = typeof ulama_work.$inferSelect;

export async function loader({ context, request }: LoaderFunctionArgs) {
  try {
    const db = getDb(context);
    const { ensureMigrated } = await import('~/db/autoMigrate.server');
    await ensureMigrated(context);
    const ADMIN_ID = '8gdEHkswuvfxngOlfXPzz';
    // Ensure admin user exists (non-fatal if missing)
    try {
      const adminUser = await db.get(sql`SELECT id FROM pengguna WHERE id = ${ADMIN_ID}`);
      if (!adminUser) {
        // Optional: could auto-create minimal admin; for safety just log
        console.warn(
          'ADMIN_ID user not found; ulama.author_id will still be set but name will be empty',
        );
      }
    } catch (e) {
      console.warn('Failed to verify admin user', e);
    }
    // Basic migration readiness checks (presence of key tables)
    for (const table of ['ulama', 'ulama_category', 'ulama_work']) {
      try {
        await db.get(sql`SELECT name FROM sqlite_master WHERE type='table' AND name=${table}`);
      } catch {
        throw new Error(`Database not migrated: missing table ${table}`);
      }
    }
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const perPageRaw = parseInt(url.searchParams.get('perPage') || '12');
    const perPage = Math.min(48, Math.max(3, perPageRaw));
    const catSlug = url.searchParams.get('cat') || 'semua';
    const searchQuery = url.searchParams.get('q') || '';

    // Seed categories if empty
    const categories = await db.select().from(ulama_category);
    if (categories.length === 0) {
      const now = new Date();
      const seedCategories = [
        { id: 'cat_hanafi', slug: 'hanafi', name: 'Madzhab Hanafi', sortOrder: 1 },
        { id: 'cat_maliki', slug: 'maliki', name: 'Madzhab Maliki', sortOrder: 2 },
        { id: 'cat_syafii', slug: 'syafii', name: "Madzhab Syafi'i", sortOrder: 3 },
        { id: 'cat_hanbali', slug: 'hanbali', name: 'Madzhab Hanbali', sortOrder: 4 },
        { id: 'cat_tasawuf', slug: 'tasawuf', name: 'Imam Tasawuf & Thariqah', sortOrder: 5 },
        { id: 'cat_aqidah', slug: 'aqidah', name: 'Ulama Aqidah', sortOrder: 6 },
        { id: 'cat_thariqah', slug: 'thariqah', name: 'Masyayikh Thariqah', sortOrder: 7 },
      ].map((c) => ({ ...c, createdAt: now }));
      await db.insert(ulama_category).values(seedCategories);
    }

    // Seed ulama if empty
    const ulamaCount = await db.select({ count: ulama.id }).from(ulama);
    if (ulamaCount.length === 0) {
      const now = new Date();
      const seedUlama = [
        {
          id: 'u_abu_hanifah',
          categoryId: 'cat_hanafi',
          name: 'Imam Abu Hanifah',
          fullName: "Nu'man bin Tsabit bin Zuta",
          slug: 'imam-abu-hanifah',
          birth: '80 H',
          death: '150 H',
          birthPlace: 'Kufah, Irak',
          biography: 'Pendiri madzhab Hanafi dengan metodologi qiyas dan istihsan yang kuat.',
          contribution: "Meletakkan dasar fiqih ra'y yang terukur.",
          quote:
            'Seandainya ilmu itu diangkat ke bintang Tsurayya, niscaya akan diambil oleh lelaki dari Persia.',
          periodCentury: '2H',
          referencesJson: JSON.stringify(['Al-Fiqh Al-Akbar', 'Tarikh Baghdad']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_malik',
          categoryId: 'cat_maliki',
          name: 'Imam Malik',
          fullName: 'Malik bin Anas',
          slug: 'imam-malik',
          birth: '93 H',
          death: '179 H',
          birthPlace: 'Madinah',
          biography: "Penyusun Al-Muwatha' dan imam Darul Hijrah.",
          contribution: 'Amal Ahlul Madinah sebagai hujjah.',
          quote: 'Ilmu bukanlah banyaknya riwayat, tetapi cahaya yang Allah letakkan di hati.',
          periodCentury: '2H',
          referencesJson: JSON.stringify(["Al-Muwatha'", 'Tadzkiratul Huffazh']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_syafii',
          categoryId: 'cat_syafii',
          name: "Imam Asy-Syafi'i",
          fullName: 'Muhammad bin Idris',
          slug: 'imam-asy-syafii',
          birth: '150 H',
          death: '204 H',
          birthPlace: 'Gaza',
          biography: 'Peletak dasar ushul fiqih melalui Ar-Risalah.',
          contribution: "Sintesis metode hadits & ra'y.",
          quote: 'Barangsiapa mempelajari fiqih tanpa hadits, ia seperti pedagang tanpa timbangan.',
          periodCentury: '3H',
          referencesJson: JSON.stringify(['Ar-Risalah', 'Manaqib Asy-Syafii']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_ahmad',
          categoryId: 'cat_hanbali',
          name: 'Imam Ahmad bin Hanbal',
          fullName: 'Ahmad bin Muhammad',
          slug: 'imam-ahmad-bin-hanbal',
          birth: '164 H',
          death: '241 H',
          birthPlace: 'Baghdad',
          biography: 'Imam hadits dan penjaga sunnah saat mihnah.',
          contribution: 'Musnad besar & keteguhan aqidah.',
          quote: 'Al-Ilmu laisa bisurati ar-riwayah, innamal ilmu khosyah.',
          periodCentury: '3H',
          referencesJson: JSON.stringify(['Musnad Ahmad', 'Siyar Alam An-Nubala']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_ghazali',
          categoryId: 'cat_tasawuf',
          name: 'Imam Al-Ghazali',
          fullName: 'Abu Hamid Muhammad',
          slug: 'imam-al-ghazali',
          birth: '450 H',
          death: '505 H',
          birthPlace: 'Thus',
          biography: 'Hujjatul Islam yang memadukan syariah & tasawuf.',
          contribution: "Ihy' Ulumuddin & reform tasawuf Sunni.",
          quote: 'Lidahmu adalah singa, jika kau lepaskan ia akan menerkammu.',
          periodCentury: '5H',
          referencesJson: JSON.stringify(['Ihya Ulumuddin', 'Al-Munqidz']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_qadir',
          categoryId: 'cat_tasawuf',
          name: 'Syaikh Abdul Qadir Al-Jailani',
          fullName: 'Abdul Qadir bin Abi Shalih',
          slug: 'syaikh-abdul-qadir-al-jailani',
          birth: '471 H',
          death: '561 H',
          birthPlace: 'Jilan',
          biography: 'Masyayikh besar pendiri Thariqah Qadiriyyah.',
          contribution: 'Menjaga tasawuf berbasis syariah.',
          quote: 'Bersihkan hati dengan dzikir dan keikhlasan.',
          periodCentury: '6H',
          referencesJson: JSON.stringify(['Al-Ghunyah', 'Futuh Al-Ghaib']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_bahauddin',
          categoryId: 'cat_thariqah',
          name: 'Syaikh Bahauddin Naqsyaband',
          fullName: 'Bahauddin Muhammad Uways Al-Bukhari',
          slug: 'syaikh-bahauddin-naqsyaband',
          birth: '717 H',
          death: '791 H',
          birthPlace: 'Bukhara',
          biography: 'Pendiri Thariqah Naqsyabandiyyah yang menekankan khalwat dar anjuman.',
          contribution: 'Prinsip tasawuf sunni: hosh dar dam, nazar bar qadam.',
          quote: 'Jadilah hadir bersama Allah di tengah manusia.',
          periodCentury: '8H',
          referencesJson: JSON.stringify(['Maqamat Naqsyaband', 'Rashahat']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_asyari',
          categoryId: 'cat_aqidah',
          name: "Imam Al-Ash'ari",
          fullName: 'Abu Al-Hasan Ali',
          slug: 'imam-al-asyari',
          birth: '260 H',
          death: '324 H',
          birthPlace: 'Basrah',
          biography: "Pendiri madzhab Asy'ariyyah setelah rujuk dari Mu'tazilah.",
          contribution: 'Metodologi kalam membela aqidah Ahlussunnah.',
          quote: "Aku keluar dari madzhab Mu'tazilah seperti aku menanggalkan bajuku ini.",
          periodCentury: '4H',
          referencesJson: JSON.stringify(['Al-Ibanah', 'Maqalat']),
          authorId: ADMIN_ID,
        },
        {
          id: 'u_maturidi',
          categoryId: 'cat_aqidah',
          name: 'Imam Al-Maturidi',
          fullName: 'Abu Mansur Muhammad',
          slug: 'imam-al-maturidi',
          birth: '238 H',
          death: '333 H',
          birthPlace: 'Samarkand',
          biography: 'Pendiri madzhab Maturidiyyah moderat.',
          contribution: 'Keseimbangan dalil naqli & aqli.',
          quote: 'Akal adalah anugerah untuk memahami wahyu, bukan menentangnya.',
          periodCentury: '4H',
          referencesJson: JSON.stringify(['Kitab At-Tawhid', "Ta'wilat"]),
          authorId: ADMIN_ID,
        },
      ].map((u) => ({
        ...u,
        searchIndex: [u.name, u.fullName, u.biography, u.contribution]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
        createdAt: now,
      }));
      await db.insert(ulama).values(seedUlama);
      const seedWorks = [
        { ulamaId: 'u_abu_hanifah', works: ['Al-Fiqh Al-Akbar', 'Musnad', 'Wasiyyah'] },
        { ulamaId: 'u_malik', works: ["Al-Muwatha'"] },
        { ulamaId: 'u_syafii', works: ['Ar-Risalah', 'Al-Umm', 'Musnad'] },
        { ulamaId: 'u_ahmad', works: ['Musnad', 'Az-Zuhd', 'As-Sunnah'] },
        {
          ulamaId: 'u_ghazali',
          works: ['Ihya Ulumuddin', 'Tahafut Al-Falasifah', 'Al-Munqidz', 'Bidayatul Hidayah'],
        },
        { ulamaId: 'u_qadir', works: ['Al-Ghunyah', 'Futuh Al-Ghaib', 'Al-Fath Ar-Rabbani'] },
        { ulamaId: 'u_bahauddin', works: ['Maqamat Naqsyabandiyyah'] },
        { ulamaId: 'u_asyari', works: ['Maqalat Al-Islamiyyin', 'Al-Ibanah'] },
        { ulamaId: 'u_maturidi', works: ['Kitab At-Tawhid', "Ta'wilat Ahl As-Sunnah"] },
      ];
      await db.insert(ulama_work).values(
        seedWorks.flatMap((sw) =>
          sw.works.map((w, i) => ({
            id: `${sw.ulamaId}_w_${i}`,
            ulamaId: sw.ulamaId,
            title: w,
            sortOrder: i,
            createdAt: now,
          })),
        ),
      );
    }

    // Ensure extended categories (idempotent add if missing)
    const extendedCats = [
      { id: 'cat_nu', slug: 'nahdlatul-ulama', name: 'Nahdlatul Ulama', sortOrder: 20 },
      { id: 'cat_muh', slug: 'muhammadiyah', name: 'Muhammadiyah', sortOrder: 21 },
      { id: 'cat_kontemporer', slug: 'kontemporer', name: 'Ulama Kontemporer', sortOrder: 30 },
    ];
    const existAfterSeed = await db.select().from(ulama_category);
    const existSlugs = new Set(existAfterSeed.map((c) => c.slug));
    const needAdd = extendedCats
      .filter((c) => !existSlugs.has(c.slug))
      .map((c) => ({ ...c, createdAt: new Date() }));
    if (needAdd.length) await db.insert(ulama_category).values(needAdd);

    const categoriesFinal = await db
      .select()
      .from(ulama_category)
      .orderBy(ulama_category.sortOrder);
    const ulamaList: UlamaRow[] = (await db.select().from(ulama)) as UlamaRow[];

    // Seed additional contemporary / Indonesian scholars if absent
    const existingIds = new Set(ulamaList.map((u) => u.id));
    const extra = [
      {
        id: 'u_hasyim_asyari',
        categoryId: 'cat_nu',
        name: "KH. Hasyim Asy'ari",
        fullName: "Muhammad Hasyim Asy'ari",
        birth: '1871 M',
        death: '1947 M',
        birthPlace: 'Jombang, Indonesia',
        biography: 'Pendiri Nahdlatul Ulama dan penggerak resolusi jihad.',
        contribution: 'Mendirikan NU & mengokohkan jaringan pesantren.',
      },
      {
        id: 'u_maimun_zubair',
        categoryId: 'cat_nu',
        name: 'KH. Maimun Zubair',
        fullName: 'Maimun Zubair',
        birth: '1928 M',
        death: '2019 M',
        birthPlace: 'Rembang, Indonesia',
        biography: 'Ulama kharismatik rujukan fikih & siyasah pesantren.',
        contribution: 'Pengokoh tradisi fikih siyasah moderat.',
      },
      {
        id: 'u_gus_baha',
        categoryId: 'cat_nu',
        name: 'Gus Baha',
        fullName: 'KH. Ahmad Bahauddin Nursalim',
        birth: '1970 M',
        death: '',
        birthPlace: 'Rembang, Indonesia',
        biography: 'Ulama tafsir kontemporer dengan pendekatan sederhana dan mendalam.',
        contribution: 'Memasyarakatkan tafsir turats kontekstual.',
      },
      {
        id: 'u_ahmad_dahlan',
        categoryId: 'cat_muh',
        name: 'KH. Ahmad Dahlan',
        fullName: 'Muhammad Darwis',
        birth: '1868 M',
        death: '1923 M',
        birthPlace: 'Yogyakarta, Indonesia',
        biography: 'Pendiri Muhammadiyah pelopor tajdid & pendidikan modern.',
        contribution: 'Modernisasi pendidikan & amal sosial.',
      },
      {
        id: 'u_ramadan_buthi',
        categoryId: 'cat_kontemporer',
        name: 'Syaikh Said Ramadan Al-Buthi',
        fullName: 'Said Ramadan Al-Buthi',
        birth: '1929 M',
        death: '2013 M',
        birthPlace: 'Suriah',
        biography: 'Ulama fiqih & tasawuf moderat penulis produktif.',
        contribution: 'Membela fikih wasathiyah & melawan ekstremisme.',
      },
      {
        id: 'u_habib_umar',
        categoryId: 'cat_kontemporer',
        name: 'Habib Umar bin Hafidz',
        fullName: 'Umar bin Muhammad bin Salim bin Hafidz',
        birth: '1963 M',
        death: '',
        birthPlace: 'Tarim, Hadramaut',
        biography: 'Mursyid Darul Mustafa, dai global sanad ilmu.',
        contribution: 'Jaringan dakwah sanad tradisional lintas negara.',
      },
    ];
    const toAdd = extra
      .filter((e) => !existingIds.has(e.id))
      .map((e) => ({
        ...e,
        slug: e.id.replace(/^u_/, ''),
        searchIndex: [e.name, e.fullName, e.biography, e.contribution]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
        createdAt: new Date(),
        authorId: ADMIN_ID,
      }));
    if (toAdd.length) await db.insert(ulama).values(toAdd);
    if (toAdd.length) {
      await db.insert(ulama_work).values(
        toAdd.map((s) => ({
          id: s.id + '_w0',
          ulamaId: s.id,
          title: 'Karya & Ajaran',
          sortOrder: 0,
          createdAt: new Date(),
        })),
      );
    }
    // Backfill any existing rows missing author_id
    try {
      await db.run(sql`UPDATE ulama SET author_id = ${ADMIN_ID} WHERE author_id IS NULL`);
    } catch (e) {
      console.warn('Failed backfill ulama.author_id', e);
    }
    // Build dynamic conditions (server-side category filter)
    const filters: SQL[] = [];
    if (catSlug !== 'semua') {
      const catMatch = categoriesFinal.find((c) => c.slug === catSlug);
      if (catMatch) filters.push(eq(ulama.categoryId, catMatch.id));
    }

    // Add search filter if query exists
    if (searchQuery.trim()) {
      const searchTerm = `%${searchQuery.toLowerCase().trim()}%`;
      filters.push(sql`(
        LOWER(${ulama.name}) LIKE ${searchTerm} OR
        LOWER(${ulama.fullName}) LIKE ${searchTerm} OR
        LOWER(${ulama.biography}) LIKE ${searchTerm} OR
        LOWER(${ulama.contribution}) LIKE ${searchTerm} OR
        LOWER(${ulama.birthPlace}) LIKE ${searchTerm} OR
        LOWER(${ulama.quote}) LIKE ${searchTerm}
      )`);
    }

    // Total count (build without mutating builder to preserve Drizzle types)
    const countResult = filters.length
      ? await db
          .select({ count: sql<number>`count(*)` })
          .from(ulama)
          .where(and(...filters))
      : await db.select({ count: sql<number>`count(*)` }).from(ulama);
    const total = countResult[0].count;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(page, totalPages);

    // Order by name (default)
    const orderExpr = asc(ulama.name);

    // Data page
    const baseData = db.select().from(ulama);
    const filteredData = filters.length ? baseData.where(and(...filters)) : baseData;
    const pageUlama = (await filteredData
      .orderBy(orderExpr)
      .limit(perPage)
      .offset((currentPage - 1) * perPage)) as UlamaRow[];

    // Collect author names for displayed ulama
    const authorIds = Array.from(
      new Set(pageUlama.map((u) => u.authorId).filter(Boolean)),
    ) as string[];
    let authorsMap: Record<string, string> = {};
    if (authorIds.length) {
      const authors = await db
        .select({ id: user.id, name: user.name })
        .from(user)
        .where(inArray(user.id, authorIds));
      authorsMap = Object.fromEntries(authors.map((a) => [a.id, a.name]));
    }

    // Fetch works only for displayed ulama
    const ids = pageUlama.map((u) => u.id);
    let worksForPage: UlamaWorkRow[] = [];
    if (ids.length) {
      worksForPage = (await db
        .select()
        .from(ulama_work)
        .where(inArray(ulama_work.ulamaId, ids))) as UlamaWorkRow[];
    }
    const worksMapPage = worksForPage.reduce<Record<string, string[]>>(
      (acc, w) => {
        (acc[w.ulamaId] ||= []).push(w.title);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return json({
      categories: categoriesFinal,
      ulama: pageUlama,
      worksMap: worksMapPage,
      authorsMap,
      meta: {
        page: currentPage,
        perPage,
        total,
        totalPages,
        cat: catSlug,
        q: searchQuery,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error('biografi-ulama loader error:', message, stack);
    return json(
      {
        categories: [],
        ulama: [],
        worksMap: {},
        meta: {
          page: 1,
          perPage: 0,
          total: 0,
          totalPages: 1,
          cat: 'semua',
          q: '',
        },
        error: message || 'failed',
      },
      { status: 200 },
    );
  }
}

export default function BiografiUlama() {
  const data = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { meta } = data as {
    meta: {
      cat: string;
      page: number;
      totalPages: number;
      q: string;
    };
  };
  const selectedCategory = meta.cat || 'semua';
  const page = meta.page;
  const totalPages = meta.totalPages;
  const searchQuery = meta.q || '';

  const categories = useMemo(
    () => [
      { id: 'semua', label: 'Semua Ulama', icon: User },
      ...(data.categories as Array<{ slug: string; name: string }>).map((c) => ({
        id: c.slug,
        label: c.name,
        icon: c.slug === 'tasawuf' ? Heart : c.slug === 'aqidah' ? GraduationCap : BookOpen,
      })),
    ],
    [data.categories],
  );

  const enrichedUlama: UlamaDisplay[] = useMemo(() => {
    const worksMap = data.worksMap as Record<string, string[]>;
    const authorsMap = (data as { authorsMap?: Record<string, string> }).authorsMap || {};
    const cats = data.categories as Array<{ id: string; slug: string }>;
    // Cast through unknown to appease mismatch between loader json serialization & Drizzle row type
    const raw = data.ulama as unknown as UlamaRow[];
    return raw.filter(Boolean).map((u) => ({
      ...u,
      createdAt: typeof u.createdAt === 'string' ? new Date(u.createdAt) : u.createdAt,
      updatedAt: typeof u.updatedAt === 'string' ? new Date(u.updatedAt) : u.updatedAt,
      authorName: u.authorId ? authorsMap[u.authorId] : undefined,
      majorWorks: worksMap[u.id] || [],
      category: cats.find((c) => c.id === u.categoryId)?.slug || 'lain',
    })) as UlamaDisplay[];
  }, [data]);

  // Data is already filtered server-side, so we use it directly
  const filteredUlama = enrichedUlama;

  function updateParam(key: string, val: string) {
    const sp = new URLSearchParams(searchParams);
    if (val === '' || val === 'semua') {
      if (key === 'cat') sp.delete('cat');
      else if (key === 'q') sp.delete('q');
      else sp.set(key, val);
    } else {
      sp.set(key, val);
    }
    if (key !== 'page') sp.set('page', '1'); // reset page when changing filters
    setSearchParams(sp);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    updateParam('q', query || '');
  }

  function clearSearch() {
    updateParam('q', '');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Biografi Ulama Ahli Sunnah wal Jamaah
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mengenal para imam besar dari 4 madzhab fiqih dan ulama tasawuf yang menjadi rujukan
              umat Islam hingga saat ini
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  name="search"
                  type="text"
                  placeholder="Cari nama ulama, tempat lahir, kontribusi, atau kutipan..."
                  defaultValue={searchQuery}
                  className="pl-10 pr-20 h-12 text-base"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
                >
                  Cari
                </Button>
              </div>
            </form>
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Menampilkan hasil pencarian untuk:{' '}
                  <span className="font-semibold text-foreground">&ldquo;{searchQuery}&rdquo;</span>
                  {filteredUlama.length > 0 && (
                    <span> - {filteredUlama.length} ulama ditemukan</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter Kategori:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParam('cat', category.id)}
                className="text-xs sm:text-sm"
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Ulama Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredUlama.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Tidak Ada Ulama Ditemukan</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `Tidak ada ulama yang sesuai dengan pencarian &ldquo;${searchQuery}&rdquo; ${
                      selectedCategory !== 'semua' ? `dalam kategori ${selectedCategory}` : ''
                    }.`
                  : `Tidak ada ulama dalam kategori ${selectedCategory}.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Hapus Pencarian
                  </Button>
                )}
                {selectedCategory !== 'semua' && (
                  <Button onClick={() => updateParam('cat', 'semua')} variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Lihat Semua Kategori
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredUlama.map((ul) => {
                  const category = categories.find((c) => c.id === ul.category);
                  return (
                    <UlamaCard key={ul.id} ulama={ul} category={category?.label || ul.category} />
                  );
                })}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => updateParam('page', String(page - 1))}
                    >
                      Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Halaman {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => updateParam('page', String(page + 1))}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {Array.from({ length: Math.min(totalPages, 12) }, (_, i) => {
                      const p = i + 1;
                      const active = p === page;
                      return (
                        <Button
                          key={p}
                          variant={active ? 'default' : 'outline'}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => updateParam('page', String(p))}
                        >
                          {p}
                        </Button>
                      );
                    })}
                    {totalPages > 12 && (
                      <span className="text-xs text-muted-foreground px-2">...</span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pelajari Lebih Dalam Ilmu Para Ulama
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan Santri Online untuk mempelajari kitab-kitab karya para ulama besar
            ini dengan bimbingan yang tepat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/pembelajaran">
                <BookOpen className="w-5 h-5 mr-2" />
                Mulai Belajar Sekarang
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <a href="/kitab">
                <Scroll className="w-5 h-5 mr-2" />
                Lihat Daftar Kitab
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
