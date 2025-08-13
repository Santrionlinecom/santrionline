import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Wallet,
  Palette,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Fitur Platform - Santri Online' },
    {
      name: 'description',
      content:
        'Jelajahi semua fitur unggulan platform Santri Online untuk mendukung edukasi Islam modern Anda.',
    },
  ];
};

export default function Fitur() {
  const features = [
    {
      icon: BookOpen,
      title: 'Hafalan Al-Quran Digital',
      description:
        'Sistem tracking hafalan yang membantu Anda menghafal Al-Quran dengan mudah dan terstruktur.',
      gradient: 'from-blue-500 to-blue-600',
      details: [
        'Rekaman audio hafalan untuk validasi',
        "Penjadwalan otomatis untuk muroja'ah",
        'Statistik dan laporan kemajuan',
        'Sertifikat digital untuk pencapaian',
      ],
    },
    {
      icon: Users,
      title: 'Komunitas Santri',
      description:
        'Bergabung dengan komunitas santri dari seluruh Indonesia untuk berbagi ilmu dan pengalaman.',
      gradient: 'from-green-500 to-green-600',
      details: [
        'Forum diskusi antar santri',
        'Grup belajar berdasarkan level',
        'Tanya jawab dengan ustadz',
        'Mentoring dari kakak senior',
      ],
    },
    {
      icon: Award,
      title: 'Sertifikat Digital',
      description: 'Dapatkan ijazah dan sertifikat digital untuk pencapaian akademik Anda.',
      gradient: 'from-purple-500 to-purple-600',
      details: [
        'Sertifikat hafalan Al-Quran',
        'Ijazah kursus Islam',
        'Badge pencapaian khusus',
        'Validasi dari kakak senior bersertifikat',
      ],
    },
    {
      icon: Wallet,
      title: 'Sistem Gift & Apresiasi',
      description: 'Berikan apresiasi kepada sesama santri melalui sistem gift yang islami.',
      gradient: 'from-yellow-500 to-yellow-600',
      details: [
        'Gift DinCoin untuk apresiasi',
        'Reward untuk pencapaian belajar',
        'Sedekah digital untuk sesama',
        'Sistem transparansi penuh',
      ],
    },
    {
      icon: Palette,
      title: 'Sharing Karya Islami',
      description: 'Berbagi dan apresiasi karya islami seperti kaligrafi, nasyid, dan tulisan.',
      gradient: 'from-pink-500 to-pink-600',
      details: [
        'Platform berbagi karya islami gratis',
        'Sistem apresiasi dan feedback',
        'Perlindungan hak cipta',
        'Kolaborasi antar santri kreatif',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Pantau perkembangan belajar Anda dengan dashboard yang interaktif.',
      gradient: 'from-indigo-500 to-indigo-600',
      details: [
        'Dashboard pembelajaran personal',
        'Analitik kemajuan belajar',
        'Target dan milestone',
        'Laporan berkala untuk keluarga/wali',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Fitur Platform Santri Online</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan semua fitur canggih yang dirancang khusus untuk mendukung perjalanan edukasi
              Islam modern Anda
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Keamanan & Privasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Keamanan data dan privasi pengguna adalah prioritas utama kami:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enkripsi data end-to-end</li>
                <li>Autentikasi multi-faktor</li>
                <li>Backup otomatis dan secure</li>
                <li>Compliance dengan standar keamanan internasional</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Teknologi Modern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Dibangun dengan teknologi terdepan untuk pengalaman terbaik:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Aplikasi web responsif untuk semua perangkat</li>
                <li>Sinkronisasi real-time antar perangkat</li>
                <li>Offline mode untuk akses tanpa internet</li>
                <li>AI untuk personalisasi pembelajaran</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Mulai Eksplorasi Fitur</h2>
              <p className="mb-6 opacity-90">
                Daftar sekarang dan rasakan sendiri semua fitur canggih Santri Online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/daftar">Daftar Gratis</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/tentang">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
