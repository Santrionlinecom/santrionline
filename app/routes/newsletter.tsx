import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { ArrowLeft, Mail, CheckCircle, Bell, Gift } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Newsletter - Santri Online' },
    {
      name: 'description',
      content:
        'Baca newsletter Santri Online untuk mendapatkan update terbaru, tips belajar, dan konten eksklusif.',
    },
  ];
};

export default function Newsletter() {
  const benefits = [
    {
      icon: Bell,
      title: 'Update Terbaru',
      description: 'Dapatkan informasi tentang fitur baru, event, dan pengumuman penting',
    },
    {
      icon: Gift,
      title: 'Konten Eksklusif',
      description: 'Akses materi pembelajaran berkualitas dan tips dari para ustadz',
    },
    {
      icon: CheckCircle,
      title: 'Tips Mingguan',
      description: 'Receive weekly tips untuk meningkatkan hafalan dan ibadah harian',
    },
  ];

  const newsletters = [
    {
      title: 'Newsletter Edisi #15 - Agustus 2025',
      date: '1 Agustus 2025',
      preview:
        'Tips menghafal Al-Quran di bulan yang penuh berkah ini, plus update fitur terbaru Santri Online...',
      topics: ['Hafalan Ramadhan', 'Fitur Baru', 'Event Bulan Ini'],
    },
    {
      title: 'Newsletter Edisi #14 - Juli 2025',
      date: '1 Juli 2025',
      preview:
        'Strategi membangun konsistensi dalam belajar, interview dengan hafidz muda berprestasi...',
      topics: ['Konsistensi Belajar', 'Success Story', 'Program Highlights'],
    },
    {
      title: 'Newsletter Edisi #13 - Juni 2025',
      date: '1 Juni 2025',
      preview:
        'Mengoptimalkan waktu belajar, review fitur Biolink terbaru, dan announcement kompetisi...',
      topics: ['Time Management', 'Product Update', 'Kompetisi'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Newsletter Santri Online</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dapatkan insight terbaru, tips belajar, dan update platform langsung melalui konten
              newsletter kami
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Manfaat Newsletter Santri Online
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Newsletters */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Newsletter Terdahulu</h2>
          <div className="space-y-6">
            {newsletters.map((newsletter, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{newsletter.title}</h3>
                      <p className="text-muted-foreground mb-3">{newsletter.preview}</p>
                      <div className="flex flex-wrap gap-2">
                        {newsletter.topics.map((topic, idx) => (
                          <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right lg:text-left lg:min-w-fit">
                      <p className="text-sm text-muted-foreground mb-2">{newsletter.date}</p>
                      <Button variant="outline" size="sm">
                        Baca Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Apa Kata Subscriber Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;Newsletter Santri Online sangat bermanfaat! Setiap minggu saya mendapat
                    insight baru tentang cara belajar yang lebih efektif.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">AF</span>
                  </div>
                  <div>
                    <p className="font-medium">Ahmad Fauzi</p>
                    <p className="text-sm text-muted-foreground">Santri di Jakarta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;Konten newsletter selalu berkualitas dan relevan dengan kebutuhan belajar
                    kami. Recommended untuk semua santri!&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">SR</span>
                  </div>
                  <div>
                    <p className="font-medium">Siti Rahmah</p>
                    <p className="text-sm text-muted-foreground">Guru Tahfidz</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Jelajahi Lebih Lanjut!</h2>
            <p className="mb-6 opacity-90">
              Bergabunglah dengan ribuan santri lainnya yang sudah merasakan manfaat platform
              pembelajaran Islam kami.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/daftar">Mulai Belajar Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
