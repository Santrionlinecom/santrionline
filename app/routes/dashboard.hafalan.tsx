import { useState, useEffect } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useFetcher, useLoaderData, useRevalidator } from '@remix-run/react';
import {
  user_hafalan_quran,
  user_progres_diniyah,
  diniyah_pelajaran,
  diniyah_kitab,
  quran_surah,
} from '~/db/schema';
import { eq } from 'drizzle-orm';
import { allSurahs, getSurahsByJuz, totalAyahsInQuran, type Surah } from '~/lib/quran-data';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Progress } from '~/components/ui/progress';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { BookOpen, Award, Star, CheckCircle, Loader2 } from 'lucide-react';
import { ToastViewport, pushToast } from '~/components/ui/toast';

// Types for better type safety
type QuranSummary = {
  totalSuratDihapal: number;
  totalAyatDihapal: number;
  persentaseHafalan: number;
};

type DiniyahKitab = {
  id: number;
  name: string;
  category: string;
  description: string;
  lessons: DiniyahLesson[];
};

type DiniyahLesson = {
  id: number;
  title: string;
  points: number;
  description?: string;
};

type DiniyahCurriculum = Record<string, DiniyahKitab>;

// Static data for Diniyah curriculum following Ahlussunnah wal Jama'ah tradition
export const diniyahCurriculum = {
  aqidah: {
    id: 1,
    name: 'Aqidatul Awam',
    category: 'Aqidah',
    description: "Kitab dasar aqidah Ahlussunnah wal Jama'ah",
    lessons: [
      { id: 1, title: 'Mukaddimah: Pengenalan Aqidah dan Keutamaannya', points: 5 },
      { id: 2, title: 'Sifat Wajib Allah: Wujud, Qidam, Baqa', points: 8 },
      {
        id: 3,
        title: 'Sifat Wajib Allah: Mukhalafatuhu lil Hawadits, Qiyamuhu bi Nafsihi',
        points: 8,
      },
      { id: 4, title: 'Sifat Wajib Allah: Wahdaniyyah (Keesaan Allah)', points: 7 },
      { id: 5, title: 'Sifat Wajib Allah: Qudrah, Iradah, Ilmu', points: 10 },
      { id: 6, title: "Sifat Wajib Allah: Hayah, Sama', Bashar", points: 8 },
      { id: 7, title: "Sifat Wajib Allah: Kalam dan sifat-sifat Ma'ani", points: 9 },
      { id: 8, title: 'Sifat Mustahil Allah: Adam, Huduts, Fana', points: 6 },
      { id: 9, title: 'Sifat Mustahil Allah: Mumatsalatu lil Hawadits', points: 5 },
      { id: 10, title: 'Sifat Mustahil Allah: Ihtiyaju ila Mahal dan Mahall', points: 5 },
      { id: 11, title: "Sifat Mustahil Allah: Ta'addud, Ajz, Karahah", points: 7 },
      { id: 12, title: 'Sifat Mustahil Allah: Jahl, Maut, Shamam, Bukm', points: 7 },
      { id: 13, title: "Sifat Jaiz Allah: Fi'lu kulli Mumkinin aw Tarkuhu", points: 6 },
      { id: 14, title: 'Sifat Wajib Rasul: Shidq, Amanah, Tabligh', points: 10 },
      { id: 15, title: 'Sifat Wajib Rasul: Fathonah dan Hikmah Para Rasul', points: 8 },
      { id: 16, title: 'Sifat Mustahil Rasul: Kizb, Khianat, Kitman', points: 7 },
      { id: 17, title: 'Sifat Mustahil Rasul: Baladah dan Kebodohan', points: 6 },
      { id: 18, title: "Sifat Jaiz Rasul: A'radh al-Bashariyyah", points: 6 },
      { id: 19, title: 'Iman kepada Malaikat: Jibril, Mikail, Israfil, Izrail', points: 8 },
      { id: 20, title: 'Iman kepada Kitab Suci: Taurat, Injil, Zabur, Al-Quran', points: 8 },
      { id: 21, title: 'Iman kepada Hari Akhir: Kematian, Kubur, Hisab', points: 10 },
      { id: 22, title: "Iman kepada Qada dan Qadar Allah ta'ala", points: 8 },
      { id: 23, title: "Penutup: Kesimpulan Aqidah Ahlussunnah wal Jama'ah", points: 6 },
    ],
  },
  hadits: {
    id: 2,
    name: 'Hadits Arbain Nawawi',
    category: 'Hadits',
    description: '40 hadits pilihan Imam Nawawi',
    lessons: [
      { id: 11, title: "Hadits 1: Innama al-A'malu bin Niyyat (Amal dengan Niat)", points: 3 },
      { id: 12, title: 'Hadits 2: Islam, Iman, Ihsan (Hadits Jibril)', points: 4 },
      { id: 13, title: "Hadits 3: Buniya al-Islam 'ala Khams (Rukun Islam)", points: 3 },
      { id: 14, title: "Hadits 4: Jam'u Khalq Ahadikum (Penciptaan Manusia)", points: 4 },
      { id: 15, title: 'Hadits 5: Man Ahdatha fi Amrina (Bidah dalam Agama)', points: 3 },
      { id: 16, title: 'Hadits 6: Inna al-Halala Bayyin (Halal dan Haram)', points: 4 },
      { id: 17, title: 'Hadits 7: Ad-Dinu an-Nasiha (Agama adalah Nasihat)', points: 3 },
      { id: 18, title: 'Hadits 8: Umirat an Uqatil an-Nas (Darah yang Haram)', points: 4 },
      { id: 19, title: 'Hadits 9: Hifz ma Amaraka Allah (Taklif dan Kemampuan)', points: 3 },
      { id: 20, title: 'Hadits 10: Inna Allah Tayyib (Rizki yang Baik)', points: 4 },
      { id: 21, title: "Hadits 11: Da' ma Yaribuka (Tinggalkan yang Meragukan)", points: 3 },
      {
        id: 22,
        title: "Hadits 12: Min Husni Islam al-Mar'i (Kebaikan Islam Seseorang)",
        points: 3,
      },
      { id: 23, title: "Hadits 13: La Yu'minu Ahadukum (Cinta kepada Saudara)", points: 3 },
      { id: 24, title: "Hadits 14: La Yahill Damu Imri'in Muslim (Darah Muslim Haram)", points: 4 },
      { id: 25, title: "Hadits 15: Man Kana Yu'minu billah (Berbuat Baik atau Diam)", points: 3 },
      { id: 26, title: 'Hadits 16: La Taghdab (Jangan Marah)', points: 3 },
      { id: 27, title: 'Hadits 17: Inna Allah Kataba al-Ihsan (Berbuat Ihsan)', points: 4 },
      { id: 28, title: 'Hadits 18: Ittaqillaha Haitsu ma Kunt (Takwa dan Akhlak)', points: 4 },
      { id: 29, title: 'Hadits 19: Ihfaz Allah Yahfazk (Allah Memelihara)', points: 4 },
      {
        id: 30,
        title: "Hadits 20: In Lam Tastahi fa Ashna' ma Shi't (Jika Tidak Malu)",
        points: 3,
      },
      { id: 31, title: 'Hadits 21: Qul Aamanta billahi (Iman kepada Allah)', points: 3 },
      { id: 32, title: 'Hadits 22: Wa man Salaka Tariqa (Menuntut Ilmu)', points: 4 },
      { id: 33, title: 'Hadits 23: At-Thuhuru Shatru al-Iman (Bersuci Separuh Iman)', points: 3 },
      {
        id: 34,
        title: 'Hadits 24: Ya Ibadi Inni Harramtu az-Zulm (Hadits Qudsi Kezaliman)',
        points: 5,
      },
      { id: 35, title: 'Hadits 25: Kullu Sulama mina an-Nas (Setiap Ruas Sedekah)', points: 3 },
      {
        id: 36,
        title: 'Hadits 26: Fi kulli Kabidin Rathbatin (Setiap Jiwa Ada Sedekah)',
        points: 3,
      },
      { id: 37, title: 'Hadits 27: Al-Birru Husnu al-Khuluq (Kebaikan adalah Akhlak)', points: 4 },
      { id: 38, title: 'Hadits 28: Ataituka bi Wasiyyat (Wasiat Berharga)', points: 4 },
      { id: 39, title: "Hadits 29: Man Saala 'anni Shay'an (Bertanya tentang Sesuatu)", points: 3 },
      { id: 40, title: "Hadits 30: Inna Allah ta'ala Ghayyur (Allah Maha Cemburu)", points: 4 },
      { id: 41, title: "Hadits 31: Hal ra'aita in Sallait (Pernahkah Engkau Melihat)", points: 3 },
      { id: 42, title: 'Hadits 32: La Dharara wa la Dhirar (Tidak Boleh Mudarat)', points: 4 },
      { id: 43, title: "Hadits 33: Bayyinatu 'ala al-Mudda'i (Bukti atas Penuduh)", points: 4 },
      { id: 44, title: "Hadits 34: Man Ra'a Minkum Munkaran (Melihat Kemungkaran)", points: 4 },
      { id: 45, title: "Hadits 35: La Yu'minu Ahadukum Hatta (Cinta Rasul)", points: 3 },
      { id: 46, title: "Hadits 36: Man Naffasa 'an Mu'minin (Melapangkan Kesusahan)", points: 4 },
      { id: 47, title: 'Hadits 37: Inna Allah Kataba al-Hasanat (Pahala Niat Baik)', points: 4 },
      { id: 48, title: "Hadits 38: Inna Allah ta'ala Qal (Hadits Qudsi Mendekat)", points: 5 },
      {
        id: 49,
        title: "Hadits 39: Inna Allah Tajawaza 'an Ummati (Allah Maafkan Umatku)",
        points: 4,
      },
      { id: 50, title: 'Hadits 40: Kun fi ad-Dunya (Hidup di Dunia)', points: 4 },
    ],
  },
  fiqih: {
    id: 3,
    name: 'Safinatun Najah',
    category: 'Fiqih',
    description: "Kitab fiqih dasar dalam mazhab Syafi'i",
    lessons: [
      { id: 51, title: "Mukaddimah: Pengenalan Fiqih dan Madzhab Syafi'i", points: 5 },
      { id: 52, title: 'Thaharah: Pengertian dan Pembagian Air', points: 6 },
      { id: 53, title: 'Thaharah: Najis dan Cara Mensucikannya', points: 7 },
      { id: 54, title: 'Thaharah: Wudhu - Fardhu, Sunnah, Makruh', points: 8 },
      { id: 55, title: 'Thaharah: Hal-hal yang Membatalkan Wudhu', points: 7 },
      { id: 56, title: 'Thaharah: Mandi Janabah - Fardhu dan Sunnahnya', points: 6 },
      { id: 57, title: 'Thaharah: Tayammum - Syarat dan Rukunnya', points: 5 },
      { id: 58, title: 'Thaharah: Haidh, Nifas, dan Istihadhah', points: 8 },
      { id: 59, title: 'Shalat: Syarat Wajib dan Syarat Sah Shalat', points: 9 },
      { id: 60, title: 'Shalat: Rukun Shalat yang 17', points: 10 },
      { id: 61, title: "Shalat: Sunnah Ab'adh, Sunnah Hay'ah, dan Adab", points: 8 },
      { id: 62, title: 'Shalat: Hal-hal yang Makruh dalam Shalat', points: 7 },
      { id: 63, title: 'Shalat: Hal-hal yang Membatalkan Shalat', points: 8 },
      { id: 64, title: "Shalat: Qadha, Shalat Jama' dan Qashar", points: 9 },
      { id: 65, title: 'Shalat: Shalat-shalat Sunnah (Rawatib, Tahajjud)', points: 7 },
      { id: 66, title: 'Zakat: Pengertian dan Hikmah Zakat', points: 6 },
      { id: 67, title: 'Zakat: Zakat Mal - Emas, Perak, Perdagangan', points: 8 },
      { id: 68, title: 'Zakat: Zakat Pertanian dan Buah-buahan', points: 7 },
      { id: 69, title: 'Zakat: Zakat Binatang Ternak', points: 6 },
      { id: 70, title: 'Zakat: Zakat Fitrah dan Mustahiqnya', points: 8 },
      { id: 71, title: 'Puasa: Pengertian dan Keutamaan Puasa', points: 6 },
      { id: 72, title: 'Puasa: Rukun dan Syarat Wajib Puasa', points: 7 },
      { id: 73, title: 'Puasa: Hal-hal yang Membatalkan Puasa', points: 8 },
      { id: 74, title: 'Puasa: Puasa Sunnah dan Puasa yang Diharamkan', points: 6 },
      { id: 75, title: 'Puasa: Fidyah, Kafarat, dan Qadha Puasa', points: 7 },
      { id: 76, title: 'Haji: Pengertian dan Keutamaan Haji', points: 6 },
      { id: 77, title: 'Haji: Syarat Wajib Haji dan Umrah', points: 7 },
      { id: 78, title: 'Haji: Rukun Haji dan Rukun Umrah', points: 9 },
      { id: 79, title: 'Haji: Wajib Haji dan Dam (Denda)', points: 8 },
      { id: 80, title: 'Haji: Larangan dalam Ihram dan Kafarat', points: 7 },
    ],
  },
  tasawuf: {
    id: 4,
    name: 'Bidayatul Hidayah',
    category: 'Tasawuf',
    description: 'Kitab tasawuf karya Imam Ghazali',
    lessons: [
      { id: 81, title: 'Mukaddimah: Pengenalan Tasawuf dan Ilmu Suluk', points: 6 },
      { id: 82, title: 'Adab dalam Ibadah: Wudhu dan Keutamaannya', points: 7 },
      { id: 83, title: 'Adab dalam Ibadah: Masuk Masjid dan Shalat', points: 8 },
      { id: 84, title: 'Adab dalam Ibadah: Membaca Al-Quran', points: 7 },
      { id: 85, title: 'Adab dalam Ibadah: Dzikir dan Doa', points: 6 },
      { id: 86, title: 'Adab Makan dan Minum: Doa dan Tata Cara', points: 6 },
      { id: 87, title: 'Adab Tidur dan Bangun: Doa dan Sunnahnya', points: 5 },
      { id: 88, title: 'Adab Berbicara: Memilih Kata yang Baik', points: 7 },
      { id: 89, title: 'Adab Berbicara: Menghindari Ghibah dan Namimah', points: 7 },
      { id: 90, title: 'Adab Bergaul: Dengan Orang Tua dan Keluarga', points: 8 },
      { id: 91, title: 'Adab Bergaul: Dengan Teman dan Tetangga', points: 7 },
      { id: 92, title: 'Adab Bergaul: Dengan Guru dan Ulama', points: 8 },
      { id: 93, title: 'Adab Majelis Ilmu: Duduk dan Menuntut Ilmu', points: 8 },
      { id: 94, title: 'Adab Majelis Ilmu: Menghormati Guru dan Kitab', points: 7 },
      { id: 95, title: 'Tazkiyatun Nafs: Membersihkan Jiwa dari Sifat Tercela', points: 9 },
      { id: 96, title: 'Tazkiyatun Nafs: Mujahadan Nafs dan Riyadhah', points: 8 },
      { id: 97, title: 'Akhlak kepada Allah: Rasa Takut dan Harap', points: 9 },
      { id: 98, title: "Akhlak kepada Allah: Tawakkal dan Qana'ah", points: 8 },
      { id: 99, title: 'Akhlak kepada Allah: Syukur dan Sabar', points: 9 },
      { id: 100, title: "Akhlak kepada Rasul: Cinta dan Ittiba'", points: 8 },
      { id: 101, title: 'Akhlak kepada Rasul: Shalawat dan Salam', points: 6 },
      { id: 102, title: 'Akhlak kepada Sesama: Kasih Sayang dan Tolong Menolong', points: 8 },
      { id: 103, title: 'Akhlak kepada Sesama: Ikhlas dan Husnudzan', points: 7 },
      { id: 104, title: 'Riyadhah dan Mujahadah: Latihan Spiritual', points: 9 },
      { id: 105, title: 'Riyadhah dan Mujahadah: Tingkatan Para Salik', points: 8 },
      { id: 106, title: 'Penutup: Maqamat dan Ahwal dalam Tasawuf', points: 8 },
    ],
  },
};

// NOTE: Removed unused getUserIdFromSession helper to avoid referencing server-only
// session module in the client bundle. Keep all session.server imports strictly
// inside loader/action only.

export const meta: MetaFunction = () => {
  return [{ title: 'Dasbor Hafalan - Santri Online' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getDb } = await import('~/db/drizzle.server');
  const db = getDb(context);
  const { requireUserId } = await import('~/lib/session.server');
  const userId = await requireUserId(request, context);

  // Auto-setup database tables if they don't exist
  try {
    // Check if tables exist instead of creating them
    // This prevents SQL syntax errors and lets migration handle table creation
    const tables = await db.$client
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('quran_surah', 'user', 'user_hafalan_quran', 'diniyah_kitab', 'diniyah_pelajaran', 'user_progres_diniyah')",
      )
      .all();

    if (tables.results.length < 6) {
      console.log('⚠️ Some tables are missing. Please run database migrations.');
      // Use the existing database migration instead of creating tables here
    }

    console.log('✅ Database tables ensured');
  } catch (error) {
    console.log('Database tables may already exist:', error);
  }

  // Ensure surahs exist in database
  try {
    const existingSurahs = await db.select().from(quran_surah).limit(1);

    if (existingSurahs.length === 0) {
      console.log('📖 Seeding Quran surahs...');

      // Use raw SQL for more reliable insertion
      for (const surah of allSurahs) {
        try {
          await db.$client
            .prepare('INSERT OR IGNORE INTO quran_surah (id, name, total_ayah) VALUES (?, ?, ?)')
            .bind(surah.number, surah.name, surah.numberOfAyahs)
            .run();
        } catch (error) {
          console.log(`Skipped surah ${surah.name}:`, error);
        }
      }

      console.log('✅ Surahs seeded successfully');
    }
  } catch (error) {
    console.error('Error checking/seeding surahs:', error);
  }

  // Ensure diniyah curriculum exists in database
  try {
    const existingKitab = await db.select().from(diniyah_kitab).limit(1);

    if (existingKitab.length === 0) {
      console.log('📚 Seeding Diniyah curriculum...');

      // Seed kitab data
      const kitabData = [
        {
          id: 1,
          name: 'Aqidatul Awam',
          category: 'Aqidah',
          description: "Kitab dasar aqidah Ahlussunnah wal Jama'ah",
        },
        {
          id: 2,
          name: 'Hadits Arbain Nawawi',
          category: 'Hadits',
          description: '40 hadits pilihan Imam Nawawi',
        },
        {
          id: 3,
          name: 'Safinatun Najah',
          category: 'Fiqih',
          description: "Kitab fiqih dasar dalam mazhab Syafi'i",
        },
        {
          id: 4,
          name: 'Bidayatul Hidayah',
          category: 'Tasawuf',
          description: 'Kitab tasawuf karya Imam Ghazali',
        },
      ];

      for (const kitab of kitabData) {
        await db.insert(diniyah_kitab).values(kitab).onConflictDoNothing().execute();
      }

      // Seed pelajaran data using the same structure as diniyahCurriculum
      const pelajaranData = [
        // Aqidatul Awam - Aqidah Ahlussunnah wal Jama'ah Lengkap
        { id: 1, kitabId: 1, title: 'Mukaddimah: Pengenalan Aqidah dan Keutamaannya', points: 5 },
        { id: 2, kitabId: 1, title: 'Sifat Wajib Allah: Wujud, Qidam, Baqa', points: 8 },
        {
          id: 3,
          kitabId: 1,
          title: 'Sifat Wajib Allah: Mukhalafatuhu lil Hawadits, Qiyamuhu bi Nafsihi',
          points: 8,
        },
        { id: 4, kitabId: 1, title: 'Sifat Wajib Allah: Wahdaniyyah (Keesaan Allah)', points: 7 },
        { id: 5, kitabId: 1, title: 'Sifat Wajib Allah: Qudrah, Iradah, Ilmu', points: 10 },
        { id: 6, kitabId: 1, title: "Sifat Wajib Allah: Hayah, Sama', Bashar", points: 8 },
        { id: 7, kitabId: 1, title: "Sifat Wajib Allah: Kalam dan sifat-sifat Ma'ani", points: 9 },
        { id: 8, kitabId: 1, title: 'Sifat Mustahil Allah: Adam, Huduts, Fana', points: 6 },
        { id: 9, kitabId: 1, title: 'Sifat Mustahil Allah: Mumatsalatu lil Hawadits', points: 5 },
        {
          id: 10,
          kitabId: 1,
          title: 'Sifat Mustahil Allah: Ihtiyaju ila Mahal dan Mahall',
          points: 5,
        },
        { id: 11, kitabId: 1, title: "Sifat Mustahil Allah: Ta'addud, Ajz, Karahah", points: 7 },
        { id: 12, kitabId: 1, title: 'Sifat Mustahil Allah: Jahl, Maut, Shamam, Bukm', points: 7 },
        {
          id: 13,
          kitabId: 1,
          title: "Sifat Jaiz Allah: Fi'lu kulli Mumkinin aw Tarkuhu",
          points: 6,
        },
        { id: 14, kitabId: 1, title: 'Sifat Wajib Rasul: Shidq, Amanah, Tabligh', points: 10 },
        {
          id: 15,
          kitabId: 1,
          title: 'Sifat Wajib Rasul: Fathonah dan Hikmah Para Rasul',
          points: 8,
        },
        { id: 16, kitabId: 1, title: 'Sifat Mustahil Rasul: Kizb, Khianat, Kitman', points: 7 },
        { id: 17, kitabId: 1, title: 'Sifat Mustahil Rasul: Baladah dan Kebodohan', points: 6 },
        { id: 18, kitabId: 1, title: "Sifat Jaiz Rasul: A'radh al-Bashariyyah", points: 6 },
        {
          id: 19,
          kitabId: 1,
          title: 'Iman kepada Malaikat: Jibril, Mikail, Israfil, Izrail',
          points: 8,
        },
        {
          id: 20,
          kitabId: 1,
          title: 'Iman kepada Kitab Suci: Taurat, Injil, Zabur, Al-Quran',
          points: 8,
        },
        { id: 21, kitabId: 1, title: 'Iman kepada Hari Akhir: Kematian, Kubur, Hisab', points: 10 },
        { id: 22, kitabId: 1, title: "Iman kepada Qada dan Qadar Allah ta'ala", points: 8 },
        {
          id: 23,
          kitabId: 1,
          title: "Penutup: Kesimpulan Aqidah Ahlussunnah wal Jama'ah",
          points: 6,
        },
        // Hadits Arbain Nawawi - 40 Hadits Lengkap
        {
          id: 11,
          kitabId: 2,
          title: "Hadits 1: Innama al-A'malu bin Niyyat (Amal dengan Niat)",
          points: 3,
        },
        { id: 12, kitabId: 2, title: 'Hadits 2: Islam, Iman, Ihsan (Hadits Jibril)', points: 4 },
        {
          id: 13,
          kitabId: 2,
          title: "Hadits 3: Buniya al-Islam 'ala Khams (Rukun Islam)",
          points: 3,
        },
        {
          id: 14,
          kitabId: 2,
          title: "Hadits 4: Jam'u Khalq Ahadikum (Penciptaan Manusia)",
          points: 4,
        },
        {
          id: 15,
          kitabId: 2,
          title: 'Hadits 5: Man Ahdatha fi Amrina (Bidah dalam Agama)',
          points: 3,
        },
        {
          id: 16,
          kitabId: 2,
          title: 'Hadits 6: Inna al-Halala Bayyin (Halal dan Haram)',
          points: 4,
        },
        {
          id: 17,
          kitabId: 2,
          title: 'Hadits 7: Ad-Dinu an-Nasiha (Agama adalah Nasihat)',
          points: 3,
        },
        {
          id: 18,
          kitabId: 2,
          title: 'Hadits 8: Umirat an Uqatil an-Nas (Darah yang Haram)',
          points: 4,
        },
        {
          id: 19,
          kitabId: 2,
          title: 'Hadits 9: Hifz ma Amaraka Allah (Taklif dan Kemampuan)',
          points: 3,
        },
        { id: 20, kitabId: 2, title: 'Hadits 10: Inna Allah Tayyib (Rizki yang Baik)', points: 4 },
        {
          id: 21,
          kitabId: 2,
          title: "Hadits 11: Da' ma Yaribuka (Tinggalkan yang Meragukan)",
          points: 3,
        },
        {
          id: 22,
          kitabId: 2,
          title: "Hadits 12: Min Husni Islam al-Mar'i (Kebaikan Islam Seseorang)",
          points: 3,
        },
        {
          id: 23,
          kitabId: 2,
          title: "Hadits 13: La Yu'minu Ahadukum (Cinta kepada Saudara)",
          points: 3,
        },
        {
          id: 24,
          kitabId: 2,
          title: "Hadits 14: La Yahill Damu Imri'in Muslim (Darah Muslim Haram)",
          points: 4,
        },
        {
          id: 25,
          kitabId: 2,
          title: "Hadits 15: Man Kana Yu'minu billah (Berbuat Baik atau Diam)",
          points: 3,
        },
        { id: 26, kitabId: 2, title: 'Hadits 16: La Taghdab (Jangan Marah)', points: 3 },
        {
          id: 27,
          kitabId: 2,
          title: 'Hadits 17: Inna Allah Kataba al-Ihsan (Berbuat Ihsan)',
          points: 4,
        },
        {
          id: 28,
          kitabId: 2,
          title: 'Hadits 18: Ittaqillaha Haitsu ma Kunt (Takwa dan Akhlak)',
          points: 4,
        },
        {
          id: 29,
          kitabId: 2,
          title: 'Hadits 19: Ihfaz Allah Yahfazk (Allah Memelihara)',
          points: 4,
        },
        {
          id: 30,
          kitabId: 2,
          title: "Hadits 20: In Lam Tastahi fa Ashna' ma Shi't (Jika Tidak Malu)",
          points: 3,
        },
        {
          id: 31,
          kitabId: 2,
          title: 'Hadits 21: Qul Aamanta billahi (Iman kepada Allah)',
          points: 3,
        },
        { id: 32, kitabId: 2, title: 'Hadits 22: Wa man Salaka Tariqa (Menuntut Ilmu)', points: 4 },
        {
          id: 33,
          kitabId: 2,
          title: 'Hadits 23: At-Thuhuru Shatru al-Iman (Bersuci Separuh Iman)',
          points: 3,
        },
        {
          id: 34,
          kitabId: 2,
          title: 'Hadits 24: Ya Ibadi Inni Harramtu az-Zulm (Hadits Qudsi Kezaliman)',
          points: 5,
        },
        {
          id: 35,
          kitabId: 2,
          title: 'Hadits 25: Kullu Sulama mina an-Nas (Setiap Ruas Sedekah)',
          points: 3,
        },
        {
          id: 36,
          kitabId: 2,
          title: 'Hadits 26: Fi kulli Kabidin Rathbatin (Setiap Jiwa Ada Sedekah)',
          points: 3,
        },
        {
          id: 37,
          kitabId: 2,
          title: 'Hadits 27: Al-Birru Husnu al-Khuluq (Kebaikan adalah Akhlak)',
          points: 4,
        },
        {
          id: 38,
          kitabId: 2,
          title: 'Hadits 28: Ataituka bi Wasiyyat (Wasiat Berharga)',
          points: 4,
        },
        {
          id: 39,
          kitabId: 2,
          title: "Hadits 29: Man Saala 'anni Shay'an (Bertanya tentang Sesuatu)",
          points: 3,
        },
        {
          id: 40,
          kitabId: 2,
          title: "Hadits 30: Inna Allah ta'ala Ghayyur (Allah Maha Cemburu)",
          points: 4,
        },
        {
          id: 41,
          kitabId: 2,
          title: "Hadits 31: Hal ra'aita in Sallait (Pernahkah Engkau Melihat)",
          points: 3,
        },
        {
          id: 42,
          kitabId: 2,
          title: 'Hadits 32: La Dharara wa la Dhirar (Tidak Boleh Mudarat)',
          points: 4,
        },
        {
          id: 43,
          kitabId: 2,
          title: "Hadits 33: Bayyinatu 'ala al-Mudda'i (Bukti atas Penuduh)",
          points: 4,
        },
        {
          id: 44,
          kitabId: 2,
          title: "Hadits 34: Man Ra'a Minkum Munkaran (Melihat Kemungkaran)",
          points: 4,
        },
        {
          id: 45,
          kitabId: 2,
          title: "Hadits 35: La Yu'minu Ahadukum Hatta (Cinta Rasul)",
          points: 3,
        },
        {
          id: 46,
          kitabId: 2,
          title: "Hadits 36: Man Naffasa 'an Mu'minin (Melapangkan Kesusahan)",
          points: 4,
        },
        {
          id: 47,
          kitabId: 2,
          title: 'Hadits 37: Inna Allah Kataba al-Hasanat (Pahala Niat Baik)',
          points: 4,
        },
        {
          id: 48,
          kitabId: 2,
          title: "Hadits 38: Inna Allah ta'ala Qal (Hadits Qudsi Mendekat)",
          points: 5,
        },
        {
          id: 49,
          kitabId: 2,
          title: "Hadits 39: Inna Allah Tajawaza 'an Ummati (Allah Maafkan Umatku)",
          points: 4,
        },
        { id: 50, kitabId: 2, title: 'Hadits 40: Kun fi ad-Dunya (Hidup di Dunia)', points: 4 },
        // Safinatun Najah - Fiqih Madzhab Syafi'i Lengkap
        {
          id: 51,
          kitabId: 3,
          title: "Mukaddimah: Pengenalan Fiqih dan Madzhab Syafi'i",
          points: 5,
        },
        { id: 52, kitabId: 3, title: 'Thaharah: Pengertian dan Pembagian Air', points: 6 },
        { id: 53, kitabId: 3, title: 'Thaharah: Najis dan Cara Mensucikannya', points: 7 },
        { id: 54, kitabId: 3, title: 'Thaharah: Wudhu - Fardhu, Sunnah, Makruh', points: 8 },
        { id: 55, kitabId: 3, title: 'Thaharah: Hal-hal yang Membatalkan Wudhu', points: 7 },
        { id: 56, kitabId: 3, title: 'Thaharah: Mandi Janabah - Fardhu dan Sunnahnya', points: 6 },
        { id: 57, kitabId: 3, title: 'Thaharah: Tayammum - Syarat dan Rukunnya', points: 5 },
        { id: 58, kitabId: 3, title: 'Thaharah: Haidh, Nifas, dan Istihadhah', points: 8 },
        { id: 59, kitabId: 3, title: 'Shalat: Syarat Wajib dan Syarat Sah Shalat', points: 9 },
        { id: 60, kitabId: 3, title: 'Shalat: Rukun Shalat yang 17', points: 10 },
        { id: 61, kitabId: 3, title: "Shalat: Sunnah Ab'adh, Sunnah Hay'ah, dan Adab", points: 8 },
        { id: 62, kitabId: 3, title: 'Shalat: Hal-hal yang Makruh dalam Shalat', points: 7 },
        { id: 63, kitabId: 3, title: 'Shalat: Hal-hal yang Membatalkan Shalat', points: 8 },
        { id: 64, kitabId: 3, title: "Shalat: Qadha, Shalat Jama' dan Qashar", points: 9 },
        {
          id: 65,
          kitabId: 3,
          title: 'Shalat: Shalat-shalat Sunnah (Rawatib, Tahajjud)',
          points: 7,
        },
        { id: 66, kitabId: 3, title: 'Zakat: Pengertian dan Hikmah Zakat', points: 6 },
        { id: 67, kitabId: 3, title: 'Zakat: Zakat Mal - Emas, Perak, Perdagangan', points: 8 },
        { id: 68, kitabId: 3, title: 'Zakat: Zakat Pertanian dan Buah-buahan', points: 7 },
        { id: 69, kitabId: 3, title: 'Zakat: Zakat Binatang Ternak', points: 6 },
        { id: 70, kitabId: 3, title: 'Zakat: Zakat Fitrah dan Mustahiqnya', points: 8 },
        { id: 71, kitabId: 3, title: 'Puasa: Pengertian dan Keutamaan Puasa', points: 6 },
        { id: 72, kitabId: 3, title: 'Puasa: Rukun dan Syarat Wajib Puasa', points: 7 },
        { id: 73, kitabId: 3, title: 'Puasa: Hal-hal yang Membatalkan Puasa', points: 8 },
        { id: 74, kitabId: 3, title: 'Puasa: Puasa Sunnah dan Puasa yang Diharamkan', points: 6 },
        { id: 75, kitabId: 3, title: 'Puasa: Fidyah, Kafarat, dan Qadha Puasa', points: 7 },
        { id: 76, kitabId: 3, title: 'Haji: Pengertian dan Keutamaan Haji', points: 6 },
        { id: 77, kitabId: 3, title: 'Haji: Syarat Wajib Haji dan Umrah', points: 7 },
        { id: 78, kitabId: 3, title: 'Haji: Rukun Haji dan Rukun Umrah', points: 9 },
        { id: 79, kitabId: 3, title: 'Haji: Wajib Haji dan Dam (Denda)', points: 8 },
        { id: 80, kitabId: 3, title: 'Haji: Larangan dalam Ihram dan Kafarat', points: 7 },
        // Bidayatul Hidayah - Tasawuf Imam Ghazali Lengkap
        { id: 81, kitabId: 4, title: 'Mukaddimah: Pengenalan Tasawuf dan Ilmu Suluk', points: 6 },
        { id: 82, kitabId: 4, title: 'Adab dalam Ibadah: Wudhu dan Keutamaannya', points: 7 },
        { id: 83, kitabId: 4, title: 'Adab dalam Ibadah: Masuk Masjid dan Shalat', points: 8 },
        { id: 84, kitabId: 4, title: 'Adab dalam Ibadah: Membaca Al-Quran', points: 7 },
        { id: 85, kitabId: 4, title: 'Adab dalam Ibadah: Dzikir dan Doa', points: 6 },
        { id: 86, kitabId: 4, title: 'Adab Makan dan Minum: Doa dan Tata Cara', points: 6 },
        { id: 87, kitabId: 4, title: 'Adab Tidur dan Bangun: Doa dan Sunnahnya', points: 5 },
        { id: 88, kitabId: 4, title: 'Adab Berbicara: Memilih Kata yang Baik', points: 7 },
        { id: 89, kitabId: 4, title: 'Adab Berbicara: Menghindari Ghibah dan Namimah', points: 7 },
        { id: 90, kitabId: 4, title: 'Adab Bergaul: Dengan Orang Tua dan Keluarga', points: 8 },
        { id: 91, kitabId: 4, title: 'Adab Bergaul: Dengan Teman dan Tetangga', points: 7 },
        { id: 92, kitabId: 4, title: 'Adab Bergaul: Dengan Guru dan Ulama', points: 8 },
        { id: 93, kitabId: 4, title: 'Adab Majelis Ilmu: Duduk dan Menuntut Ilmu', points: 8 },
        { id: 94, kitabId: 4, title: 'Adab Majelis Ilmu: Menghormati Guru dan Kitab', points: 7 },
        {
          id: 95,
          kitabId: 4,
          title: 'Tazkiyatun Nafs: Membersihkan Jiwa dari Sifat Tercela',
          points: 9,
        },
        { id: 96, kitabId: 4, title: 'Tazkiyatun Nafs: Mujahadan Nafs dan Riyadhah', points: 8 },
        { id: 97, kitabId: 4, title: 'Akhlak kepada Allah: Rasa Takut dan Harap', points: 9 },
        { id: 98, kitabId: 4, title: "Akhlak kepada Allah: Tawakkal dan Qana'ah", points: 8 },
        { id: 99, kitabId: 4, title: 'Akhlak kepada Allah: Syukur dan Sabar', points: 9 },
        { id: 100, kitabId: 4, title: "Akhlak kepada Rasul: Cinta dan Ittiba'", points: 8 },
        { id: 101, kitabId: 4, title: 'Akhlak kepada Rasul: Shalawat dan Salam', points: 6 },
        {
          id: 102,
          kitabId: 4,
          title: 'Akhlak kepada Sesama: Kasih Sayang dan Tolong Menolong',
          points: 8,
        },
        { id: 103, kitabId: 4, title: 'Akhlak kepada Sesama: Ikhlas dan Husnudzan', points: 7 },
        { id: 104, kitabId: 4, title: 'Riyadhah dan Mujahadah: Latihan Spiritual', points: 9 },
        { id: 105, kitabId: 4, title: 'Riyadhah dan Mujahadah: Tingkatan Para Salik', points: 8 },
        { id: 106, kitabId: 4, title: 'Penutup: Maqamat dan Ahwal dalam Tasawuf', points: 8 },
      ];

      for (const pelajaran of pelajaranData) {
        await db.insert(diniyah_pelajaran).values(pelajaran).onConflictDoNothing().execute();
      }

      console.log('✅ Diniyah curriculum seeded successfully');
    }
  } catch (error) {
    console.error('Error checking/seeding diniyah curriculum:', error);
  }

  // Get Quran memorization progress
  const userQuranProgress = await db.query.user_hafalan_quran.findMany({
    where: eq(user_hafalan_quran.userId, userId),
  });

  // Get Diniyah progress from database
  const userDiniyahProgress = await db.query.user_progres_diniyah.findMany({
    where: eq(user_progres_diniyah.userId, userId),
  });

  // Get all diniyah curriculum from database
  const diniyahKitabList = await db.query.diniyah_kitab.findMany({
    with: {
      pelajaran: true,
    },
  });

  // Transform database data to match the expected format
  const diniyahCurriculumFromDB = diniyahKitabList.reduce((acc, kitab) => {
    acc[kitab.category.toLowerCase()] = {
      id: kitab.id,
      name: kitab.name,
      category: kitab.category,
      description: kitab.description || '',
      lessons: (kitab.pelajaran || []).map((p) => ({
        id: p.id,
        title: p.title,
        points: p.points,
      })),
    };
    return acc;
  }, {} as DiniyahCurriculum);

  // Calculate Quran statistics
  let totalAyatDihapal = 0;
  let totalSuratDihapal = 0;
  const progressMap = new Map(userQuranProgress.map((p) => [p.surahId, p]));

  allSurahs.forEach((surah) => {
    const progress = progressMap.get(surah.number);
    if (progress) {
      totalAyatDihapal += progress.completedAyah;
      if (progress.completedAyah === surah.numberOfAyahs) {
        totalSuratDihapal++;
      }
    }
  });

  const persentaseHafalanQuran = (totalAyatDihapal / totalAyahsInQuran) * 100;

  // Calculate Diniyah statistics
  const diniyahProgressMap = new Map(userDiniyahProgress.map((p) => [p.pelajaranId, p.status]));
  let totalLessonsCompleted = 0;
  let totalLessons = 0;
  let totalPointsEarned = 0;
  let totalPointsAvailable = 0;

  diniyahKitabList.forEach((kitab) => {
    if (kitab.pelajaran) {
      kitab.pelajaran.forEach((lesson) => {
        totalLessons++;
        totalPointsAvailable += lesson.points;
        const status = diniyahProgressMap.get(lesson.id);
        if (status === 'completed') {
          totalLessonsCompleted++;
          totalPointsEarned += lesson.points;
        }
      });
    }
  });

  const persentaseHafalanDiniyah =
    totalLessons > 0 ? (totalLessonsCompleted / totalLessons) * 100 : 0;

  return json({
    userId,
    userQuranProgress: userQuranProgress.map((p) => ({
      surahId: p.surahId,
      completedAyah: p.completedAyah,
    })),
    userDiniyahProgress: userDiniyahProgress.map((p) => ({
      lessonId: p.pelajaranId,
      status: p.status,
    })),
    diniyahCurriculum: diniyahCurriculumFromDB,
    quranSummary: {
      totalSuratDihapal,
      totalAyatDihapal,
      persentaseHafalan: persentaseHafalanQuran,
    },
    diniyahSummary: {
      totalLessonsCompleted,
      totalLessons,
      totalPointsEarned,
      totalPointsAvailable,
      persentaseHafalan: persentaseHafalanDiniyah,
    },
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { getDb } = await import('~/db/drizzle.server');
  const db = getDb(context);
  const { requireUserId } = await import('~/lib/session.server');
  const userId = await requireUserId(request, context);
  const formData = await request.formData();

  const actionType = formData.get('actionType');

  if (actionType === 'quran') {
    const surahId = Number(formData.get('surahId'));
    const isCompleted = formData.get('isCompleted') === 'true';

    if (!surahId || surahId < 1 || surahId > 114) {
      return json({ success: false, error: 'Surah tidak valid' }, { status: 400 });
    }

    const surahInfo = allSurahs.find((s) => s.number === surahId);
    if (!surahInfo) {
      return json({ success: false, error: 'Informasi surat tidak ditemukan' }, { status: 404 });
    }

    const completedAyah = isCompleted ? surahInfo.numberOfAyahs : 0;

    try {
      // First ensure the surah exists in quran_surah table
      await db
        .insert(quran_surah)
        .values({
          id: surahId,
          name: surahInfo.name,
          totalAyah: surahInfo.numberOfAyahs,
        })
        .onConflictDoNothing()
        .execute();

      // Then insert/update the user progress
      await db
        .insert(user_hafalan_quran)
        .values({ userId, surahId, completedAyah })
        .onConflictDoUpdate({
          target: [user_hafalan_quran.userId, user_hafalan_quran.surahId],
          set: { completedAyah },
        })
        .execute();

      // Broadcast SSE event (dynamic import to keep server-only code out of client bundle)
      try {
        const { broadcastHafalanEvent } = await import('./api.hafalan.stream');
        broadcastHafalanEvent({ type: 'quran_update', surahId, completedAyah, userId });
      } catch {
        // ignore broadcast errors
      }
      return json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      return json(
        {
          success: false,
          error: 'Gagal menyimpan data hafalan: ' + (error as Error).message,
        },
        { status: 500 },
      );
    }
  }

  if (actionType === 'diniyah') {
    const lessonId = Number(formData.get('lessonId'));
    const status = formData.get('status') as 'not_started' | 'in_progress' | 'completed';

    if (!lessonId || !status) {
      return json({ success: false, error: 'Data tidak valid' }, { status: 400 });
    }

    try {
      // Insert or update user progress in database
      await db
        .insert(user_progres_diniyah)
        .values({
          userId,
          pelajaranId: lessonId,
          status,
          completedAt: status === 'completed' ? new Date() : null,
        })
        .onConflictDoUpdate({
          target: [user_progres_diniyah.userId, user_progres_diniyah.pelajaranId],
          set: {
            status,
            completedAt: status === 'completed' ? new Date() : null,
          },
        })
        .execute();

      try {
        const { broadcastHafalanEvent } = await import('./api.hafalan.stream');
        broadcastHafalanEvent({ type: 'diniyah_update', lessonId, status, userId });
      } catch {
        // ignore broadcast errors
      }
      return json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      return json(
        {
          success: false,
          error: 'Gagal menyimpan progress diniyah: ' + (error as Error).message,
        },
        { status: 500 },
      );
    }
  }

  return json({ success: false, error: 'Action tidak dikenali' }, { status: 400 });
}

export default function HafalanDashboard() {
  const {
    userId,
    userQuranProgress,
    userDiniyahProgress,
    diniyahCurriculum,
    quranSummary,
    diniyahSummary,
  } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<'quran' | 'diniyah'>('quran');
  const revalidator = useRevalidator();
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Local state (optimistic) for Quran progress & summary so chart updates realtime
  const [quranProgressState, setQuranProgressState] = useState(userQuranProgress);
  const [quranSummaryState, setQuranSummaryState] = useState(quranSummary);

  // Recalculate Quran summary helper
  const recalcQuranSummary = (progressArr: Array<{ surahId: number; completedAyah: number }>) => {
    let totalAyatDihapal = 0;
    let totalSuratDihapal = 0;
    const progressMap = new Map(progressArr.map((p) => [p.surahId, p.completedAyah]));
    for (const surah of allSurahs) {
      const completed = progressMap.get(surah.number) || 0;
      totalAyatDihapal += completed;
      if (completed === surah.numberOfAyahs) totalSuratDihapal++;
    }
    const persentaseHafalan = (totalAyatDihapal / totalAyahsInQuran) * 100;
    return { totalAyatDihapal, totalSuratDihapal, persentaseHafalan };
  };

  // Handler passed to child checkboxes for optimistic toggle
  const handleSurahToggle = (surah: Surah, checked: boolean) => {
    setQuranProgressState((prev) => {
      const existing = prev.find((p) => p.surahId === surah.number);
      let next: Array<{ surahId: number; completedAyah: number }>;
      if (existing) {
        next = prev.map((p) =>
          p.surahId === surah.number
            ? { ...p, completedAyah: checked ? surah.numberOfAyahs : 0 }
            : p,
        );
      } else {
        next = [
          ...prev,
          { surahId: surah.number, completedAyah: checked ? surah.numberOfAyahs : 0 },
        ];
      }
      setQuranSummaryState(recalcQuranSummary(next));
      return next;
    });
  };

  const totalHafalanProgress =
    (quranSummaryState.persentaseHafalan + diniyahSummary.persentaseHafalan) / 2;

  // When loader revalidates (server truth) sync optimistic state (if there are differences)
  useEffect(() => {
    // Only run after a revalidation completes
    if (revalidator.state === 'idle') {
      // We can optionally compare lengths; for simplicity just sync
      setQuranProgressState(userQuranProgress);
      setQuranSummaryState(quranSummary);
    }
  }, [revalidator.state, userQuranProgress, quranSummary]);

  // SSE subscription for multi-device realtime sync
  useEffect(() => {
    const es = new EventSource('/api/hafalan/stream');
    es.addEventListener('hafalan', (evt: MessageEvent) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.userId && data.userId !== userId) return; // ignore other users' events
        if (data.type === 'quran_update') {
          setQuranProgressState((prev) => {
            const existing = prev.find((p) => p.surahId === data.surahId);
            let next;
            if (existing) {
              next = prev.map((p) =>
                p.surahId === data.surahId ? { ...p, completedAyah: data.completedAyah } : p,
              );
            } else {
              next = [...prev, { surahId: data.surahId, completedAyah: data.completedAyah }];
            }
            setQuranSummaryState(recalcQuranSummary(next));
            return next;
          });
        }
        // Could handle diniyah_update similarly by triggering revalidation or future optimistic map
      } catch {
        // ignore JSON parsing errors
      }
    });
    es.onerror = () => {
      // Auto-reconnect: close and recreate later
      es.close();
      setTimeout(() => {
        // naive reconnect by forcing revalidation (which will re-run this effect if dependencies change)
        revalidator.revalidate();
      }, 5000);
    };
    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Debounce loading overlay
  useEffect(() => {
    if (revalidator.state === 'loading') {
      setIsDataLoading(true);
    } else {
      const timer = setTimeout(() => setIsDataLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [revalidator.state]);

  return (
    <div className="hafalan-dashboard container mx-auto max-w-7xl px-4 py-8 min-h-screen">
      <ToastViewport />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Progres Hafalan</h1>
        <p className="text-muted-foreground">
          Pantau kemajuan hafalan Al-Qur'an dan ilmu diniyah Anda
        </p>
      </div>

      {/* Loading overlay to prevent jumping */}
      {isDataLoading && (
        <div className="fixed inset-0 bg-black/5 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </div>
      )}

      {/* Overall Progress Summary */}
      <div
        className="stats-grid mb-8 transition-opacity duration-200"
        style={{ opacity: isDataLoading ? 0.7 : 1 }}
      >
        <Card className="progress-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Keseluruhan</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="card-container">
            <div className="text-2xl font-bold">{totalHafalanProgress.toFixed(1)}%</div>
            <Progress value={totalHafalanProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Quran + Diniyah</p>
          </CardContent>
        </Card>

        <Card className="progress-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hafalan Quran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="card-container">
            <div className="text-2xl font-bold">
              {quranSummaryState.persentaseHafalan.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {quranSummaryState.totalAyatDihapal}/{totalAyahsInQuran} ayat
            </p>
          </CardContent>
        </Card>

        <Card className="progress-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ilmu Diniyah</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="card-container">
            <div className="text-2xl font-bold">{diniyahSummary.persentaseHafalan.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {diniyahSummary.totalLessonsCompleted}/{diniyahSummary.totalLessons} pelajaran
            </p>
          </CardContent>
        </Card>

        <Card className="progress-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Poin</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="card-container">
            <div className="text-2xl font-bold">{diniyahSummary.totalPointsEarned}</div>
            <p className="text-xs text-muted-foreground">
              dari {diniyahSummary.totalPointsAvailable} poin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex space-x-1 mb-6 transition-opacity duration-200"
        style={{ opacity: isDataLoading ? 0.7 : 1 }}
      >
        <Button
          variant={activeTab === 'quran' ? 'default' : 'outline'}
          onClick={() => setActiveTab('quran')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Hafalan Al-Qur'an
        </Button>
        <Button
          variant={activeTab === 'diniyah' ? 'default' : 'outline'}
          onClick={() => setActiveTab('diniyah')}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          Hafalan Diniyah
        </Button>
      </div>

      {/* Content based on active tab */}
      <div className="transition-opacity duration-200" style={{ opacity: isDataLoading ? 0.7 : 1 }}>
        {activeTab === 'quran' ? (
          <QuranHafalanSection
            userProgress={quranProgressState}
            summary={quranSummaryState}
            revalidator={revalidator}
            onSurahToggle={handleSurahToggle}
          />
        ) : (
          <DiniyahHafalanSection
            userProgress={userDiniyahProgress}
            diniyahCurriculum={diniyahCurriculum}
          />
        )}
      </div>
    </div>
  );
}

function QuranHafalanSection({
  userProgress,
  summary,
  revalidator,
  onSurahToggle,
}: {
  userProgress: Array<{ surahId: number; completedAyah: number }>;
  summary: QuranSummary;
  revalidator: { revalidate: () => void };
  onSurahToggle: (surah: Surah, checked: boolean) => void;
}) {
  const surahsByJuz = getSurahsByJuz();
  const progressMap = new Map(userProgress.map((p) => [p.surahId, p.completedAyah]));

  const chartData = [
    { name: 'Sudah Dihapal', value: summary.totalAyatDihapal },
    { name: 'Belum Dihapal', value: totalAyahsInQuran - summary.totalAyatDihapal },
  ];
  const COLORS = ['#10b981', '#e5e7eb'];

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surat Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalSuratDihapal} / 114</div>
            <p className="text-xs text-muted-foreground">Surat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ayat Dihapal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalAyatDihapal} / {totalAyahsInQuran}
            </div>
            <p className="text-xs text-muted-foreground">Ayat</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persentase Hafalan Quran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{summary.persentaseHafalan.toFixed(2)}%</div>
            <Progress value={summary.persentaseHafalan} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Visualisasi Progres Quran</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                    animationBegin={0}
                    animationDuration={500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {surahsByJuz.map((surahs, index) => (
              <AccordionItem value={`juz-${index + 1}`} key={`juz-${index + 1}`}>
                <AccordionTrigger className="text-lg font-semibold">
                  Juz {index + 1}
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <div className="space-y-4 p-2">
                    {surahs.map((surah) => {
                      const completedAyah = progressMap.get(surah.number) || 0;
                      const isChecked = completedAyah === surah.numberOfAyahs;
                      return (
                        <SurahCheckbox
                          key={surah.number}
                          surah={surah}
                          defaultChecked={isChecked}
                          revalidator={revalidator}
                          onOptimisticToggle={onSurahToggle}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function DiniyahHafalanSection({
  userProgress,
  diniyahCurriculum,
}: {
  userProgress: Array<{ lessonId: number; status: string }>;
  diniyahCurriculum: DiniyahCurriculum;
}) {
  const progressMap = new Map(userProgress.map((p) => [p.lessonId, p.status]));

  const kitabData = Object.values(diniyahCurriculum).map((kitab: DiniyahKitab) => {
    const completedLessons = kitab.lessons
      ? kitab.lessons.filter((lesson: DiniyahLesson) => progressMap.get(lesson.id) === 'completed')
          .length
      : 0;
    const totalLessons = kitab.lessons ? kitab.lessons.length : 0;
    const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      name: kitab.name,
      completed: completedLessons,
      total: totalLessons,
      percentage: percentage,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {Object.values(diniyahCurriculum).map((kitab: DiniyahKitab) => {
          const completedLessons = kitab.lessons
            ? kitab.lessons.filter(
                (lesson: DiniyahLesson) => progressMap.get(lesson.id) === 'completed',
              ).length
            : 0;
          const totalLessons = kitab.lessons ? kitab.lessons.length : 0;
          const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          return (
            <Card key={kitab.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kitab.name}</CardTitle>
                <Badge variant="outline">{kitab.category}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedLessons} / {totalLessons}
                </div>
                <Progress value={percentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {percentage.toFixed(1)}% selesai
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Progres per Kitab</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kitabData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="percentage"
                    fill="#8884d8"
                    animationBegin={0}
                    animationDuration={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {Object.values(diniyahCurriculum).map((kitab: DiniyahKitab) => (
              <AccordionItem value={`kitab-${kitab.id}`} key={`kitab-${kitab.id}`}>
                <AccordionTrigger className="text-lg font-semibold">{kitab.name}</AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <p className="text-sm text-muted-foreground mb-4">{kitab.description}</p>
                  <div className="space-y-3">
                    {kitab.lessons
                      ? kitab.lessons.map((lesson: DiniyahLesson) => (
                          <DiniyahLessonCheckbox
                            key={lesson.id}
                            lesson={lesson}
                            defaultStatus={progressMap.get(lesson.id) || 'not_started'}
                          />
                        ))
                      : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function SurahCheckbox({
  surah,
  defaultChecked,
  revalidator,
  onOptimisticToggle,
}: {
  surah: Surah;
  defaultChecked: boolean;
  revalidator: { revalidate: () => void };
  onOptimisticToggle: (surah: Surah, checked: boolean) => void;
}) {
  const fetcher = useFetcher();
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const [isUpdating, setIsUpdating] = useState(false);
  const [prevValue, setPrevValue] = useState(defaultChecked);

  const handleChange = (checked: boolean) => {
    const boolChecked = !!checked;
    setPrevValue(isChecked);
    setIsChecked(boolChecked);
    onOptimisticToggle(surah, boolChecked);
    setIsUpdating(true);
    fetcher.submit(
      {
        actionType: 'quran',
        surahId: String(surah.number),
        isCompleted: String(boolChecked),
      },
      { method: 'post', action: '/dashboard/hafalan' },
    );
  };

  // Revalidate data when fetcher is done successfully with delay to prevent jumping
  useEffect(() => {
    if (fetcher.state === 'idle' && isUpdating) {
      const data = fetcher.data as { success?: boolean; error?: string };
      if (data?.success) {
        pushToast({ type: 'success', description: `Surah ${surah.name} disimpan.` });
        setTimeout(() => {
          revalidator.revalidate();
          setIsUpdating(false);
        }, 120);
      } else if (data && data.success === false) {
        // Rollback
        setIsChecked(prevValue);
        onOptimisticToggle(surah, prevValue);
        pushToast({
          type: 'error',
          description: data.error || `Gagal menyimpan surah ${surah.name}`,
        });
        setIsUpdating(false);
      }
    }
  }, [fetcher.state, fetcher.data, isUpdating, prevValue, surah, revalidator, onOptimisticToggle]);

  // Update checkbox state when defaultChecked prop changes (after revalidation)
  useEffect(() => {
    if (!isUpdating) {
      setIsChecked(defaultChecked);
    }
  }, [defaultChecked, isUpdating]);

  return (
    <div className="flex items-center justify-between rounded-md border p-3 checkbox-container">
      <Label htmlFor={`surah-${surah.number}`} className="flex-1 cursor-pointer pr-4">
        <p className="font-medium">
          {surah.number}. {surah.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {surah.indonesianName} ({surah.numberOfAyahs} Ayat)
        </p>
      </Label>
      <div className="relative flex items-center">
        <Checkbox
          id={`surah-${surah.number}`}
          checked={isChecked}
          onCheckedChange={handleChange}
          disabled={fetcher.state === 'submitting' || isUpdating}
          className={isUpdating ? 'opacity-60' : ''}
        />
        {isUpdating && (
          <Loader2 className="w-4 h-4 animate-spin absolute -right-6 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

function DiniyahLessonCheckbox({
  lesson,
  defaultStatus,
}: {
  lesson: { id: number; title: string; points: number };
  defaultStatus: string;
}) {
  const fetcher = useFetcher();
  const [status, setStatus] = useState(defaultStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: 'not_started' | 'in_progress' | 'completed') => {
    setStatus(newStatus);
    setIsUpdating(true);
    fetcher.submit(
      {
        actionType: 'diniyah',
        lessonId: String(lesson.id),
        status: newStatus,
      },
      { method: 'post', action: '/dashboard/hafalan' },
    );
  };

  // Add effect to handle revalidation with delay
  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      (fetcher.data as { success?: boolean })?.success &&
      isUpdating
    ) {
      // Delay revalidation to prevent layout jumping
      setTimeout(() => {
        setIsUpdating(false);
      }, 300);
    }
  }, [fetcher.state, fetcher.data, isUpdating]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in_progress':
        return 'Berjalan';
      default:
        return 'Belum Mulai';
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md border p-3 checkbox-container">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium">{lesson.title}</p>
          <Badge variant="outline" className="text-xs">
            {lesson.points} poin
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
          >
            {getStatusText(status)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={status === 'in_progress' ? 'default' : 'outline'}
          onClick={() => handleStatusChange('in_progress')}
          disabled={fetcher.state === 'submitting' || isUpdating}
        >
          Mulai
        </Button>
        <Button
          size="sm"
          variant={status === 'completed' ? 'default' : 'outline'}
          onClick={() => handleStatusChange('completed')}
          disabled={fetcher.state === 'submitting' || isUpdating}
        >
          Selesai
        </Button>
      </div>
    </div>
  );
}
