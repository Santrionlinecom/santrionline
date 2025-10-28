import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import {
  BookOpen,
  Users,
  ShoppingCart,
  BadgeCheck,
  Globe,
  MessageCircle,
  Award,
  BookCheck,
  Wallet,
  PenTool,
  Shield,
  Smartphone,
  BarChart,
  Heart,
  Star,
  Zap,
  Target,
  CheckCircle,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Fitur Lengkap - Santri Online' },
    {
      name: 'description',
      content:
        'Jelajahi semua fitur lengkap platform Santri Online untuk pembelajaran Islam digital, hafalan Al-Quran, marketplace karya, dan layanan sertifikat.',
    },
    {
      name: 'keywords',
      content:
        'fitur santri online, hafalan quran, marketplace karya, biolink, sertifikat digital, dompet santri',
    },
  ];
};

export default function FiturLengkapPage() {
  const fiturUtama = [
    {
      kategori: 'Pembelajaran & Hafalan',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fitur: [
        {
          nama: 'Hafalan Al-Quran',
          deskripsi: 'Sistem tracking hafalan dengan progress real-time',
          icon: BookCheck,
        },
        {
          nama: 'Kitab Digital',
          deskripsi: 'Akses koleksi kitab klasik dalam format digital',
          icon: BookOpen,
        },
        {
          nama: 'Sertifikat Digital',
          deskripsi: 'Dapatkan sertifikat untuk pencapaian pembelajaran',
          icon: BadgeCheck,
        },
        {
          nama: 'Analytics Pembelajaran',
          deskripsi: 'Pantau progress dan statistik belajar Anda',
          icon: BarChart,
        },
      ],
    },
    {
      kategori: 'Komunitas & Sosial',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fitur: [
        {
          nama: 'Forum Diskusi',
          deskripsi: 'Bergabung dalam diskusi seputar Islam dan pembelajaran',
          icon: MessageCircle,
        },
        {
          nama: 'Event & Webinar',
          deskripsi: 'Ikuti event dan webinar dari ulama terpercaya',
          icon: Globe,
        },
        {
          nama: 'Grup Belajar',
          deskripsi: 'Bergabung atau buat grup belajar dengan sesama santri',
          icon: Users,
        },
        {
          nama: 'Directory Ulama',
          deskripsi: 'Temukan dan ikuti ulama favorit Anda',
          icon: Award,
        },
      ],
    },
    {
      kategori: 'Marketplace & Ekonomi',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fitur: [
        {
          nama: 'Karya Digital',
          deskripsi: 'Jual beli karya digital seperti ebook, kaligrafi, dll',
          icon: PenTool,
        },
        {
          nama: 'Dompet Digital',
          deskripsi: 'Kelola DinCoin dan DirCoin untuk transaksi',
          icon: Wallet,
        },
        {
          nama: 'Sistem Rating',
          deskripsi: 'Review dan rating untuk karya dan penjual',
          icon: Star,
        },
        {
          nama: 'Pembayaran Aman',
          deskripsi: 'Transaksi aman dengan escrow dan verifikasi',
          icon: Shield,
        },
      ],
    },
    {
      kategori: 'Tools & Produktivitas',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      fitur: [
        {
          nama: 'Biolink Personal',
          deskripsi: 'Buat halaman profil personal dengan link bio',
          icon: Globe,
        },
        {
          nama: 'Mobile App',
          deskripsi: 'Akses semua fitur melalui aplikasi mobile',
          icon: Smartphone,
        },
        {
          nama: 'Dashboard Analytics',
          deskripsi: 'Monitor semua aktivitas dalam satu dashboard',
          icon: BarChart,
        },
        {
          nama: 'Goal Tracking',
          deskripsi: 'Set dan track target pembelajaran Anda',
          icon: Target,
        },
      ],
    },
  ];

  const keunggulan = [
    {
      title: '100% Halal & Islami',
      description: 'Semua konten dan fitur sesuai dengan nilai-nilai Islam',
      icon: CheckCircle,
    },
    {
      title: 'Verified Ulama',
      description: 'Content creator ulama telah melalui proses verifikasi',
      icon: Shield,
    },
    {
      title: 'Didukung Santri Aktif',
      description: 'Dibangun bersama santri Indonesia dengan fokus dakwah digital',
      icon: Heart,
    },
    {
      title: 'Teknologi Modern',
      description: 'Platform dengan teknologi terdepan untuk pengalaman optimal',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Santri Online</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/masuk" className="text-gray-600 hover:text-gray-900">
                Masuk
              </Link>
              <Link
                to="/daftar"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Fitur{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Lengkap
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Jelajahi semua fitur canggih Santri Online yang dirancang khusus untuk mendukung
              perjalanan pembelajaran Islam digital Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/daftar"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mulai Sekarang Gratis
              </Link>
              <Link
                to="/tentang"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fitur Utama */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Utama Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk pembelajaran Islam modern dalam satu platform
            </p>
          </div>

          <div className="space-y-16">
            {fiturUtama.map((kategori, index) => (
              <div key={index} className="relative">
                <div className="flex items-center mb-8">
                  <div
                    className={`w-12 h-12 ${kategori.bgColor} rounded-xl flex items-center justify-center mr-4`}
                  >
                    <kategori.icon className={`w-6 h-6 ${kategori.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{kategori.kategori}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {kategori.fitur.map((fitur, fiturIndex) => (
                    <div
                      key={fiturIndex}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center mb-4">
                        <fitur.icon className={`w-8 h-8 ${kategori.color} mr-3`} />
                        <h4 className="text-lg font-semibold text-gray-900">{fitur.nama}</h4>
                      </div>
                      <p className="text-gray-600">{fitur.deskripsi}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keunggulan */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Santri Online?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keunggulan yang membedakan kami dari platform pembelajaran lainnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keunggulan.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap Memulai Perjalanan Pembelajaran?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan santri lainnya dan rasakan pengalaman pembelajaran Islam yang
            modern
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/daftar"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Santri Online</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Platform pembelajaran Islam digital terdepan untuk santri modern
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/tentang" className="text-gray-400 hover:text-white">
                Tentang
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white">
                Privasi
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">
                Syarat
              </Link>
              <Link to="/bantuan" className="text-gray-400 hover:text-white">
                Bantuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
