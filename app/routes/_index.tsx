import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
// Removed unused Skeleton import to reduce bundle size
import { LoadingSkeleton } from '~/components/loading-skeleton';
import { FeatureGrid, TabContent } from '~/components/optimized-components';
import {
  BookOpen,
  Users,
  Award,
  Wallet,
  Palette,
  Star,
  Clock,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Sparkles,
  BookMarked,
  GraduationCap,
  Target,
  CheckCircle,
  BarChart3,
  FileText,
  Globe,
} from 'lucide-react';

// SEO Meta
export const meta: MetaFunction = () => {
  const title = 'Santri Online – Platform Edukasi Islam Ahli Sunnah wal Jamaah';
  const description =
    "Platform edukasi Islam berlandaskan manhaj Ahli Sunnah wal Jamaah 4 Madzhab. Pelajari Aqidah, Fiqih, Hadits, dan Tasawuf dari kitab mu'tabarah dengan bimbingan terpercaya.";
  const url = 'https://santrionline.com';
  const image = `${url}/og-image.jpg`;
  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content:
        'santri online, ahli sunnah wal jamaah, 4 madzhab, fiqih islam, aqidah aswaja, tasawuf, ulama salaf, pendidikan islam',
    },
    { name: 'author', content: 'Santri Online' },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
};

// Types
interface StatItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  color: string;
}
interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}
interface ScholarItem {
  name: string;
  period: string;
  madzhab: string;
  quote: string;
  img: string;
  slug: string;
}

// Memoized Components
const StatsCard = memo(({ stat, index }: { stat: StatItem; index: number }) => (
  <div
    className="text-center bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm scroll-animate opacity-0 translate-y-4"
    style={{ transitionDelay: `${index * 80}ms` }}
    aria-label={`${stat.label} ${stat.value}`}
  >
    <stat.icon aria-hidden className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-1.5 ${stat.color}`} />
    <div className="text-lg sm:text-xl font-semibold tracking-tight">{stat.value}</div>
    <div className="text-[11px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
  </div>
));

StatsCard.displayName = 'StatsCard';

const TestimonialCard = memo(
  ({ testimonial, index }: { testimonial: TestimonialItem; index: number }) => (
    <div
      className="scroll-animate opacity-0 translate-y-4"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <Card className="h-full overflow-hidden border shadow-sm hover:shadow-md transition-colors">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center mb-4">
            <div className="w-11 h-11 rounded-full bg-muted overflow-hidden mr-3 border border-primary/40">
              <img
                src={testimonial.avatar}
                alt={`Foto ${testimonial.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNS41MjI5IDI4IDMwIDIzLjUyMjkgMzAgMThDMzAgMTIuNDc3MSAyNS41MjI5IDggMjAgOEMxNC40NzcxIDggMTAgMTIuNDc3MSAxMCAxOEMxMCAyMy41MjI5IDE0LjQ3NzEgMjggMjAgMjhaIiBmaWxsPSIjOUI5Q0EwIi8+CjxwYXRoIGQ9Ik0yMCAxNy42QzE1LjEyOCAxNy42IDExLjIgMjEuNTI4IDExLjIgMjYuNFYyOC44SDI4LjhWMjYuNEMyOC44IDIxLjUyOCAyNC44NzIgMTcuNiAyMCAxNy42WiIgZmlsbD0iIzlCOUNBMCIvPgo8L3N2Zz4K';
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                {testimonial.name}
              </h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          <blockquote className="relative pl-4 text-[13px] sm:text-sm text-muted-foreground">
            <span aria-hidden className="absolute left-0 top-0 text-primary">
              “
            </span>
            {testimonial.quote}
            <span aria-hidden className="text-primary">
              ”
            </span>
          </blockquote>
          <div className="mt-3 flex items-center" aria-label="Rating 5 dari 5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" aria-hidden />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
);

TestimonialCard.displayName = 'TestimonialCard';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'hafalan' | 'biolink' | 'pembelajaran'>('hafalan');
  const [isLoading, setIsLoading] = useState(true);

  // Lightweight initial skeleton (reduced delay for perceived performance)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200); // Reduced from 600ms to 200ms
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll animations (more performant than scroll listener)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const elements = document.querySelectorAll<HTMLElement>('.scroll-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Memoized data to prevent recreation on every render
  const features = useMemo<
    {
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      title: string;
      description: string;
      gradient: string;
    }[]
  >(
    () => [
      {
        icon: BookOpen,
        title: 'Hafalan Al-Quran',
        description: 'Pantau & optimalkan hafalan sesuai metode para ulama salaf.',
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        icon: Users,
        title: 'Komunitas Aswaja',
        description: 'Diskusi moderasi & kolaborasi aman berbasis manhaj lurus.',
        gradient: 'from-green-500 to-green-600',
      },
      {
        icon: Award,
        title: 'Ijazah Digital',
        description: 'Validasi pencapaian ilmu dengan sertifikat bersanad.',
        gradient: 'from-purple-500 to-purple-600',
      },
      {
        icon: Wallet,
        title: 'Dompet Halal',
        description: 'Kelola DinCoin & DirCoin sesuai prinsip muamalah.',
        gradient: 'from-yellow-500 to-yellow-600',
      },
      {
        icon: Palette,
        title: 'Marketplace Islami',
        description: 'Aman jual beli karya islami sesuai adab syar&apos;i.',
        gradient: 'from-pink-500 to-pink-600',
      },
      {
        icon: GraduationCap,
        title: 'Ensiklopedia Ulama',
        description: 'Profil ringkas imam madzhab & ulama Ahlus Sunnah bersanad.',
        gradient: 'from-emerald-500 to-emerald-600',
      },
      {
        icon: TrendingUp,
        title: 'Progress Spiritual',
        description: 'Lacak perkembangan ibadah & ilmu secara terukur.',
        gradient: 'from-indigo-500 to-indigo-600',
      },
    ],
    [],
  );

  const stats = useMemo<StatItem[]>(
    () => [
      { icon: Users, label: 'Santri Aktif', value: '2,500+', color: 'text-blue-600' },
      { icon: BookOpen, label: 'Hafalan', value: '8,000+', color: 'text-green-600' },
      { icon: Award, label: 'Sertifikat', value: '1,200+', color: 'text-purple-600' },
      { icon: Heart, label: 'Komunitas', value: '25+', color: 'text-red-600' },
    ],
    [],
  );

  const tabContent = useMemo(
    () => ({
      hafalan: {
        title: 'Hafalan Al-Quran Berdasarkan Manhaj Salaf',
        description:
          'Sistem hafalan Al-Quran dengan metode yang telah diwariskan oleh ulama Ahli Sunnah wal Jamaah, dilengkapi dengan adab dan etika menghafal yang shahih.',
        features: [
          'Metode hafalan sesuai tuntunan ulama salaf',
          'Panduan tajwid berdasarkan qiraat mu&apos;tabarah',
          'Muroja&apos;ah terjadwal dengan doa dan wirid',
          'Ijazah digital dari para qurra&apos; bersanad',
        ],
        icon: BookMarked,
      },
      biolink: {
        title: 'Profil Santri Aswaja',
        description:
          'Profil digital yang mencerminkan identitas santri Ahli Sunnah wal Jamaah dengan tampilan yang islami dan konten yang sesuai syariah.',
        features: [
          'Template islami sesuai adab Ahli Sunnah',
          'Showcase pencapaian ilmu agama',
          'Integrasi dengan konten dakwah yang shahih',
          'Networking dengan sesama santri aswaja',
        ],
        icon: Palette,
      },
      pembelajaran: {
        title: 'Pembelajaran Ilmu Syariah',
        description:
          'Akses materi pembelajaran Islam berdasarkan kitab-kitab mu&apos;tabarah dari ulama 4 madzhab dengan sistem pembelajaran komunitas antar santri.',
        features: [
          'Kajian kitab kuning dari 4 madzhab fiqih',
          'Biografi dan karya ulama Ahli Sunnah',
          'Materi aqidah, fiqih, hadits, dan tasawuf',
          'Diskusi interaktif dengan metode halaqah',
        ],
        icon: GraduationCap,
      },
    }),
    [],
  );

  const testimonials = useMemo<TestimonialItem[]>(
    () => [
      {
        name: 'Ahmad Farhan',
        role: 'Santri Pondok Pesantren Salafi',
        quote:
          'Alhamdulillah, fitur hafalan Al-Quran dengan metode ulama salaf sangat membantu saya menjaga hafalan sesuai adab yang shahih.',
        avatar: '/avatar-1.jpg',
      },
      {
        name: 'Aisyah Rahmadani',
        role: 'Kakak Senior Tahfidz',
        quote:
          "Platform yang sesuai manhaj Ahli Sunnah wal Jamaah. Materi pembelajaran sangat terjaga kualitas dan kesesuaiannya dengan kitab mu'tabarah.",
        avatar: '/avatar-2.jpg',
      },
      {
        name: 'Muhammad Zaki',
        role: 'Mahasiswa Syariah',
        quote:
          'Fitur biografi ulama 4 madzhab sangat bermanfaat untuk mendalami sejarah dan pemikiran para imam madzhab. Barakallahu fiikum.',
        avatar: '/avatar-3.jpg',
      },
    ],
    [],
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as 'hafalan' | 'biolink' | 'pembelajaran');
  }, []);

  // Menu Santri - Fitur utama dalam grid mobile-friendly
  const santriFeatures = useMemo(
    () => [
      {
        icon: BookOpen,
        title: 'Hafalan Al-Quran',
        description: 'Pantau progress hafalan dengan metode terbukti dari ulama salaf',
        link: '/hafalan',
        color: 'bg-blue-500',
        features: ['Target harian', "Muroja'ah otomatis", 'Progress tracking', 'Ijazah digital'],
      },
      {
        icon: Users,
        title: 'Komunitas',
        description: 'Bergabung dengan santri se-manhaj di seluruh Indonesia',
        link: '/komunitas',
        color: 'bg-green-500',
        features: ['Forum diskusi', 'Kajian online', 'Mentoring', 'Study group'],
      },
      {
        icon: Award,
        title: 'Sertifikat',
        description: 'Dapatkan sertifikat resmi untuk pencapaian ilmu Anda',
        link: '/sertifikat',
        color: 'bg-purple-500',
        features: ['Ijazah digital', 'Verifikasi blockchain', 'Portfolio', 'Kredensial'],
      },
      {
        icon: GraduationCap,
        title: 'Pembelajaran',
        description: "Akses ribuan materi dari kitab mu'tabarah",
        link: '/pembelajaran',
        color: 'bg-indigo-500',
        features: ['Video kajian', 'Audio kitab', 'Teks Arab-Latin', 'Terjemahan'],
      },

      {
        icon: Target,
        title: 'Target Ibadah',
        description: 'Set dan pantau target ibadah harian Anda',
        link: '/target-ibadah',
        color: 'bg-rose-500',
        features: ['Sholat tracking', 'Dzikir counter', 'Puasa sunnah', 'Sedekah log'],
      },
      {
        icon: BarChart3,
        title: 'Progress Report',
        description: 'Lihat statistik perkembangan spiritual Anda',
        link: '/progress',
        color: 'bg-emerald-500',
        features: ['Analytics', 'Milestone', 'Grafik progress', 'Achievement'],
      },
      {
        icon: FileText,
        title: 'Catatan Ilmu',
        description: 'Buat dan kelola catatan dari kajian yang diikuti',
        link: '/catatan',
        color: 'bg-orange-500',
        features: ['Rich editor', 'Tag sistem', 'Search', 'Export PDF'],
      },
      {
        icon: Wallet,
        title: 'Dompet Digital',
        description: 'Kelola DinCoin & DirCoin sesuai syariah',
        link: '/dompet',
        color: 'bg-yellow-500',
        features: ['Halal transaction', 'Zakat calculator', 'Infaq/sedekah', 'Financial planning'],
      },
      {
        icon: Palette,
        title: 'Biolink Islami',
        description: 'Profil digital yang mencerminkan identitas muslim',
        link: '/biolink',
        color: 'bg-pink-500',
        features: ['Template islami', 'Social links', 'Portfolio karya', 'Contact form'],
      },
      {
        icon: Globe,
        title: 'Marketplace',
        description: 'Jual beli karya islami dengan prinsip syariah',
        link: '/marketplace',
        color: 'bg-teal-500',
        features: ['Karya digital', 'Produk fisik', 'Secure payment', 'Review system'],
      },
    ],
    [],
  );

  // Data Ulama (ringkas) – dapat dipindah ke loader bila perlu SSR
  const scholars = useMemo<ScholarItem[]>(
    () => [
      {
        name: 'Imam Abu Hanifah',
        period: '80-150 H',
        madzhab: 'Hanafi',
        quote: 'Fiqih adalah memahami maksud Allah dari nash-nya.',
        img: '/ulama/abu-hanifah.jpg',
        slug: 'abu-hanifah',
      },
      {
        name: 'Imam Malik bin Anas',
        period: '93-179 H',
        madzhab: 'Maliki',
        quote: 'Ilmu bukan banyaknya riwayat, tapi cahaya yang Allah letakkan di hati.',
        img: '/ulama/malik.jpg',
        slug: 'imam-malik',
      },
      {
        name: "Imam Al-Syafi'i",
        period: '150-204 H',
        madzhab: "Syafi'i",
        quote: 'Jika hadis shahih maka itulah madzhabku.',
        img: '/ulama/syafii.jpg',
        slug: 'imam-syafii',
      },
      {
        name: 'Imam Ahmad bin Hanbal',
        period: '164-241 H',
        madzhab: 'Hanbali',
        quote: 'Jangan engkau katakan sesuatu yang bukan bagian dari agama sebagai agama.',
        img: '/ulama/ahmad.jpg',
        slug: 'imam-ahmad',
      },
    ],
    [],
  );

  if (isLoading) {
    return <LoadingSkeleton />; // Keep existing skeleton component
  }

  return (
    <div className="bg-background text-foreground page-container">
      <div className="content-wrapper">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16 relative z-10">
            <div className="text-center max-w-4xl mx-auto fade-in">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-medium mb-4 sm:mb-5">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Platform Ahli Sunnah wal Jamaah
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="block">Bergabung dengan</span>
                <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Santri Online
                </span>
              </h1>

              <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Platform edukasi Islam berdasarkan pemahaman Ahli Sunnah wal Jamaah 4 Madzhab.
                Pelajari Aqidah, Fiqih, Hadits, dan Tasawuf dengan manhaj yang lurus dari ulama
                salaf.
              </p>

              <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                <Button
                  asChild
                  size="lg"
                  className="text-sm sm:text-base px-6 sm:px-7 py-3 h-auto w-full sm:w-auto"
                >
                  <Link to="/daftar">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Mulai Gratis Sekarang
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-sm sm:text-base px-6 sm:px-7 py-3 h-auto w-full sm:w-auto"
                >
                  <Link to="/tentang">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Pelajari Lebih Lanjut
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Manhaj Aswaja</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm text-muted-foreground">4 Madzhab Fiqih</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Kitab Mu&apos;tabarah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-10 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Feature Section */}
        <section className="py-12 sm:py-14 lg:py-16 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16 scroll-animate opacity-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Layanan Utama Santri Online
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md sm:max-w-xl lg:max-w-2xl mx-auto">
                Tiga pilar utama platform kami yang mendukung perjalanan pendidikan Islam modern
                Anda
              </p>
            </div>

            <TabContent
              activeTab={activeTab}
              tabContent={tabContent}
              onTabChange={handleTabChange}
            />
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-12 sm:py-14 lg:py-16 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16 scroll-animate opacity-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Fitur Unggulan Platform Kami
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md sm:max-w-xl lg:max-w-2xl mx-auto">
                Temukan berbagai fitur canggih yang dirancang khusus untuk mendukung perjalanan
                belajar Anda
              </p>
            </div>

            <FeatureGrid features={features} />
          </div>
        </section>

        {/* Santri Features Section - Mobile Friendly Grid */}
        <section className="py-12 sm:py-14 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 scroll-animate opacity-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Fitur Lengkap untuk Santri
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                Akses semua tools yang Anda butuhkan untuk perjalanan menuntut ilmu yang optimal dan
                terstruktur
              </p>
            </div>

            {/* Mobile Friendly Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
              {santriFeatures.map((feature, index) => (
                <Link
                  key={feature.link}
                  to={feature.link}
                  prefetch="intent"
                  className="group relative bg-white dark:bg-card rounded-lg sm:rounded-xl border border-border hover:border-primary/40 p-3 sm:p-4 lg:p-5 hover:shadow-md transition-all duration-300 scroll-animate opacity-0 translate-y-4"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base leading-tight mb-1 sm:mb-2 line-clamp-2">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Mobile: Show arrow, Desktop: Show features list */}
                  <div className="mt-2 sm:mt-3">
                    <div className="sm:hidden flex items-center text-primary">
                      <span className="text-[10px] font-medium">Buka</span>
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <div className="hidden sm:block">
                      <div className="space-y-1">
                        {feature.features.slice(0, 2).map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center text-[10px] lg:text-xs text-muted-foreground"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1.5 flex-shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                        {feature.features.length > 2 && (
                          <div className="text-[10px] lg:text-xs text-primary font-medium">
                            +{feature.features.length - 2} fitur lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Feature Details for Desktop */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-bold mb-4 text-center">Penjelasan Detail Fitur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {santriFeatures.slice(0, 6).map((feature, index) => (
                    <div key={index} className="bg-white dark:bg-card rounded-lg p-4 border">
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.color} mb-3`}
                      >
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm mb-2">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.features.map((feat, i) => (
                          <div key={i} className="flex items-center text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Button asChild size="sm" className="text-xs sm:text-sm">
                    <Link to="/fitur-lengkap">Lihat Semua Fitur</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden text-center">
              <Button asChild size="sm" variant="outline" className="text-xs sm:text-sm">
                <Link to="/fitur-lengkap">Jelajahi Semua Fitur</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Scholars Section (relocated proper position) */}
        <section className="py-12 sm:py-14 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-14 scroll-animate opacity-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Ulama Ahlus Sunnah wal Jamaah
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto">
                Ensiklopedia ringkas imam madzhab &amp; tokoh rujukan untuk pijakan belajar yang
                lurus
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {scholars.map((u, i) => (
                <Link
                  key={u.slug}
                  to={`/ulama/${u.slug}`}
                  prefetch="intent"
                  className="group relative rounded-lg border bg-card p-3 sm:p-4 hover:shadow-md transition-all scroll-animate opacity-0 translate-y-4"
                  style={{ transitionDelay: `${i * 70}ms` }}
                  aria-label={`Profil ${u.name}`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-md mb-2 bg-gradient-to-br from-primary/10 to-primary/0">
                    <img
                      src={u.img}
                      alt={`Ilustrasi ${u.name}`}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.05]"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3MEM2MS4wNDU3IDcwIDcwIDYxLjA0NTcgNzAgNTBDNzAgMzguOTU0MyA2MS4wNDU3IDMwIDUwIDMwQzM4Ljk1NDMgMzAgMzAgMzguOTU0MyAzMCA1MEMzMCA2MS4wNDU3IDM4Ljk1NDMgNzAgNTAgNzBaIiBmaWxsPSIjOUI5Q0EwIi8+CjxwYXRoIGQ9Ik01MCA0NEMzNy44MDcgNDQgMjggNTMuODA3IDI4IDY2VjcySDcyVjY2QzcyIDUzLjgwNyA2Mi4xOTMgNDQgNTAgNDRaIiBmaWxsPSIjOUI5Q0EwIi8+Cjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2 mb-0.5">
                    {u.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                    {u.madzhab} • {u.period}
                  </p>
                  <p className="text-[10px] sm:text-[11px] italic text-muted-foreground line-clamp-2">
                    “{u.quote}”
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <Button asChild size="sm" variant="outline" className="text-xs sm:text-sm">
                <Link to="/ulama" prefetch="intent">
                  Lihat Semua Ulama
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-12 sm:py-14 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16 scroll-animate opacity-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Apa Kata Pengguna Kami
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md sm:max-w-xl lg:max-w-2xl mx-auto">
                Dengarkan pengalaman mereka yang telah bergabung dengan Santri Online
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-14 lg:py-16 scroll-animate opacity-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center text-white relative overflow-hidden shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5"></div>
                <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  Siap Memulai Perjalanan Belajar?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-7 opacity-90 max-w-xl mx-auto">
                  Bergabunglah dengan ribuan santri beraqidah Ahli Sunnah wal Jamaah dan rasakan
                  pembelajaran ilmu syariah yang authentic
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="text-sm sm:text-base px-6 sm:px-7 py-3 h-auto w-full sm:w-auto"
                  >
                    <Link to="/daftar">
                      <Sparkles className="mr-2 w-4 h-4" />
                      Daftar Sekarang - Gratis!
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-sm sm:text-base px-6 sm:px-7 py-3 h-auto border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    <Link to="/masuk">Sudah Punya Akun?</Link>
                  </Button>
                </div>

                <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                    <span className="text-xs sm:text-sm text-white/80">Manhaj Aswaja</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                    <span className="text-xs sm:text-sm text-white/80">Kitab Mu&apos;tabarah</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                    <span className="text-xs sm:text-sm text-white/80">Bimbingan Ulama</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Santri Online',
              description:
                'Platform edukasi Islam berbasis manhaj Ahli Sunnah wal Jamaah 4 madzhab.',
              url: 'https://santrionline.example',
              sameAs: [
                'https://www.facebook.com/santrionline',
                'https://www.instagram.com/santrionline',
              ],
              offers: {
                '@type': 'Offer',
                name: 'Akses Pembelajaran Islam',
                price: '0',
                priceCurrency: 'IDR',
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
