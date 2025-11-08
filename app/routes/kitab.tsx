import React, { useState, useMemo } from 'react';
import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import {
  BookOpen,
  Clock,
  Star,
  User,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  Heart,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: "Kitab Mu'tabarah - Santri Online" },
    {
      name: 'description',
      content:
        "Koleksi lengkap kitab-kitab mu'tabarah dari ulama Ahli Sunnah wal Jamaah. Pelajari Aqidatul Awam, Hadits Arbain Nawawi, Safinatun Najah, dan kitab klasik lainnya.",
    },
    {
      name: 'keywords',
      content:
        'kitab mustabarah, aqidatul awam, hadits arbain nawawi, safinatun najah, bidayatul hidayah, kitab kuning, ulama salaf',
    },
  ];
};

const KitabCard = ({ kitab }: { kitab: any }) => (
  <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 group">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between mb-3">
        <Badge variant={kitab.isCompleted ? 'default' : 'secondary'} className="text-xs">
          {kitab.category}
        </Badge>
        {kitab.isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
      </div>

      <CardTitle className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {kitab.name}
      </CardTitle>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{kitab.description}</p>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {kitab.completedLessons}/{kitab.totalLessons}
            </span>
          </div>
          <Progress value={kitab.progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{kitab.totalLessons} Pelajaran</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{kitab.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-muted-foreground">{kitab.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{kitab.students}+ Santri</span>
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          <Button asChild className="w-full" variant={kitab.isCompleted ? 'default' : 'outline'}>
            <Link to={`/kitab/${kitab.slug}`}>
              {kitab.isCompleted ? 'Mulai Belajar' : 'Segera Hadir'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DaftarKitab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'semua', label: 'Semua Kitab', count: 12 },
    { id: 'aqidah', label: 'Aqidah', count: 3 },
    { id: 'hadits', label: 'Hadits', count: 2 },
    { id: 'fiqih', label: 'Fiqih', count: 4 },
    { id: 'tasawuf', label: 'Tasawuf', count: 3 },
  ];

  const kitabList = useMemo(
    () => [
      // AQIDAH
      {
        id: 1,
        slug: 'aqidatul-awam',
        name: 'Aqidatul Awam',
        category: 'aqidah',
        description:
          "Kitab dasar aqidah Ahlussunnah wal Jama'ah yang mengajarkan sifat-sifat wajib, mustahil, dan jaiz bagi Allah dan Rasul-Nya. Sangat cocok untuk pemula yang ingin memahami dasar-dasar akidah Islam.",
        totalLessons: 20,
        completedLessons: 20,
        progress: 100,
        duration: '2-3 bulan',
        difficulty: 'Pemula',
        students: 1250,
        isCompleted: true,
        author: 'Syaikh Ahmad Zaini Dahlan',
        features: ['20 Sifat Wajib Allah', 'Sifat Rasul', 'Rukun Iman', 'Dalil Al-Quran & Hadits'],
      },
      {
        id: 2,
        slug: 'jawahirul-kalamiyyah',
        name: 'Jawahir Al-Kalamiyyah',
        category: 'aqidah',
        description:
          'Kitab aqidah tingkat lanjut yang membahas masalah-masalah teologi Islam secara mendalam. Cocok untuk santri yang telah menguasai Aqidatul Awam.',
        totalLessons: 25,
        completedLessons: 0,
        progress: 0,
        duration: '4-5 bulan',
        difficulty: 'Menengah',
        students: 750,
        isCompleted: false,
        author: 'Syaikh Ibrahim Al-Laqqani',
      },
      {
        id: 3,
        slug: 'umm-al-barahin',
        name: 'Umm Al-Barahin',
        category: 'aqidah',
        description:
          'Kitab aqidah yang berisi dalil-dalil aqli dan naqli untuk membuktikan keberadaan Allah dan sifat-sifat-Nya. Tingkat mahir untuk santri yang ingin mendalami ilmu kalam.',
        totalLessons: 30,
        completedLessons: 0,
        progress: 0,
        duration: '6 bulan',
        difficulty: 'Mahir',
        students: 450,
        isCompleted: false,
        author: 'Syaikh Muhammad bin Yusuf As-Sanusi',
      },

      // HADITS
      {
        id: 4,
        slug: 'hadits-arbain-nawawi',
        name: 'Hadits Arbain Nawawi',
        category: 'hadits',
        description:
          'Kumpulan 40 hadits pilihan Imam Nawawi yang mencakup dasar-dasar ajaran Islam. Setiap hadits dijelaskan dengan terjemahan, makna, dan hikmahnya secara lengkap.',
        totalLessons: 40,
        completedLessons: 40,
        progress: 100,
        duration: '3-4 bulan',
        difficulty: 'Pemula',
        students: 2100,
        isCompleted: true,
        author: 'Imam Yahya bin Syaraf An-Nawawi',
        features: ['40 Hadits Shahih', 'Terjemahan & Makna', 'Aplikasi Kehidupan', 'Sanad Hadits'],
      },
      {
        id: 5,
        slug: 'riyadhus-shalihin',
        name: 'Riyadhus Shalihin',
        category: 'hadits',
        description:
          'Kumpulan hadits-hadits pilihan tentang akhlak, adab, dan spiritual Islam. Kitab ini menjadi panduan praktis untuk meningkatkan kualitas ibadah dan akhlak.',
        totalLessons: 100,
        completedLessons: 0,
        progress: 0,
        duration: '8-10 bulan',
        difficulty: 'Menengah',
        students: 1650,
        isCompleted: false,
        author: 'Imam An-Nawawi',
      },

      // FIQIH
      {
        id: 6,
        slug: 'safinatun-najah',
        name: 'Safinatun Najah',
        category: 'fiqih',
        description:
          "Kitab fiqih dasar dalam mazhab Syafi'i yang membahas hukum-hukum ibadah seperti thaharah, shalat, zakat, puasa, dan haji dengan penjelasan yang mudah dipahami.",
        totalLessons: 15,
        completedLessons: 10,
        progress: 67,
        duration: '2-3 bulan',
        difficulty: 'Pemula',
        students: 1800,
        isCompleted: true,
        author: 'Syaikh Salim bin Sumair Al-Hadrami',
        features: ["Mazhab Syafi'i", 'Hukum Ibadah', 'Contoh Praktis', 'Dalil Syariah'],
      },
      {
        id: 7,
        slug: 'taqrib',
        name: 'Taqrib (Ghayat At-Taqrib)',
        category: 'fiqih',
        description:
          'Kitab fiqih tingkat menengah yang membahas berbagai masalah fiqih dengan lebih detail, termasuk muamalah, munakahat, dan jinayat.',
        totalLessons: 45,
        completedLessons: 0,
        progress: 0,
        duration: '5-6 bulan',
        difficulty: 'Menengah',
        students: 950,
        isCompleted: false,
        author: "Imam Abu Syuja' Al-Asfahani",
      },
      {
        id: 8,
        slug: 'minhaj-thalibin',
        name: 'Minhaj Ath-Thalibin',
        category: 'fiqih',
        description:
          "Kitab fiqih tingkat tinggi yang menjadi rujukan utama dalam mazhab Syafi'i. Membahas seluruh aspek hukum Islam secara komprehensif.",
        totalLessons: 80,
        completedLessons: 0,
        progress: 0,
        duration: '12 bulan',
        difficulty: 'Mahir',
        students: 620,
        isCompleted: false,
        author: 'Imam An-Nawawi',
      },
      {
        id: 9,
        slug: 'fathul-muin',
        name: "Fathul Mu'in",
        category: 'fiqih',
        description:
          "Syarah (penjelasan) dari kitab Qurratul Ain yang membahas fiqih mazhab Syafi'i secara detail dengan dalil-dalil yang kuat.",
        totalLessons: 60,
        completedLessons: 0,
        progress: 0,
        duration: '8-10 bulan',
        difficulty: 'Menengah',
        students: 780,
        isCompleted: false,
        author: 'Syaikh Zainuddin bin Abdul Aziz Al-Malibari',
      },

      // TASAWUF
      {
        id: 10,
        slug: 'bidayatul-hidayah',
        name: 'Bidayatul Hidayah',
        category: 'tasawuf',
        description:
          'Kitab tasawuf karya Imam Ghazali yang mengajarkan adab-adab dalam beribadah, bergaul, dan tazkiyatun nafs. Cocok untuk pemula yang ingin mempelajari tasawuf.',
        totalLessons: 15,
        completedLessons: 10,
        progress: 67,
        duration: '2-3 bulan',
        difficulty: 'Pemula',
        students: 1150,
        isCompleted: true,
        author: 'Imam Abu Hamid Al-Ghazali',
        features: ['Adab Ibadah', 'Tazkiyah Nafs', 'Akhlak Islami', 'Bimbingan Spiritual'],
      },
      {
        id: 11,
        slug: 'minhaj-abidin',
        name: 'Minhaj Al-Abidin',
        category: 'tasawuf',
        description:
          'Panduan praktis untuk para hamba Allah yang ingin mendekatkan diri kepada-Nya melalui ibadah dan wirid-wirid yang diamalkan ulama salaf.',
        totalLessons: 20,
        completedLessons: 0,
        progress: 0,
        duration: '3-4 bulan',
        difficulty: 'Menengah',
        students: 890,
        isCompleted: false,
        author: 'Imam Al-Ghazali',
      },
      {
        id: 12,
        slug: 'ihya-ulumuddin',
        name: 'Ihya Ulumuddin (Ringkasan)',
        category: 'tasawuf',
        description:
          'Ringkasan dari masterpiece Imam Ghazali tentang menghidupkan kembali ilmu-ilmu agama. Membahas hubungan lahir dan batin dalam beragama.',
        totalLessons: 50,
        completedLessons: 0,
        progress: 0,
        duration: '8-12 bulan',
        difficulty: 'Mahir',
        students: 560,
        isCompleted: false,
        author: 'Imam Al-Ghazali',
      },
    ],
    [],
  );

  const filteredKitab = useMemo(() => {
    let filtered = kitabList;

    if (selectedCategory !== 'semua') {
      filtered = filtered.filter((kitab) => kitab.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (kitab) =>
          kitab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kitab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kitab.author.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [kitabList, selectedCategory, searchQuery]);

  const completedKitab = kitabList.filter((k) => k.isCompleted);
  const inProgressKitab = kitabList.filter((k) => k.progress > 0 && k.progress < 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Kitab Mu'tabarah</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Koleksi lengkap kitab-kitab yang telah diakui dan diajarkan oleh ulama Ahli Sunnah wal
              Jamaah
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{kitabList.length}</div>
                <div className="text-sm text-muted-foreground">Total Kitab</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedKitab.length}</div>
                <div className="text-sm text-muted-foreground">Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{inProgressKitab.length}</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-muted-foreground">Kategori</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kitab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center mb-6">
            <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground mr-4">Kategori:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs sm:text-sm"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Kitab Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredKitab.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredKitab.map((kitab) => (
                <KitabCard key={kitab.id} kitab={kitab} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada kitab ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah kata kunci atau filter kategori</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Mulai Perjalanan Belajar Anda
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan santri lainnya yang telah memulai pembelajaran kitab
            mu'tabarah
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/daftar">
                <Heart className="w-5 h-5 mr-2" />
                Daftar Sekarang - Gratis
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link to="/tentang">
                <BookOpen className="w-5 h-5 mr-2" />
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
