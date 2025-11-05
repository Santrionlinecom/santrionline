import { memo, useMemo, useState } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  useLoaderData,
  useOutletContext,
  Link,
  Form,
  useSubmit,
  useSearchParams,
  useFetcher,
} from '@remix-run/react';
import { motion } from 'framer-motion';
import { eq, like, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { ulama, ulama_category, ulama_work, type AppRole } from '~/db/schema';
import { getDb } from '~/db/drizzle.server';
import { requireUserId } from '~/lib/session.server';
import { log } from '~/lib/logger';
import { isAdminRole } from '~/lib/rbac';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
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
  Plus,
  Edit3,
  Trash2,
  Search,
  Award,
  Users,
  BookCheck,
  Target,
  TrendingUp,
  Scale,
  MessageSquare,
  Compass,
  Crown,
  Sparkles,
  Zap,
  Brain,
  Globe,
  Library,
  Mic,
} from 'lucide-react';
/* eslint-disable @typescript-eslint/no-explicit-any */

type UserFromContext = {
  user: {
    id: string;
    name: string;
    email: string;
    role: AppRole;
  };
};

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const highlight = (text: string, query: string) => {
  if (!query || !text) return text;
  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'ig');
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/40 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const UlamaCard = memo(
  ({
    ulama,
    category,
    searchTerm,
    onEdit,
    onDelete,
    userRole,
  }: {
    ulama: any;
    category: string;
    searchTerm: string;
    onEdit: (ulama: any) => void;
    onDelete: (ulamaId: string) => void;
    userRole: AppRole;
  }) => (
    <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/biografi-ulama/${ulama.id}`} prefetch="intent">
              <CardTitle className="text-lg font-bold mb-2 group-hover:text-primary transition-colors underline-offset-4 hover:underline">
                {highlight(ulama.name, searchTerm)}
              </CardTitle>
            </Link>
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
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
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {highlight(ulama.biography || '', searchTerm)}
          </p>

          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center">
              <Scroll className="w-4 h-4 mr-1" />
              Karya Utama:
            </h4>
            <ul className="space-y-1">
              {ulama.majorWorks?.slice(0, 3).map((work: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                  {work}
                </li>
              ))}
              {ulama.majorWorks?.length > 3 && (
                <li className="text-xs text-muted-foreground italic">
                  +{ulama.majorWorks.length - 3} karya lainnya
                </li>
              )}
            </ul>
          </div>

          {ulama.quote && (
            <div className="border-l-4 border-primary/30 pl-3 py-2 bg-muted/30 rounded-r">
              <p className="text-sm italic text-muted-foreground">&quot;{ulama.quote}&quot;</p>
            </div>
          )}

          {isAdminRole(userRole) && (
            <div className="flex gap-2 pt-2 border-t">
              <Button size="sm" variant="outline" onClick={() => onEdit(ulama)} className="flex-1">
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(ulama.id)}
                className="flex-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  ),
);

UlamaCard.displayName = 'UlamaCard';

// Author credit for biography entries
const AUTHOR_CREDIT = 'Data dikurasi oleh Yogik Pratama Aprilian - Owner/Admin SantriOnline';

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    await requireUserId(request, context); // auth check only
    const db = getDb(context);

    // Ensure database is migrated
    const { ensureMigrated } = await import('~/db/autoMigrate.server');
    await ensureMigrated(context);

    // Check table existence
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
    const sort = url.searchParams.get('sort') || 'name';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const search = (url.searchParams.get('q') || '').trim().toLowerCase();
    const catSlug = url.searchParams.get('cat') || 'semua';

    // Get categories with enhanced seeding
    let categories = await db.select().from(ulama_category).orderBy(ulama_category.sortOrder);

    // Enhanced category seeding if empty or missing categories
    if (categories.length === 0) {
      const now = new Date();
      const enhancedCategories = [
        // 4 Madzhab Fiqih Utama
        {
          id: 'cat_hanafi',
          slug: 'hanafi',
          name: 'Madzhab Hanafi',
          description: 'Ulama-ulama madzhab Hanafi dalam bidang fiqih',
          sortOrder: 1,
        },
        {
          id: 'cat_maliki',
          slug: 'maliki',
          name: 'Madzhab Maliki',
          description: 'Ulama-ulama madzhab Maliki dalam bidang fiqih',
          sortOrder: 2,
        },
        {
          id: 'cat_syafii',
          slug: 'syafii',
          name: "Madzhab Syafi'i",
          description: "Ulama-ulama madzhab Syafi'i dalam bidang fiqih",
          sortOrder: 3,
        },
        {
          id: 'cat_hanbali',
          slug: 'hanbali',
          name: 'Madzhab Hanbali',
          description: 'Ulama-ulama madzhab Hanbali dalam bidang fiqih',
          sortOrder: 4,
        },

        // Bidang Keilmuan Islam
        {
          id: 'cat_hadits',
          slug: 'hadits',
          name: 'Ahli Hadits',
          description: 'Ulama spesialis ilmu hadits, riwayat, dan kritik sanad',
          sortOrder: 10,
        },
        {
          id: 'cat_tafsir',
          slug: 'tafsir',
          name: 'Ahli Tafsir',
          description: 'Ulama spesialis tafsir Al-Quran dan ilmu Al-Quran',
          sortOrder: 11,
        },
        {
          id: 'cat_aqidah',
          slug: 'aqidah',
          name: 'Ahli Aqidah',
          description: 'Ulama spesialis aqidah, kalam, dan teologi Islam',
          sortOrder: 12,
        },
        {
          id: 'cat_tasawuf',
          slug: 'tasawuf',
          name: 'Ahli Tasawuf',
          description: 'Ulama spesialis tasawuf, spiritualitas, dan pembersihan jiwa',
          sortOrder: 13,
        },
        {
          id: 'cat_ushul_fiqh',
          slug: 'ushul-fiqh',
          name: 'Ahli Ushul Fiqh',
          description: 'Ulama spesialis ushul fiqh dan metodologi hukum Islam',
          sortOrder: 14,
        },
        {
          id: 'cat_nahw_sharaf',
          slug: 'nahw-sharaf',
          name: 'Ahli Nahw & Sharaf',
          description: 'Ulama spesialis tata bahasa Arab dan linguistik',
          sortOrder: 15,
        },
        {
          id: 'cat_sirah',
          slug: 'sirah',
          name: 'Ahli Sirah',
          description: 'Ulama spesialis sirah nabawiyah dan sejarah Islam',
          sortOrder: 16,
        },
        {
          id: 'cat_mantiq',
          slug: 'mantiq',
          name: 'Ahli Mantiq',
          description: 'Ulama spesialis ilmu logika dan filsafat Islam',
          sortOrder: 17,
        },

        // Thariqah dan Sufi
        {
          id: 'cat_thariqah_qadiriyyah',
          slug: 'qadiriyyah',
          name: 'Thariqah Qadiriyyah',
          description: 'Masyayikh dan ulama Thariqah Qadiriyyah',
          sortOrder: 20,
        },
        {
          id: 'cat_thariqah_naqsyabandiyyah',
          slug: 'naqsyabandiyyah',
          name: 'Thariqah Naqsyabandiyyah',
          description: 'Masyayikh dan ulama Thariqah Naqsyabandiyyah',
          sortOrder: 21,
        },
        {
          id: 'cat_thariqah_syadziliyyah',
          slug: 'syadziliyyah',
          name: 'Thariqah Syadziliyyah',
          description: 'Masyayikh dan ulama Thariqah Syadziliyyah',
          sortOrder: 22,
        },
        {
          id: 'cat_thariqah_rifaiyyah',
          slug: 'rifaiyyah',
          name: 'Thariqah Rifaiyyah',
          description: 'Masyayikh dan ulama Thariqah Rifaiyyah',
          sortOrder: 23,
        },

        // Periode Sejarah
        {
          id: 'cat_sahabat',
          slug: 'sahabat',
          name: "Sahabat & Tabi'in",
          description: "Para sahabat Nabi dan tabi'in",
          sortOrder: 30,
        },
        {
          id: 'cat_salaf',
          slug: 'salaf',
          name: 'Ulama Salaf',
          description: 'Ulama tiga generasi terbaik (salafus shalih)',
          sortOrder: 31,
        },
        {
          id: 'cat_klasik',
          slug: 'klasik',
          name: 'Ulama Klasik',
          description: 'Ulama periode klasik (abad 4-10 H)',
          sortOrder: 32,
        },
        {
          id: 'cat_pertengahan',
          slug: 'pertengahan',
          name: 'Ulama Pertengahan',
          description: 'Ulama periode pertengahan (abad 10-13 H)',
          sortOrder: 33,
        },
        {
          id: 'cat_modern',
          slug: 'modern',
          name: 'Ulama Modern',
          description: 'Ulama periode modern (abad 13-15 H)',
          sortOrder: 34,
        },
        {
          id: 'cat_kontemporer',
          slug: 'kontemporer',
          name: 'Ulama Kontemporer',
          description: 'Ulama masa kini (abad 15 H hingga sekarang)',
          sortOrder: 35,
        },

        // Regional/Organisasi
        {
          id: 'cat_nusantara',
          slug: 'nusantara',
          name: 'Ulama Nusantara',
          description: 'Ulama dari wilayah Asia Tenggara',
          sortOrder: 40,
        },
        {
          id: 'cat_nahdlatul_ulama',
          slug: 'nahdlatul-ulama',
          name: 'Nahdlatul Ulama',
          description: 'Ulama yang berafiliasi dengan Nahdlatul Ulama',
          sortOrder: 41,
        },
        {
          id: 'cat_muhammadiyah',
          slug: 'muhammadiyah',
          name: 'Muhammadiyah',
          description: 'Ulama yang berafiliasi dengan Muhammadiyah',
          sortOrder: 42,
        },
        {
          id: 'cat_azhar',
          slug: 'azhar',
          name: 'Al-Azhar',
          description: 'Ulama dari tradisi Al-Azhar Mesir',
          sortOrder: 43,
        },

        // Bidang Khusus
        {
          id: 'cat_dakwah',
          slug: 'dakwah',
          name: 'Ahli Dakwah',
          description: 'Ulama spesialis dakwah dan komunikasi Islam',
          sortOrder: 50,
        },
        {
          id: 'cat_pendidikan',
          slug: 'pendidikan',
          name: 'Ahli Pendidikan',
          description: 'Ulama spesialis pendidikan dan pedagogi Islam',
          sortOrder: 51,
        },
        {
          id: 'cat_ekonomi_islam',
          slug: 'ekonomi-islam',
          name: 'Ahli Ekonomi Islam',
          description: 'Ulama spesialis ekonomi dan keuangan syariah',
          sortOrder: 52,
        },
        {
          id: 'cat_politik_islam',
          slug: 'politik-islam',
          name: 'Ahli Politik Islam',
          description: 'Ulama spesialis fiqh siyasah dan politik Islam',
          sortOrder: 53,
        },
        {
          id: 'cat_sains_islam',
          slug: 'sains-islam',
          name: 'Ahli Sains Islam',
          description: 'Ulama yang juga ahli dalam sains dan teknologi',
          sortOrder: 54,
        },
      ].map((c) => ({ ...c, createdAt: now }));

      await db.insert(ulama_category).values(enhancedCategories);
      categories = await db.select().from(ulama_category).orderBy(ulama_category.sortOrder);
    }

    // Seed famous ulama data if empty
    const existingUlama = await db.select().from(ulama).limit(1);
    if (existingUlama.length === 0) {
      const now = new Date();
      const famousUlama = [
        // Imam 4 Madzhab
        {
          id: 'u_abu_hanifah_' + Date.now(),
          name: 'Imam Abu Hanifah',
          fullName: "Nu'man bin Tsabit bin Zuta",
          slug: 'imam-abu-hanifah',
          categoryId: 'cat_hanafi',
          birth: '80 H',
          death: '150 H',
          birthPlace: 'Kufah, Irak',
          periodCentury: '2H',
          biography: `Imam Abu Hanifah adalah pendiri madzhab Hanafi yang merupakan madzhab terbesar di dunia Islam. Beliau dikenal dengan kecerdasan luar biasa dan kemampuan analisis hukum yang mendalam. Sebagai seorang pedagang sukses, beliau memadukan kehidupan duniawi dengan keilmuan agama. ${AUTHOR_CREDIT}`,
          contribution:
            'Mengembangkan metodologi fiqih yang fleksibel dengan penekanan pada qiyas dan istihsan. Madzhab Hanafi menjadi madzhab resmi Daulah Utsmaniyyah dan tersebar luas di Turki, Asia Tengah, dan anak benua India.',
          quote:
            'Seandainya manusia tidak berbuat dosa, Allah akan menciptakan makhluk yang berbuat dosa lalu Allah mengampuni mereka.',
          searchIndex: 'abu hanifah imam numan bin tsabit hanafi fiqih kufah irak qiyas istihsan',
          createdAt: now,
        },
        {
          id: 'u_malik_' + Date.now(),
          name: 'Imam Malik',
          fullName: 'Malik bin Anas bin Malik bin Abi Amir al-Asbahi',
          slug: 'imam-malik',
          categoryId: 'cat_maliki',
          birth: '93 H',
          death: '179 H',
          birthPlace: 'Madinah, Hijaz',
          periodCentury: '2H',
          biography: `Imam Malik adalah Imam Madinah yang tidak pernah meninggalkan kota kelahiran Rasulullah. Beliau adalah penyusun kitab Al-Muwatta, hadits pertama yang disusun secara sistematis. Keilmuannya sangat mendalam dalam hadits dan fiqih. ${AUTHOR_CREDIT}`,
          contribution:
            'Menyusun Al-Muwatta yang menjadi rujukan utama hadits dan fiqih. Mengembangkan konsep Amal Ahli Madinah sebagai sumber hukum Islam. Madzhab Maliki dominan di Afrika Utara dan Barat.',
          quote:
            'Tidaklah seseorang berbicara dalam semua hal yang diketahuinya kecuali dia akan tergelincir.',
          searchIndex: 'malik imam madinah muwatta maliki hadits amal ahli madinah afrika',
          createdAt: now,
        },
        {
          id: 'u_syafii_' + Date.now(),
          name: "Imam Asy-Syafi'i",
          fullName: "Muhammad bin Idris asy-Syafi'i al-Muttalibi",
          slug: 'imam-asy-syafii',
          categoryId: 'cat_syafii',
          birth: '150 H',
          death: '204 H',
          birthPlace: 'Gaza, Palestina',
          periodCentury: '2H-3H',
          biography: `Imam Asy-Syafi'i adalah murid Imam Malik dan guru Imam Ahmad. Beliau mengembangkan ilmu ushul fiqih secara sistematis dan menulis kitab Ar-Risalah sebagai karya ushul fiqih pertama. Beliau juga seorang penyair dan ahli bahasa Arab. ${AUTHOR_CREDIT}`,
          contribution:
            "Menysusun kaidah ushul fiqih dalam kitab Ar-Risalah. Mengembangkan metodologi istinbath hukum yang sistematis. Madzhab Syafi'i tersebar di Mesir, Asia Tenggara, dan sebagian Afrika.",
          quote:
            'Aku tidak pernah berdebat dengan seseorang kecuali aku berharap Allah menunjukkan kebenaran melalui lisannya.',
          searchIndex: 'syafii imam muhammad idris ushul fiqih risalah gaza mesir',
          createdAt: now,
        },
        {
          id: 'u_ahmad_' + Date.now(),
          name: 'Imam Ahmad bin Hanbal',
          fullName: 'Ahmad bin Muhammad bin Hanbal asy-Syaibani',
          slug: 'imam-ahmad-bin-hanbal',
          categoryId: 'cat_hanbali',
          birth: '164 H',
          death: '241 H',
          birthPlace: 'Baghdad, Irak',
          periodCentury: '3H',
          biography: `Imam Ahmad bin Hanbal adalah imam yang terkenal dengan keteguhannya dalam membela akidah. Beliau mengalami mihna (ujian) berat pada masa Khalifah al-Ma'mun karena menolak paham Mu'tazilah tentang Al-Quran makhluk. ${AUTHOR_CREDIT}`,
          contribution:
            "Menyusun Musnad Ahmad yang berisi sekitar 40.000 hadits. Mempertahankan akidah Ahlus Sunnah dari penyimpangan Mu'tazilah. Madzhab Hanbali menjadi madzhab resmi Arab Saudi.",
          quote: 'Orang-orang akan terus membutuhkan hadits dan orang yang memahaminya.',
          searchIndex: 'ahmad hanbal imam musnad mihna mutazilah baghdad hanbali',
          createdAt: now,
        },

        // Imam Hadits Terkenal
        {
          id: 'u_bukhari_' + Date.now(),
          name: 'Imam Al-Bukhari',
          fullName: 'Muhammad bin Ismail al-Bukhari',
          slug: 'imam-al-bukhari',
          categoryId: 'cat_hadits',
          birth: '194 H',
          death: '256 H',
          birthPlace: 'Bukhara, Uzbekistan',
          periodCentury: '3H',
          biography: `Imam Bukhari adalah imam hadits terbesar yang menyusun Shahih Bukhari, kitab paling shahih setelah Al-Quran. Beliau menghafal lebih dari 600.000 hadits dan sangat ketat dalam menyeleksi hadits shahih. ${AUTHOR_CREDIT}`,
          contribution:
            'Menyusun Shahih Bukhari yang berisi 7.275 hadits shahih. Mengembangkan metodologi kritik hadits yang sangat ketat. Karyanya menjadi rujukan utama hadits di seluruh dunia Islam.',
          quote:
            'Aku tidak memasukkan hadits dalam kitab Shahih-ku kecuali setelah aku shalat istikharah terlebih dahulu.',
          searchIndex: 'bukhari imam muhammad ismail shahih hadits bukhara uzbekistan',
          createdAt: now,
        },
        {
          id: 'u_muslim_' + Date.now(),
          name: 'Imam Muslim',
          fullName: 'Muslim bin al-Hajjaj an-Naisaburi',
          slug: 'imam-muslim',
          categoryId: 'cat_hadits',
          birth: '204 H',
          death: '261 H',
          birthPlace: 'Naisabur, Iran',
          periodCentury: '3H',
          biography: `Imam Muslim adalah penyusun Shahih Muslim, salah satu dari dua kitab hadits paling shahih. Beliau sangat teliti dalam menyusun hadits berdasarkan tema dan menghindari pengulangan. ${AUTHOR_CREDIT}`,
          contribution:
            'Menyusun Shahih Muslim dengan metode pengelompokan hadits yang sistematis. Mengembangkan standar kesahihan hadits yang tinggi. Shahih Muslim menjadi rujukan utama bersama Shahih Bukhari.',
          quote: 'Tidaklah kami meriwayatkan hadits ini kecuali untuk dijadikan hujjah (dalil).',
          searchIndex: 'muslim imam hajjaj naisaburi shahih hadits iran',
          createdAt: now,
        },

        // Ulama Tafsir
        {
          id: 'u_tabari_' + Date.now(),
          name: 'Imam At-Tabari',
          fullName: 'Muhammad bin Jarir at-Tabari',
          slug: 'imam-at-tabari',
          categoryId: 'cat_tafsir',
          birth: '224 H',
          death: '310 H',
          birthPlace: 'Tabaristan, Iran',
          periodCentury: '3H-4H',
          biography: `Imam At-Tabari adalah mufassir dan sejarawan besar. Tafsir Jami' al-Bayan karyannya menjadi rujukan utama tafsir bil-ma'tsur. Beliau juga menulis sejarah Islam yang monumental dalam Tarikh at-Tabari. ${AUTHOR_CREDIT}`,
          contribution:
            "Menyusun Jami' al-Bayan, tafsir komprehensif dengan pendekatan bil-ma'tsur. Menulis Tarikh at-Tabari yang menjadi rujukan sejarah Islam. Menggabungkan keilmuan tafsir, hadits, dan sejarah.",
          quote:
            'Barangsiapa yang menafsirkan Al-Quran dengan pendapatnya, maka dia telah berbuat salah meskipun dia benar.',
          searchIndex: 'tabari imam muhammad jarir tafsir jami bayan tarikh sejarah iran',
          createdAt: now,
        },
        {
          id: 'u_qurtubi_' + Date.now(),
          name: 'Imam Al-Qurtubi',
          fullName: 'Muhammad bin Ahmad al-Ansari al-Qurtubi',
          slug: 'imam-al-qurtubi',
          categoryId: 'cat_tafsir',
          birth: '600 H',
          death: '671 H',
          birthPlace: 'Cordoba, Andalus',
          periodCentury: '7H',
          biography: `Imam Al-Qurtubi adalah mufassir besar dari Andalus. Tafsir Al-Jami' li Ahkam al-Quran karyannya sangat komprehensif dan fokus pada aspek hukum dari ayat-ayat Al-Quran. ${AUTHOR_CREDIT}`,
          contribution:
            "Menyusun Al-Jami' li Ahkam al-Quran, tafsir yang menguraikan aspek hukum dari setiap ayat. Menggabungkan tafsir dengan fiqih secara sistematis. Karyanya menjadi rujukan para fuqaha dan mufassir.",
          quote: 'Al-Quran adalah kitab petunjuk, bukan kitab teka-teki.',
          searchIndex: 'qurtubi imam muhammad ahmad jami ahkam quran cordoba andalus',
          createdAt: now,
        },

        // Ulama Tasawuf
        {
          id: 'u_ghazali_' + Date.now(),
          name: 'Imam Al-Ghazali',
          fullName: 'Abu Hamid Muhammad bin Muhammad al-Ghazali',
          slug: 'imam-al-ghazali',
          categoryId: 'cat_tasawuf',
          birth: '450 H',
          death: '505 H',
          birthPlace: 'Tus, Iran',
          periodCentury: '5H',
          biography: `Imam Al-Ghazali adalah Hujjatul Islam yang menggabungkan syariat, tariqat, dan hakikat. Beliau berhasil memadukan tasawuf dengan syariat Islam. Kitab Ihya Ulumuddin menjadi masterpiece tasawuf Islam. ${AUTHOR_CREDIT}`,
          contribution:
            "Menyusun Ihya' Ulumuddin yang memadukan syariat dan tasawuf. Membersihkan tasawuf dari penyimpangan dan mengembalikannya kepada Al-Quran dan Sunnah. Mengembangkan psikologi Islam dalam Kimiya as-Sa'adah.",
          quote: 'Ingatlah sering-sering kepada penghancur kelezatan: kematian.',
          searchIndex: 'ghazali imam abu hamid ihya ulumuddin tasawuf tus iran hujjatul islam',
          createdAt: now,
        },
        {
          id: 'u_abdul_qadir_' + Date.now(),
          name: 'Syaikh Abdul Qadir Al-Jailani',
          fullName: 'Abdul Qadir bin Abi Shalih al-Jailani',
          slug: 'syaikh-abdul-qadir-al-jailani',
          categoryId: 'cat_qadiriyyah',
          birth: '470 H',
          death: '561 H',
          birthPlace: 'Gilan, Iran',
          periodCentury: '5H-6H',
          biography: `Syaikh Abdul Qadir Al-Jailani adalah pendiri Tarekat Qadiriyyah yang tersebar di seluruh dunia Islam. Beliau digelar Ghautsul A'zam dan Sultan al-Auliya. Pengajaran spiritualnya menggabungkan syariat dan hakikat. ${AUTHOR_CREDIT}`,
          contribution:
            'Mendirikan Tarekat Qadiriyyah yang menjadi tarekat terbesar di dunia. Mengajarkan tasawuf yang berpegang teguh pada syariat. Menyebarkan Islam melalui pendekatan spiritual di berbagai negara.',
          quote: 'Kaki saya ini berada di atas leher semua wali Allah.',
          searchIndex: 'abdul qadir jailani syaikh qadiriyyah tarekat ghautsul azam sultan auliya',
          createdAt: now,
        },

        // Ulama Nusantara
        {
          id: 'u_walisongo_sunan_ampel_' + Date.now(),
          name: 'Sunan Ampel',
          fullName: 'Raden Rahmat bin Ali Rahmatullah',
          slug: 'sunan-ampel',
          categoryId: 'cat_nusantara',
          birth: '1401 M',
          death: '1481 M',
          birthPlace: 'Campa, Vietnam',
          periodCentury: '9H',
          biography: `Sunan Ampel adalah salah satu anggota Walisongo yang berperan besar dalam penyebaran Islam di Jawa Timur. Beliau mendirikan pesantren pertama di Ampel, Surabaya, yang menjadi pusat pendidikan Islam di Nusantara. ${AUTHOR_CREDIT}`,
          contribution:
            'Mendirikan pesantren Ampel sebagai pusat pendidikan Islam. Mengembangkan metode dakwah yang adaptif dengan budaya lokal. Menjadi guru spiritual bagi para wali lainnya.',
          quote: 'Agama tanpa ilmu adalah buta, ilmu tanpa agama adalah lumpuh.',
          searchIndex: 'sunan ampel raden rahmat walisongo pesantren surabaya jawa timur',
          createdAt: now,
        },
        {
          id: 'u_sunan_kalijaga_' + Date.now(),
          name: 'Sunan Kalijaga',
          fullName: 'Raden Mas Said bin Sunan Ampel',
          slug: 'sunan-kalijaga',
          categoryId: 'cat_nusantara',
          birth: '1450 M',
          death: '1513 M',
          birthPlace: 'Tuban, Jawa Timur',
          periodCentury: '9H-10H',
          biography: `Sunan Kalijaga adalah wali yang terkenal dengan metode dakwahnya yang kreatif melalui seni dan budaya. Beliau menggunakan wayang, gamelan, dan tembang untuk menyebarkan ajaran Islam kepada masyarakat Jawa. ${AUTHOR_CREDIT}`,
          contribution:
            'Mengembangkan dakwah melalui seni dan budaya Jawa. Menciptakan tembang-tembang Islami dan mengislamkan pertunjukan wayang. Membangun toleransi dan harmoni dalam masyarakat plural.',
          quote:
            'Islam itu mudah, jangan dipersulit. Sampaikanlah dengan cara yang paling dekat dengan hati rakyat.',
          searchIndex: 'sunan kalijaga raden mas said walisongo wayang gamelan tembang jawa',
          createdAt: now,
        },
      ];

      // Insert ulama data
      await db.insert(ulama).values(famousUlama);

      // Insert major works for some ulama
      const majorWorks = [
        // Abu Hanifah
        {
          id: 'w_abu_hanifah_1',
          ulamaId: famousUlama[0].id,
          title: 'Al-Fiqh al-Akbar',
          createdAt: now,
        },
        {
          id: 'w_abu_hanifah_2',
          ulamaId: famousUlama[0].id,
          title: 'Ar-Risalah ila Utsman al-Batti',
          createdAt: now,
        },

        // Malik
        { id: 'w_malik_1', ulamaId: famousUlama[1].id, title: 'Al-Muwatta', createdAt: now },

        // Syafi'i
        { id: 'w_syafii_1', ulamaId: famousUlama[2].id, title: 'Ar-Risalah', createdAt: now },
        { id: 'w_syafii_2', ulamaId: famousUlama[2].id, title: 'Al-Umm', createdAt: now },
        {
          id: 'w_syafii_3',
          ulamaId: famousUlama[2].id,
          title: "Diwan Imam Asy-Syafi'i",
          createdAt: now,
        },

        // Ahmad
        { id: 'w_ahmad_1', ulamaId: famousUlama[3].id, title: 'Musnad Ahmad', createdAt: now },
        { id: 'w_ahmad_2', ulamaId: famousUlama[3].id, title: 'As-Sunnah', createdAt: now },

        // Bukhari
        { id: 'w_bukhari_1', ulamaId: famousUlama[4].id, title: 'Shahih Bukhari', createdAt: now },
        {
          id: 'w_bukhari_2',
          ulamaId: famousUlama[4].id,
          title: 'Al-Adab al-Mufrad',
          createdAt: now,
        },
        {
          id: 'w_bukhari_3',
          ulamaId: famousUlama[4].id,
          title: 'At-Tarikh al-Kabir',
          createdAt: now,
        },

        // Muslim
        { id: 'w_muslim_1', ulamaId: famousUlama[5].id, title: 'Shahih Muslim', createdAt: now },

        // Tabari
        {
          id: 'w_tabari_1',
          ulamaId: famousUlama[6].id,
          title: "Jami' al-Bayan fi Tafsir al-Quran",
          createdAt: now,
        },
        {
          id: 'w_tabari_2',
          ulamaId: famousUlama[6].id,
          title: 'Tarikh ar-Rusul wal-Muluk',
          createdAt: now,
        },

        // Qurtubi
        {
          id: 'w_qurtubi_1',
          ulamaId: famousUlama[7].id,
          title: "Al-Jami' li Ahkam al-Quran",
          createdAt: now,
        },
        {
          id: 'w_qurtubi_2',
          ulamaId: famousUlama[7].id,
          title: 'At-Tazkira bi Ahwal al-Mauta',
          createdAt: now,
        },

        // Ghazali
        { id: 'w_ghazali_1', ulamaId: famousUlama[8].id, title: "Ihya' Ulumuddin", createdAt: now },
        {
          id: 'w_ghazali_2',
          ulamaId: famousUlama[8].id,
          title: 'Tahafut al-Falasifah',
          createdAt: now,
        },
        {
          id: 'w_ghazali_3',
          ulamaId: famousUlama[8].id,
          title: 'Al-Munqidz min ad-Dalal',
          createdAt: now,
        },
        {
          id: 'w_ghazali_4',
          ulamaId: famousUlama[8].id,
          title: "Kimiya as-Sa'adah",
          createdAt: now,
        },

        // Abdul Qadir
        {
          id: 'w_abdul_qadir_1',
          ulamaId: famousUlama[9].id,
          title: 'Al-Ghunya li Talibi Tariq al-Haqq',
          createdAt: now,
        },
        {
          id: 'w_abdul_qadir_2',
          ulamaId: famousUlama[9].id,
          title: 'Futuh al-Ghaib',
          createdAt: now,
        },
        {
          id: 'w_abdul_qadir_3',
          ulamaId: famousUlama[9].id,
          title: "Jala' al-Khawatir",
          createdAt: now,
        },

        // Sunan Ampel
        { id: 'w_sunan_ampel_1', ulamaId: famousUlama[10].id, title: 'Kitab Bon', createdAt: now },
        {
          id: 'w_sunan_ampel_2',
          ulamaId: famousUlama[10].id,
          title: 'Kumpulan Wirid dan Doa',
          createdAt: now,
        },

        // Sunan Kalijaga
        {
          id: 'w_sunan_kalijaga_1',
          ulamaId: famousUlama[11].id,
          title: 'Suluk Linglung',
          createdAt: now,
        },
        {
          id: 'w_sunan_kalijaga_2',
          ulamaId: famousUlama[11].id,
          title: 'Tembang Pucung',
          createdAt: now,
        },
        {
          id: 'w_sunan_kalijaga_3',
          ulamaId: famousUlama[11].id,
          title: 'Lakon Wayang Islami',
          createdAt: now,
        },
      ];

      await db.insert(ulama_work).values(majorWorks);
    }

    // Get statistics
    const stats = await db
      .select({
        totalUlama: sql<number>`count(*)`,
        totalCategories: sql<number>`count(distinct ${ulama.categoryId})`,
        totalWorks: sql<number>`(select count(*) from ${ulama_work})`,
      })
      .from(ulama);

    // Build dynamic conditions for search and category filter
    const conditions: any[] = [];
    if (catSlug !== 'semua') {
      const catMatch = categories.find((c) => c.slug === catSlug);
      if (catMatch) conditions.push(eq(ulama.categoryId, catMatch.id));
    }
    if (search) {
      const tokens = search.split(/\s+/).filter(Boolean).slice(0, 5);
      for (const token of tokens) {
        conditions.push(like(ulama.searchIndex, `%${token}%`));
      }
    }

    // Total count with filters
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(ulama);
    if (conditions.length) countQuery = countQuery.where(and(...conditions)) as any;
    const total = (await countQuery)[0].count;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(page, totalPages);

    // Order by
    let orderExpr: any;
    switch (sort) {
      case 'period':
        orderExpr = order === 'asc' ? asc(ulama.periodCentury) : desc(ulama.periodCentury);
        break;
      case 'created':
        orderExpr = order === 'asc' ? asc(ulama.createdAt) : desc(ulama.createdAt);
        break;
      case 'name':
      default:
        orderExpr = order === 'asc' ? asc(ulama.name) : desc(ulama.name);
    }

    // Data page
    let dataQuery = db.select().from(ulama);
    if (conditions.length) dataQuery = dataQuery.where(and(...conditions)) as any;
    dataQuery = dataQuery
      .orderBy(orderExpr)
      .limit(perPage)
      .offset((currentPage - 1) * perPage) as any;
    const pageUlama = await dataQuery;

    // Fetch works only for displayed ulama
    const ids = pageUlama.map((u) => u.id);
    let worksForPage: any[] = [];
    if (ids.length) {
      worksForPage = await db.select().from(ulama_work).where(inArray(ulama_work.ulamaId, ids));
    }
    const worksMapPage = worksForPage.reduce<Record<string, string[]>>(
      (acc: Record<string, string[]>, w: any) => {
        acc[w.ulamaId] ||= [];
        acc[w.ulamaId].push(w.title);
        return acc;
      },
      {},
    );

    return json({
      categories,
      ulama: pageUlama,
      worksMap: worksMapPage,
      stats: stats[0],
      meta: {
        page: currentPage,
        perPage,
        total,
        totalPages,
        sort,
        order,
        search,
        cat: catSlug,
      },
    });
  } catch (err: any) {
    log.error?.('dashboard.ulama.loader_error', { error: err?.message, stack: err?.stack });
    return json(
      {
        categories: [],
        ulama: [],
        worksMap: {},
        stats: { totalUlama: 0, totalCategories: 0, totalWorks: 0 },
        meta: {
          page: 1,
          perPage: 0,
          total: 0,
          totalPages: 1,
          sort: 'name',
          order: 'asc',
          search: '',
          cat: 'semua',
        },
        error: err?.message || 'failed',
      },
      { status: 200 },
    );
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    switch (intent) {
      case 'delete': {
        const ulamaId = formData.get('ulamaId') as string;
        if (!ulamaId) throw new Error('ID ulama tidak ditemukan');

        // Delete works first (foreign key constraint)
        await db.delete(ulama_work).where(eq(ulama_work.ulamaId, ulamaId));
        // Then delete ulama
        await db.delete(ulama).where(eq(ulama.id, ulamaId));

        return json({ success: true, message: 'Ulama berhasil dihapus' });
      }

      case 'create':
      case 'update': {
        const data = {
          name: formData.get('name') as string,
          fullName: formData.get('fullName') as string,
          categoryId: formData.get('categoryId') as string,
          birth: formData.get('birth') as string,
          death: formData.get('death') as string,
          birthPlace: formData.get('birthPlace') as string,
          biography: formData.get('biography') as string,
          contribution: formData.get('contribution') as string,
          quote: formData.get('quote') as string,
          periodCentury: formData.get('periodCentury') as string,
        };

        if (!data.name || !data.categoryId) {
          throw new Error('Nama dan kategori harus diisi');
        }

        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const searchIndex = [data.name, data.fullName, data.biography, data.contribution]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (intent === 'create') {
          const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
          await db.insert(ulama).values({
            id,
            slug,
            searchIndex,
            createdAt: new Date(),
            ...data,
          });
          return json({ success: true, message: 'Ulama berhasil ditambahkan' });
        } else {
          const ulamaId = formData.get('ulamaId') as string;
          if (!ulamaId) throw new Error('ID ulama tidak ditemukan');

          await db
            .update(ulama)
            .set({
              slug,
              searchIndex,
              updatedAt: new Date(),
              ...data,
            })
            .where(eq(ulama.id, ulamaId));
          return json({ success: true, message: 'Ulama berhasil diperbarui' });
        }
      }

      default:
        throw new Error('Action tidak dikenal');
    }
  } catch (err: any) {
    log.error?.('dashboard.ulama.action_error', { intent, error: err?.message });
    return json({ success: false, error: err?.message || 'Terjadi kesalahan' }, { status: 400 });
  }
}

export default function DashboardUlama() {
  const data = useLoaderData<typeof loader>();
  const { user } = useOutletContext<UserFromContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const [editingUlama, setEditingUlama] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { meta, stats } = data;
  const selectedCategory = meta.cat || 'semua';
  const searchTerm = meta.search || '';
  const sort = meta.sort;
  const order = meta.order;
  const page = meta.page;
  const totalPages = meta.totalPages;

  // Function to get appropriate icon for each category
  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<string, any> = {
      // Madzhab
      hanafi: Scale,
      maliki: Scale,
      syafii: Scale,
      hanbali: Scale,

      // Bidang Keilmuan
      hadits: MessageSquare,
      tafsir: BookOpen,
      aqidah: GraduationCap,
      tasawuf: Heart,
      'ushul-fiqh': Brain,
      'nahw-sharaf': Mic,
      sirah: Globe,
      mantiq: Brain,

      // Thariqah
      qadiriyyah: Sparkles,
      naqsyabandiyyah: Sparkles,
      syadziliyyah: Sparkles,
      rifaiyyah: Sparkles,

      // Periode
      sahabat: Crown,
      salaf: Star,
      klasik: Library,
      pertengahan: BookCheck,
      modern: Zap,
      kontemporer: Target,

      // Regional
      nusantara: Compass,
      'nahdlatul-ulama': Users,
      muhammadiyah: Users,
      azhar: GraduationCap,

      // Bidang Khusus
      dakwah: Mic,
      pendidikan: GraduationCap,
      'ekonomi-islam': TrendingUp,
      'politik-islam': Crown,
      'sains-islam': Brain,
    };
    return iconMap[slug] || BookOpen;
  };
  const categories = useMemo(
    () => [
      {
        id: 'semua',
        label: 'Semua Ulama',
        icon: User,
        description: 'Tampilkan semua ulama dari berbagai kategori',
      },
      ...data.categories.map((c: any) => ({
        id: c.slug,
        label: c.name,
        icon: getCategoryIcon(c.slug),
        description: c.description,
      })),
    ],
    [data.categories],
  );

  const enrichedUlama = useMemo(() => {
    const worksMap = data.worksMap as Record<string, string[]>;
    return data.ulama.map((u: any) => ({
      ...u,
      majorWorks: worksMap[u.id as string] || [],
      category: data.categories.find((c: any) => c.id === u.categoryId)?.slug || 'lain',
    }));
  }, [data]);

  function updateParam(key: string, val: string) {
    const sp = new URLSearchParams(searchParams);
    if (val === '' || val === 'semua') {
      if (key === 'cat') sp.delete('cat');
      else sp.set(key, val);
    } else {
      sp.set(key, val);
    }
    if (key !== 'page') sp.set('page', '1');
    setSearchParams(sp);
  }

  function toggleOrder() {
    updateParam('order', order === 'asc' ? 'desc' : 'asc');
  }

  function handleEdit(ulama: any) {
    setEditingUlama(ulama);
    setIsEditDialogOpen(true);
  }

  function handleDelete(ulamaId: string) {
    if (confirm('Apakah Anda yakin ingin menghapus ulama ini?')) {
      const formData = new FormData();
      formData.set('intent', 'delete');
      formData.set('ulamaId', ulamaId);
      submit(formData, { method: 'post' });
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Ulama</h1>
            <p className="text-muted-foreground">
              Kelola data biografi ulama Ahli Sunnah wal Jamaah
            </p>
          </div>
          {isAdminRole(user.role as AppRole) && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Ulama
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ulama</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUlama}</div>
              <p className="text-xs text-muted-foreground">Terdaftar dalam sistem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategori</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">Madzhab & bidang</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Karya</CardTitle>
              <Scroll className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalWorks}</div>
              <p className="text-xs text-muted-foreground">Kitab & risalah</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filter & Search */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter - Organized by Groups */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter berdasarkan kategori:</span>
              </div>

              {/* All Categories Button */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  key="semua"
                  variant={selectedCategory === 'semua' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateParam('cat', 'semua')}
                  className="text-xs sm:text-sm"
                >
                  <User className="w-4 h-4 mr-1" />
                  Semua Ulama
                </Button>
              </div>

              {/* Grouped Categories */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Madzhab Fiqih */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    Madzhab Fiqih
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) => ['hanafi', 'maliki', 'syafii', 'hanbali'].includes(c.id))
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label.replace('Madzhab ', '')}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Bidang Keilmuan */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Bidang Keilmuan
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) =>
                        [
                          'hadits',
                          'tafsir',
                          'aqidah',
                          'tasawuf',
                          'ushul-fiqh',
                          'nahw-sharaf',
                          'sirah',
                          'mantiq',
                        ].includes(c.id),
                      )
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label.replace('Ahli ', '')}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Thariqah */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Thariqah
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) =>
                        ['qadiriyyah', 'naqsyabandiyyah', 'syadziliyyah', 'rifaiyyah'].includes(
                          c.id,
                        ),
                      )
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label.replace('Thariqah ', '')}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Periode */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Periode
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) =>
                        [
                          'sahabat',
                          'salaf',
                          'klasik',
                          'pertengahan',
                          'modern',
                          'kontemporer',
                        ].includes(c.id),
                      )
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label.replace('Ulama ', '')}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Regional */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Regional & Organisasi
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) =>
                        ['nusantara', 'nahdlatul-ulama', 'muhammadiyah', 'azhar'].includes(c.id),
                      )
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Bidang Khusus */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Bidang Khusus
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categories
                      .filter((c) =>
                        [
                          'dakwah',
                          'pendidikan',
                          'ekonomi-islam',
                          'politik-islam',
                          'sains-islam',
                        ].includes(c.id),
                      )
                      .map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateParam('cat', category.id)}
                          className="text-xs h-7"
                          title={category.description}
                        >
                          <category.icon className="w-3 h-3 mr-1" />
                          {category.label.replace('Ahli ', '')}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Sort */}
            <Form method="get" className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  name="q"
                  defaultValue={searchTerm}
                  placeholder="Cari ulama (nama, biografi, kontribusi)..."
                  className="pl-9"
                />
              </div>
              <Select name="sort" defaultValue={sort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nama</SelectItem>
                  <SelectItem value="period">Periode</SelectItem>
                  <SelectItem value="created">Ditambahkan</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <input type="hidden" name="order" value={order} />
                <input
                  type="hidden"
                  name="cat"
                  value={selectedCategory === 'semua' ? '' : selectedCategory}
                />
                <input type="hidden" name="page" value="1" />
                <Button type="submit" variant="secondary" className="flex-1">
                  Terapkan
                </Button>
                <Button type="button" variant="outline" onClick={toggleOrder}>
                  {order === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ulama Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrichedUlama.map((ulama: any) => {
            const category = categories.find((c) => c.id === ulama.category);
            return (
              <UlamaCard
                key={ulama.id}
                ulama={ulama}
                category={category?.label || ulama.category}
                searchTerm={searchTerm}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userRole={user.role}
              />
            );
          })}
        </div>

        {enrichedUlama.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada ulama ditemukan</h3>
              <p className="text-muted-foreground text-center mb-4">
                Tidak ada data ulama yang sesuai dengan filter yang dipilih.
              </p>
              {isAdminRole(user.role as AppRole) && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Ulama Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParam('page', String(page - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {page} dari {totalPages}
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
          </div>
        </motion.div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Ulama Baru</DialogTitle>
            <DialogDescription>
              Tambahkan data biografis ulama baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="create-name" className="text-sm font-medium">
                  Nama *
                </label>
                <Input id="create-name" name="name" required placeholder="Imam Abu Hanifah" />
              </div>
              <div className="space-y-2">
                <label htmlFor="create-fullName" className="text-sm font-medium">
                  Nama Lengkap
                </label>
                <Input
                  id="create-fullName"
                  name="fullName"
                  placeholder="Nu'man bin Tsabit bin Zuta"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="create-categoryId" className="text-sm font-medium">
                  Kategori *
                </label>
                <Select name="categoryId" aria-required="true">
                  <SelectTrigger id="create-categoryId">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="create-periodCentury" className="text-sm font-medium">
                  Periode
                </label>
                <Input id="create-periodCentury" name="periodCentury" placeholder="2H" />
              </div>
              <div className="space-y-2">
                <label htmlFor="create-birth" className="text-sm font-medium">
                  Tahun Lahir
                </label>
                <Input id="create-birth" name="birth" placeholder="80 H" />
              </div>
              <div className="space-y-2">
                <label htmlFor="create-death" className="text-sm font-medium">
                  Tahun Wafat
                </label>
                <Input id="create-death" name="death" placeholder="150 H" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="create-birthPlace" className="text-sm font-medium">
                Tempat Lahir
              </label>
              <Input id="create-birthPlace" name="birthPlace" placeholder="Kufah, Irak" />
            </div>

            <div className="space-y-2">
              <label htmlFor="create-biography" className="text-sm font-medium">
                Biografi
              </label>
              <Textarea
                id="create-biography"
                name="biography"
                placeholder="Riwayat hidup singkat ulama..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="create-contribution" className="text-sm font-medium">
                Kontribusi
              </label>
              <Textarea
                id="create-contribution"
                name="contribution"
                placeholder="Kontribusi terhadap Islam dan umat..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="create-quote" className="text-sm font-medium">
                Kutipan Terkenal
              </label>
              <Textarea
                id="create-quote"
                name="quote"
                placeholder="Kutipan atau petuah dari ulama..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={fetcher.state === 'submitting'}>
                {fetcher.state === 'submitting' ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ulama</DialogTitle>
            <DialogDescription>Perbarui data biografis ulama</DialogDescription>
          </DialogHeader>
          {editingUlama && (
            <fetcher.Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="ulamaId" value={editingUlama.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Nama *
                  </label>
                  <Input id="edit-name" name="name" defaultValue={editingUlama.name} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-fullName" className="text-sm font-medium">
                    Nama Lengkap
                  </label>
                  <Input
                    id="edit-fullName"
                    name="fullName"
                    defaultValue={editingUlama.fullName || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-categoryId" className="text-sm font-medium">
                    Kategori *
                  </label>
                  <Select
                    name="categoryId"
                    defaultValue={editingUlama.categoryId}
                    aria-required="true"
                  >
                    <SelectTrigger id="edit-categoryId">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data.categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-periodCentury" className="text-sm font-medium">
                    Periode
                  </label>
                  <Input
                    id="edit-periodCentury"
                    name="periodCentury"
                    defaultValue={editingUlama.periodCentury || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-birth" className="text-sm font-medium">
                    Tahun Lahir
                  </label>
                  <Input id="edit-birth" name="birth" defaultValue={editingUlama.birth || ''} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-death" className="text-sm font-medium">
                    Tahun Wafat
                  </label>
                  <Input id="edit-death" name="death" defaultValue={editingUlama.death || ''} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-birthPlace" className="text-sm font-medium">
                  Tempat Lahir
                </label>
                <Input
                  id="edit-birthPlace"
                  name="birthPlace"
                  defaultValue={editingUlama.birthPlace || ''}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-biography" className="text-sm font-medium">
                  Biografi
                </label>
                <Textarea
                  id="edit-biography"
                  name="biography"
                  defaultValue={editingUlama.biography || ''}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-contribution" className="text-sm font-medium">
                  Kontribusi
                </label>
                <Textarea
                  id="edit-contribution"
                  name="contribution"
                  defaultValue={editingUlama.contribution || ''}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-quote" className="text-sm font-medium">
                  Kutipan Terkenal
                </label>
                <Textarea
                  id="edit-quote"
                  name="quote"
                  defaultValue={editingUlama.quote || ''}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={fetcher.state === 'submitting'}>
                  {fetcher.state === 'submitting' ? 'Menyimpan...' : 'Perbarui'}
                </Button>
              </div>
            </fetcher.Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer Credit */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Data Dikurasi oleh</h3>
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-1">
              Yogik Pratama Aprilian
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Owner & Admin SantriOnline - Ahli Sunnah wal Jamaah
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Database Ulama Terlengkap</span>
              </div>
              <div className="flex items-center gap-1">
                <BookCheck className="w-3 h-3" />
                <span>Referensi Terpercaya</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Manhaj Salafus Shalih</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
