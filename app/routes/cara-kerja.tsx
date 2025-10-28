import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { ArrowLeft, BookOpen, Users, Target, Zap, Shield, Heart } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cara Kerja - Santri Online' },
    {
      name: 'description',
      content:
        'Pelajari bagaimana platform Santri Online bekerja untuk mendukung perjalanan edukasi Islam Anda.',
    },
  ];
};

export default function CaraKerja() {
  const steps = [
    {
      number: '01',
      title: 'Daftar & Buat Profil',
      description:
        'Daftarkan diri Anda dan lengkapi profil dengan informasi akademik dan spiritual.',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '02',
      title: 'Pilih Program Belajar',
      description: 'Pilih program hafalan Al-Quran, kursus Islam, dan kelola karya dakwah Anda.',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
    },
    {
      number: '03',
      title: 'Mulai Belajar',
      description:
        'Ikuti jadwal belajar yang terstruktur dengan panduan dari ustadz berpengalaman.',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '04',
      title: 'Track Progress',
      description:
        'Pantau kemajuan belajar Anda melalui dashboard yang interaktif dan mudah dipahami.',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja Santri Online</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Empat langkah mudah untuk memulai perjalanan edukasi Islam modern Anda
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-muted-foreground/30 absolute top-4 right-4">
                  {step.number}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Aman & Terpercaya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Platform kami menggunakan teknologi keamanan terdepan untuk melindungi data pribadi
                dan progress belajar Anda.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enkripsi data end-to-end</li>
                <li>Backup otomatis progress hafalan</li>
                <li>Validasi ustadz bersertifikat</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Komunitas Islami
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bergabunglah dengan ribuan santri dari seluruh Indonesia dalam lingkungan belajar
                yang Islami dan supportif.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Forum diskusi antar santri</li>
                <li>Mentoring dari ustadz senior</li>
                <li>Event dan kompetisi rutin</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Siap Memulai?</h2>
              <p className="mb-6 opacity-90">
                Bergabunglah dengan Santri Online dan mulai perjalanan edukasi Islam Anda hari ini.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/daftar">Daftar Sekarang</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
