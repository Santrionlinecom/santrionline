import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Link } from '@remix-run/react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Star,
  Users,
  Award,
  Play,
  CheckCircle,
  Zap,
  Heart,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Hafalan Al-Quran - Santri Online' },
    {
      name: 'description',
      content:
        'Program hafalan Al-Quran terstruktur dengan metodologi modern dan bimbingan mentor berpengalaman di Santri Online.',
    },
  ];
};

export default function Hafalan() {
  const hafalanPrograms = [
    {
      title: 'Tahfidz Pemula',
      target: '1-3 Juz',
      duration: '3-6 bulan',
      description: 'Program khusus untuk pemula yang ingin memulai perjalanan menghafal Al-Quran',
      features: [
        'Bimbingan dasar tajwid dan makharijul huruf',
        'Metode hafalan bertahap',
        'Mentor dedicated personal',
        'Materi audio murotal berkualitas HD',
      ],
      price: 'Gratis',
      color: 'bg-green-500',
    },
    {
      title: 'Tahfidz Intermediate',
      target: '5-10 Juz',
      duration: '8-12 bulan',
      description: 'Program lanjutan untuk santri yang sudah memiliki dasar hafalan yang kuat',
      features: [
        'Teknik hafalan cepat dan efektif',
        'Review sistematis dan terjadwal',
        'Grup belajar dan peer support',
        'Ujian berkala dan evaluasi progress',
      ],
      price: 'Rp 150K/bulan',
      color: 'bg-blue-500',
    },
    {
      title: 'Tahfidz Advanced',
      target: '15-30 Juz',
      duration: '12-24 bulan',
      description: 'Program intensif untuk mencapai hafalan Al-Quran lengkap 30 juz',
      features: [
        'Mentoring intensif one-on-one',
        'Metode hafalan khusus untuk juz tersulit',
        'Persiapan ijazah dan sertifikasi',
        'Pelatihan mengajar untuk jadi mentor',
      ],
      price: 'Rp 300K/bulan',
      color: 'bg-purple-500',
    },
  ];

  const hafalanFeatures = [
    {
      icon: BookOpen,
      title: 'Mushaf Digital Interaktif',
      description:
        'Mushaf Al-Quran digital dengan fitur highlight, bookmark, dan tracking progress yang akurat',
    },
    {
      icon: Play,
      title: 'Audio Murotal Berkualitas',
      description:
        "Koleksi murotal dari qari ternama dunia dengan berbagai qira'ah dan kecepatan yang bisa disesuaikan",
    },
    {
      icon: Users,
      title: 'Mentor Berpengalaman',
      description:
        'Dibimbing langsung oleh ustadz hafidz yang berpengalaman dengan ijazah sanad yang jelas',
    },
    {
      icon: Zap,
      title: 'Metode Terbukti Efektif',
      description:
        'Kombinasi metode tradisional pesantren dengan teknologi modern untuk hasil optimal',
    },
    {
      icon: Clock,
      title: 'Jadwal Fleksibel',
      description:
        'Atur jadwal belajar sesuai kesibukan Anda dengan reminder otomatis dan tracking konsistensi',
    },
    {
      icon: Award,
      title: 'Sertifikasi Resmi',
      description:
        'Dapatkan sertifikat dan ijazah yang diakui secara nasional setelah menyelesaikan program',
    },
  ];

  const successStories = [
    {
      name: 'Ahmad Fauzi',
      age: '23 tahun',
      achievement: 'Hafal 5 Juz dalam 4 bulan',
      story:
        'Dengan metode yang sistematis dan bimbingan mentor yang sabar, saya bisa mencapai target hafalan lebih cepat dari perkiraan.',
      avatar: 'AF',
    },
    {
      name: 'Siti Aisyah',
      age: '19 tahun',
      achievement: 'Hafal 10 Juz dalam 8 bulan',
      story:
        'Platform ini membantu saya tetap konsisten dengan jadwal yang fleksibel. Audio murotalnnya juga sangat membantu.',
      avatar: 'SA',
    },
    {
      name: 'Muhammad Ridwan',
      age: '25 tahun',
      achievement: 'Hafal 30 Juz dalam 18 bulan',
      story:
        'Alhamdulillah bisa menyelesaikan hafalan 30 juz. Sekarang saya juga jadi mentor untuk membantu adik-adik santri.',
      avatar: 'MR',
    },
  ];

  const hafalanStats = [
    { number: '1000+', label: 'Santri Aktif' },
    { number: '50+', label: 'Mentor Berpengalaman' },
    { number: '15,000+', label: 'Ayat Terhafal' },
    { number: '95%', label: 'Tingkat Keberhasilan' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Program Hafalan Al-Quran</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Wujudkan impian menghafal Al-Quran dengan metode yang terbukti efektif, bimbingan
              mentor berpengalaman, dan teknologi pembelajaran modern.
            </p>
          </div>
        </div>

        {/* Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pilih Program Hafalan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hafalanPrograms.map((program, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div
                    className={`w-fit px-3 py-1 ${program.color} text-white rounded-full text-sm font-semibold mb-4`}
                  >
                    {program.target}
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <p className="text-muted-foreground">{program.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {program.duration}
                    </Badge>
                    <div className="font-semibold text-primary">{program.price}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to="/daftar">Mulai Program</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hafalanFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Kisah Sukses Santri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {story.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.age}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    <Award className="w-3 h-3 mr-1" />
                    {story.achievement}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">&quot;{story.story}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pencapaian Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {hafalanStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Metodologi Pembelajaran</CardTitle>
            <p className="text-center text-muted-foreground">
              Pendekatan sistematis yang menggabungkan tradisi pesantren dengan teknologi modern
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-semibold mb-2">Talaqqi</h4>
                <p className="text-sm text-muted-foreground">
                  Belajar langsung dari mentor dengan sanad yang jelas
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-semibold mb-2">Takrir</h4>
                <p className="text-sm text-muted-foreground">
                  Pengulangan terstruktur dengan jadwal yang optimal
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-semibold mb-2">Tasmi'</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluasi berkala dan perbaikan kualitas hafalan
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  4
                </div>
                <h4 className="font-semibold mb-2">Tahsin</h4>
                <p className="text-sm text-muted-foreground">
                  Perbaikan kualitas bacaan dan pemahaman makna
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Mulai Perjalanan Hafalan Anda Hari Ini</h2>
            <p className="text-xl mb-6 opacity-90">
              Bergabunglah dengan ribuan santri yang telah merasakan kemudahan dan efektivitas
              metode kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" variant="secondary" className="flex-1">
                <Link to="/daftar" className="flex items-center justify-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Daftar Sekarang
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 flex-1"
              >
                <Link to="/kontak" className="flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Konsultasi Gratis
                </Link>
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              ✨ Trial gratis 7 hari • Tanpa komitmen • Bimbingan personal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
