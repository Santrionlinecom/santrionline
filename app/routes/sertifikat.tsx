import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Link } from '@remix-run/react';
import {
  ArrowLeft,
  Award,
  Download,
  Shield,
  CheckCircle,
  Star,
  Calendar,
  Users,
  QrCode,
  FileText,
  User,
  BookOpen,
  TrendingUp,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { createCertificateGenerator } from '~/utils/certificate-generator';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sertifikat - Santri Online' },
    {
      name: 'description',
      content:
        'Dapatkan sertifikat resmi dari Santri Online untuk pencapaian hafalan Al-Quran dan pembelajaran Islam Anda.',
    },
  ];
};

export default function Sertifikat() {
  // Data santri untuk simulasi - nanti akan diambil dari database
  const santriData = {
    name: 'Ahmad Fauzi',
    nisn: '2024001001',
    totalJuz: 5,
    completedBooks: ['Iqro 1-6', "Al-Qur'an Juz 1-5", 'Tajwid Dasar'],
    achievements: [
      { type: 'Hafalan' as const, target: 'Juz 1', completedDate: '2024-01-15', score: 95 },
      { type: 'Hafalan' as const, target: 'Juz 2', completedDate: '2024-02-20', score: 92 },
      { type: 'Hafalan' as const, target: 'Juz 3', completedDate: '2024-03-25', score: 94 },
      { type: 'Hafalan' as const, target: 'Juz 4', completedDate: '2024-05-10', score: 96 },
      { type: 'Hafalan' as const, target: 'Juz 5', completedDate: '2024-06-15', score: 98 },
      { type: 'Kitab' as const, target: 'Tajwid Dasar', completedDate: '2024-04-01', score: 89 },
    ],
    totalScore: 95.8,
    isApprovedByAdmin: true, // Status persetujuan admin
    certificateId: 'STO-2024-001',
    approvedDate: '2024-08-01',
    approvedBy: 'Ustadz Ahmad Syarif',
  };

  const certificateTypes = [
    {
      title: 'Sertifikat Hafalan 1 Juz',
      description: 'Sertifikat untuk santri yang telah menyelesaikan hafalan 1 juz Al-Quran',
      requirements: [
        'Menghafal 1 juz lengkap dengan lancar',
        'Lulus ujian hafalan dengan mentor',
        "Konsistensi muroja'ah minimal 30 hari",
        'Evaluasi tajwid dan makharijul huruf',
      ],
      badge: '1 JUZ',
      color: 'bg-green-500',
    },
    {
      title: 'Sertifikat Hafalan 5 Juz',
      description: 'Pencapaian menghafal 5 juz Al-Quran dengan kualitas hafalan yang baik',
      requirements: [
        'Menghafal 5 juz lengkap dengan lancar',
        'Lulus ujian komprehensif dengan panel mentor',
        'Mampu menyambung antar surat dan juz',
        'Pemahaman dasar makna dan tafsir',
      ],
      badge: '5 JUZ',
      color: 'bg-blue-500',
    },
    {
      title: 'Sertifikat Hafalan 10 Juz',
      description: 'Prestasi luar biasa menghafal 10 juz Al-Quran dengan standar tinggi',
      requirements: [
        'Menghafal 10 juz lengkap dengan sangat lancar',
        'Lulus ujian ketat dengan dewan evaluator',
        "Kemampuan qira'ah dengan berbagai metode",
        'Pemahaman mendalam makna dan konteks ayat',
      ],
      badge: '10 JUZ',
      color: 'bg-purple-500',
    },
    {
      title: 'Sertifikat Hafidz/Hafidzah',
      description: 'Penghargaan tertinggi untuk santri yang menghafal 30 juz Al-Quran',
      requirements: [
        'Menghafal 30 juz Al-Quran dengan sempurna',
        'Lulus ujian munaqasyah dengan komisi ahli',
        'Ijazah sanad dari mentor bersertifikat',
        'Kemampuan mengajar dan membimbing junior',
      ],
      badge: '30 JUZ',
      color: 'bg-amber-500',
    },
  ];

  const certificationProcess = [
    {
      step: 1,
      title: 'Persiapan & Pendaftaran',
      description:
        'Daftar ujian sertifikasi setelah memenuhi syarat minimal hafalan dan konsistensi belajar.',
      duration: '1-2 hari',
    },
    {
      step: 2,
      title: 'Ujian Praktek Hafalan',
      description:
        'Tes hafalan langsung dengan mentor untuk menguji kelancaran dan ketepatan bacaan.',
      duration: '30-60 menit',
    },
    {
      step: 3,
      title: 'Evaluasi Tajwid & Makharij',
      description:
        'Penilaian kualitas bacaan, tajwid, dan makharijul huruf oleh evaluator bersertifikat.',
      duration: '20-30 menit',
    },
    {
      step: 4,
      title: 'Tes Pemahaman',
      description:
        'Ujian tertulis tentang makna, tafsir dasar, dan konteks turunnya ayat-ayat yang dihafal.',
      duration: '45 menit',
    },
    {
      step: 5,
      title: 'Penerbitan Sertifikat',
      description:
        'Setelah lulus semua tahap, sertifikat digital dan fisik akan diterbitkan dan dikirimkan.',
      duration: '3-7 hari',
    },
  ];

  const certificationBenefits = [
    {
      icon: Shield,
      title: 'Pengakuan Resmi',
      description: 'Sertifikat diakui oleh institusi pendidikan Islam dan pesantren di Indonesia',
    },
    {
      icon: Star,
      title: 'Standar Tinggi',
      description: 'Sistem evaluasi yang ketat memastikan kualitas hafalan yang sesungguhnya',
    },
    {
      icon: QrCode,
      title: 'Verifikasi Digital',
      description: 'QR code untuk verifikasi keaslian sertifikat secara online',
    },
    {
      icon: Users,
      title: 'Jaringan Alumni',
      description: 'Bergabung dengan komunitas eksklusif alumni bersertifikat Santri Online',
    },
  ];

  const examSchedule = [
    {
      month: 'Januari 2025',
      dates: ['15 Jan', '29 Jan'],
      capacity: '50 peserta per sesi',
      registration: 'Buka sampai 10 Jan',
    },
    {
      month: 'Februari 2025',
      dates: ['12 Feb', '26 Feb'],
      capacity: '50 peserta per sesi',
      registration: 'Buka sampai 7 Feb',
    },
    {
      month: 'Maret 2025',
      dates: ['12 Mar', '26 Mar'],
      capacity: '50 peserta per sesi',
      registration: 'Buka sampai 7 Mar',
    },
  ];

  // Fungsi untuk download sertifikat & raport PDF
  const handleDownloadCertificate = async () => {
    if (!santriData.isApprovedByAdmin) {
      alert('Sertifikat belum disetujui oleh admin. Silakan hubungi pengurus.');
      return;
    }

    try {
      const generator = createCertificateGenerator(santriData);
      await generator.downloadPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh sertifikat. Silakan coba lagi.');
    }
  };

  // Fungsi untuk preview sertifikat
  const CertificatePreview = () => (
    <div className="bg-white border-4 border-primary rounded-lg p-8 text-center shadow-lg">
      <div className="border-2 border-primary/30 rounded-lg p-8">
        {/* Header dengan logo */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-left">
            <p className="text-sm font-semibold">SANTRI ONLINE</p>
            <p className="text-xs text-muted-foreground">Platform Pembelajaran Islam Digital</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-primary mb-6 uppercase">
          SERTIFIKAT HAFALAN AL-QUR&apos;AN
        </h3>

        <p className="text-lg mb-2">Diberikan kepada:</p>
        <h4 className="text-2xl font-bold mb-6 border-b-2 border-primary/20 pb-2">
          {santriData.name}
        </h4>
        <p className="text-sm mb-2">NISN: {santriData.nisn}</p>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Telah berhasil menyelesaikan program hafalan Al-Qur&apos;an sebanyak{' '}
          <strong>{santriData.totalJuz} Juz</strong>
          dengan nilai rata-rata <strong>{santriData.totalScore}</strong> dan memenuhi standar
          kualitas yang ditetapkan oleh Santri Online
        </p>

        <div className="grid grid-cols-2 gap-8 text-sm mt-8">
          <div className="text-left">
            <p className="mb-1">Jakarta, {santriData.approvedDate}</p>
            <p className="mb-4">Direktur Santri Online</p>
            <div className="border-t border-black w-32 pt-2">
              <p className="font-semibold">{santriData.approvedBy}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 border-2 border-primary rounded-lg flex items-center justify-center ml-auto mb-2">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
            <p className="text-xs">ID: {santriData.certificateId}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Komponen Raport Progress
  const ProgressReport = () => (
    <div className="bg-white border-4 border-primary rounded-lg p-8 shadow-lg">
      <div className="border-2 border-primary/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">RAPORT PROGRESS HAFALAN</h3>
          <p className="text-sm text-muted-foreground">Periode: Januari - Agustus 2024</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-3 text-primary">Data Santri</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nama:</span>
                <span className="font-medium">{santriData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>NISN:</span>
                <span className="font-medium">{santriData.nisn}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Juz:</span>
                <span className="font-medium">{santriData.totalJuz} Juz</span>
              </div>
              <div className="flex justify-between">
                <span>Nilai Rata-rata:</span>
                <span className="font-medium">{santriData.totalScore}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-primary">Kitab yang Dipelajari</h4>
            <div className="space-y-2">
              {santriData.completedBooks.map((book, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  <span>{book}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-primary">
            Detail Progress Hafalan & Pembelajaran
          </h4>
          <div className="space-y-3">
            {santriData.achievements.map((achievement, idx) => (
              <div key={idx} className="border border-primary/20 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        achievement.type === 'Hafalan' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {achievement.type === 'Hafalan' ? 'H' : 'K'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{achievement.target}</p>
                      <p className="text-xs text-muted-foreground">{achievement.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{achievement.score}/100</p>
                    <p className="text-xs text-muted-foreground">{achievement.completedDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">
            Raport ini digenerate otomatis pada {new Date().toLocaleDateString('id-ID')}
            dan telah diverifikasi oleh sistem Santri Online
          </p>
        </div>
      </div>
    </div>
  );

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
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sertifikat Santri Online</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Raih pengakuan resmi atas pencapaian hafalan Al-Quran Anda dengan sertifikat yang
              diakui secara nasional dan memiliki standar kualitas tinggi.
            </p>
          </div>
        </div>

        {/* Certificate Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Jenis Sertifikat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificateTypes.map((cert, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`px-4 py-2 ${cert.color} text-white rounded-full font-bold text-sm`}
                    >
                      {cert.badge}
                    </div>
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{cert.title}</CardTitle>
                  <p className="text-muted-foreground">{cert.description}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3 text-primary">Syarat & Ketentuan:</h4>
                  <ul className="space-y-2">
                    {cert.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certification Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Proses Sertifikasi</h2>
          <div className="space-y-6">
            {certificationProcess.map((process, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {process.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{process.title}</h3>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {process.duration}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{process.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Keunggulan Sertifikat Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Exam Schedule */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Jadwal Ujian Sertifikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examSchedule.map((schedule, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{schedule.month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Tanggal Ujian</h4>
                      <div className="flex justify-center gap-2">
                        {schedule.dates.map((date, idx) => (
                          <Badge key={idx} variant="secondary">
                            {date}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Kapasitas</h4>
                      <p className="text-muted-foreground text-sm">{schedule.capacity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Pendaftaran</h4>
                      <p className="text-muted-foreground text-sm">{schedule.registration}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      Daftar Ujian
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Certificate */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Preview Sertifikat & Raport</h2>

          {/* Status Persetujuan */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{santriData.name}</h3>
                    <p className="text-muted-foreground">NISN: {santriData.nisn}</p>
                  </div>
                </div>
                <div className="text-right">
                  {santriData.isApprovedByAdmin ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Disetujui Admin
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <Clock className="w-4 h-4 mr-1" />
                      Menunggu Persetujuan
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Hafalan</p>
                  <p className="text-xl font-bold text-blue-600">{santriData.totalJuz} Juz</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nilai Rata-rata</p>
                  <p className="text-xl font-bold text-green-600">{santriData.totalScore}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Kitab Selesai</p>
                  <p className="text-xl font-bold text-purple-600">
                    {santriData.completedBooks.length}
                  </p>
                </div>
              </div>

              {santriData.isApprovedByAdmin && (
                <div className="mt-6 text-center">
                  <Button onClick={handleDownloadCertificate} size="lg" className="mr-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download Sertifikat & Raport (PDF)
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Disetujui oleh: {santriData.approvedBy} pada {santriData.approvedDate}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Sertifikat */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Halaman Depan - Sertifikat</h3>
              <CertificatePreview />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Halaman Belakang - Raport Progress
              </h3>
              <ProgressReport />
            </div>
          </div>
        </div>

        {/* Pricing & Registration */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Dapatkan Sertifikat & Raport Anda!</h2>
            <p className="text-xl mb-6 opacity-90">
              Dokumentasi lengkap pencapaian hafalan Al-Qur&apos;an dan pembelajaran kitab
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">Sertifikat + Raport Digital</h3>
                <div className="text-2xl font-bold mb-2">GRATIS</div>
                <p className="text-sm opacity-90">PDF Format A4 dengan QR code verifikasi</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold mb-2">Sertifikat + Raport Fisik</h3>
                <div className="text-2xl font-bold mb-2">Rp 75.000</div>
                <p className="text-sm opacity-90">Cetak premium + pengiriman ke alamat</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <h4 className="font-bold mb-2">📋 Syarat Download:</h4>
              <ul className="text-sm text-left space-y-1">
                <li>✅ Minimal menghafal 1 juz lengkap</li>
                <li>✅ Lulus evaluasi mentor</li>
                <li>✅ Mendapat persetujuan admin</li>
                <li>✅ Progress pembelajaran tercatat</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Link to="/dashboard/hafalan">Cek Progress Hafalan</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <a href="mailto:websantrionline@gmail.com">Hubungi Admin</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
