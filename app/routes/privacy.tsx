import type { MetaFunction } from '@remix-run/cloudflare';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { ArrowLeft, Shield, Lock, Eye, Database, Bell } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Kebijakan Privasi - Santri Online' },
    {
      name: 'description',
      content:
        'Kebijakan privasi Santri Online. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
    },
  ];
};

export default function Privacy() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kebijakan Privasi</h1>
            <p className="text-muted-foreground text-lg">Berlaku efektif: 1 Januari 2025</p>
            <p className="text-sm text-muted-foreground mt-2">
              Terakhir diperbarui: 4 Agustus 2025
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Pendahuluan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Santri Online, yang dikembangkan oleh <strong>Yogik Pratama Aprilian</strong>,
              berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan privasi
              ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi
              informasi Anda.
            </p>
            <p>
              Dengan menggunakan platform Santri Online, Anda menyetujui praktik yang dijelaskan
              dalam kebijakan privasi ini.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              1. Informasi yang Kami Kumpulkan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">a. Informasi Pribadi</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nama lengkap dan nama panggilan</li>
              <li>Alamat email dan nomor telepon</li>
              <li>Tanggal lahir dan jenis kelamin</li>
              <li>Alamat tempat tinggal</li>
              <li>Informasi pendidikan (pesantren, madrasah, universitas)</li>
            </ul>

            <h4 className="font-semibold mt-4">b. Informasi Pembelajaran</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Progress hafalan Al-Quran</li>
              <li>Sertifikat dan ijazah yang diperoleh</li>
              <li>Aktivitas belajar dan partisipasi komunitas</li>
              <li>Karya yang dibuat dan dijual di marketplace</li>
            </ul>

            <h4 className="font-semibold mt-4">c. Informasi Teknis</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Alamat IP dan lokasi geografis</li>
              <li>Jenis perangkat dan browser yang digunakan</li>
              <li>Log aktivitas dan riwayat penggunaan</li>
              <li>Cookie dan teknologi pelacakan serupa</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              2. Penggunaan Informasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menyediakan dan meningkatkan layanan platform</li>
              <li>Memverifikasi identitas dan mencegah penipuan</li>
              <li>Personalisasi pengalaman belajar Anda</li>
              <li>Mengirim notifikasi penting tentang akun dan layanan</li>
              <li>Memfasilitasi komunikasi dalam komunitas santri</li>
              <li>Memproses transaksi DinCoin dan DirCoin</li>
              <li>Menganalisis penggunaan untuk pengembangan fitur</li>
              <li>Mematuhi kewajiban hukum yang berlaku</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Pembagian Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Kami tidak menjual atau menyewakan data pribadi Anda. Kami hanya membagikan informasi
              dalam situasi berikut:
            </p>

            <h4 className="font-semibold">a. Dengan Persetujuan Anda</h4>
            <p>Ketika Anda memberikan izin eksplisit untuk membagikan informasi tertentu.</p>

            <h4 className="font-semibold">b. Penyedia Layanan</h4>
            <p>
              Dengan partner teknologi yang membantu mengoperasikan platform (hosting, analitik,
              pembayaran) dengan perjanjian kerahasiaan yang ketat.
            </p>

            <h4 className="font-semibold">c. Kewajiban Hukum</h4>
            <p>
              Ketika diwajibkan oleh hukum, perintah pengadilan, atau untuk melindungi hak dan
              keamanan pengguna.
            </p>

            <h4 className="font-semibold">d. Dalam Komunitas</h4>
            <p>
              Informasi profil publik (nama, foto, pencapaian) dapat dilihat oleh anggota komunitas
              lain sesuai pengaturan privasi Anda.
            </p>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              4. Keamanan Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Kami menerapkan langkah-langkah keamanan yang kuat untuk melindungi data Anda:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enkripsi data saat transit dan penyimpanan</li>
              <li>Otentikasi multi-faktor untuk akun sensitif</li>
              <li>Pemantauan keamanan 24/7</li>
              <li>Audit keamanan berkala</li>
              <li>Pembatasan akses berdasarkan prinsip &quot;need-to-know&quot;</li>
              <li>Backup data reguler dan recovery plan</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Meskipun kami berusaha keras melindungi data Anda, tidak ada sistem yang 100% aman.
              Kami mendorong Anda untuk menjaga kerahasiaan kata sandi dan informasi akun.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Penyimpanan Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Kami menyimpan data Anda selama:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Akun Aktif:</strong> Selama akun Anda aktif dan layanan diperlukan
              </li>
              <li>
                <strong>Data Hafalan:</strong> Permanen untuk menjaga continuitas progress spiritual
              </li>
              <li>
                <strong>Sertifikat:</strong> Permanen untuk validitas kredensial akademik
              </li>
              <li>
                <strong>Log Teknis:</strong> Maksimal 12 bulan untuk keperluan keamanan
              </li>
              <li>
                <strong>Data Backup:</strong> Maksimal 3 tahun setelah penghapusan akun
              </li>
            </ul>
            <p>
              Anda dapat meminta penghapusan data dengan menghubungi kami, namun beberapa data
              mungkin perlu dipertahankan untuk kewajiban hukum atau keamanan.
            </p>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Hak Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Akses:</strong> Melihat data pribadi yang kami simpan tentang Anda
              </li>
              <li>
                <strong>Koreksi:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat
              </li>
              <li>
                <strong>Penghapusan:</strong> Meminta penghapusan akun dan data pribadi
              </li>
              <li>
                <strong>Portabilitas:</strong> Mengekspor data Anda dalam format yang dapat dibaca
              </li>
              <li>
                <strong>Pembatasan:</strong> Membatasi pemrosesan data dalam situasi tertentu
              </li>
              <li>
                <strong>Keberatan:</strong> Menolak pemrosesan untuk tujuan tertentu
              </li>
            </ul>
            <p>
              Untuk menggunakan hak-hak ini, silakan hubungi kami melalui kontak yang tersedia di
              bawah.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Cookie dan Teknologi Pelacakan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Kami menggunakan cookie dan teknologi serupa untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menjaga sesi login Anda</li>
              <li>Menyimpan preferensi dan pengaturan</li>
              <li>Menganalisis penggunaan platform</li>
              <li>Menyediakan konten yang relevan</li>
              <li>Meningkatkan keamanan</li>
            </ul>
            <p>
              Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur mungkin tidak
              berfungsi optimal.
            </p>
          </CardContent>
        </Card>

        {/* International Transfer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Transfer Data Internasional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Data Anda mungkin diproses di server yang berlokasi di luar Indonesia untuk keperluan
              layanan cloud dan backup. Kami memastikan bahwa transfer data internasional dilakukan
              sesuai dengan standar keamanan yang setara.
            </p>
          </CardContent>
        </Card>

        {/* Children Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Privasi Anak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Platform kami dapat digunakan oleh pengguna berusia 13 tahun ke atas. Untuk pengguna
              di bawah 18 tahun, kami mendorong keterlibatan orang tua atau wali dalam penggunaan
              platform.
            </p>
            <p>
              Jika Anda adalah orang tua dan khawatir tentang data anak Anda, silakan hubungi kami.
            </p>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              10. Perubahan Kebijakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu untuk mencerminkan
              perubahan dalam layanan atau peraturan yang berlaku. Perubahan signifikan akan
              diberitahukan melalui email atau notifikasi di platform.
            </p>
            <p>
              Tanggal &quot;Terakhir diperbarui&quot; di bagian atas menunjukkan kapan kebijakan ini
              terakhir direvisi.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>11. Kontak untuk Masalah Privasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Jika Anda memiliki pertanyaan, kekhawatiran, atau ingin menggunakan hak privasi Anda,
              silakan hubungi kami:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> websantrionline@gmail.com
              </p>
              <p>
                <strong>WhatsApp:</strong> 087854545274
              </p>
              <p>
                <strong>Developer:</strong> Yogik Pratama Aprilian
              </p>
              <p>
                <strong>Subjek Email:</strong> [PRIVASI] - [Deskripsi Singkat]
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Kami berkomitmen untuk merespons pertanyaan privasi dalam waktu 7 hari kerja.
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
