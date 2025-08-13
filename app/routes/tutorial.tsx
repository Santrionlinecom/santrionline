import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import {
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Search,
  Play,
  Download,
  Clock,
  User,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Tutorial & Panduan - Santri Online' },
    {
      name: 'description',
      content:
        'Tutorial lengkap dan panduan penggunaan platform Santri Online. Pelajari cara menggunakan semua fitur dengan mudah.',
    },
    {
      name: 'keywords',
      content: 'tutorial santri online, panduan pengguna, cara menggunakan, help',
    },
  ];
};

export default function TutorialPage() {
  const tutorialCategories = [
    {
      title: 'Memulai',
      description: 'Panduan untuk pengguna baru',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tutorials: [
        {
          title: 'Cara Mendaftar Akun',
          description: 'Langkah-langkah membuat akun Santri Online',
          duration: '3 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Mengatur Profil Pertama Kali',
          description: 'Cara melengkapi profil dan pengaturan awal',
          duration: '5 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Navigasi Dashboard',
          description: 'Mengenal fitur-fitur di dashboard utama',
          duration: '4 menit',
          type: 'text',
          level: 'Pemula',
        },
      ],
    },
    {
      title: 'Hafalan Al-Quran',
      description: 'Tutorial sistem hafalan',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tutorials: [
        {
          title: 'Memulai Hafalan Baru',
          description: 'Cara menambah target hafalan surat baru',
          duration: '6 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Tracking Progress Hafalan',
          description: 'Cara mencatat dan memantau progress hafalan',
          duration: '4 menit',
          type: 'video',
          level: 'Menengah',
        },
        {
          title: "Fitur Muroja'ah",
          description: 'Menggunakan sistem pengulangan hafalan',
          duration: '5 menit',
          type: 'text',
          level: 'Menengah',
        },
      ],
    },
    {
      title: 'Dompet Digital',
      description: 'Tutorial DinCoin & DirCoin',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tutorials: [
        {
          title: 'Cara Top Up Saldo',
          description: 'Mengisi saldo DinCoin dan DirCoin',
          duration: '3 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Bertransaksi di Marketplace',
          description: 'Cara membeli karya menggunakan dompet digital',
          duration: '4 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Riwayat Transaksi',
          description: 'Melihat dan mengelola riwayat transaksi',
          duration: '2 menit',
          type: 'text',
          level: 'Pemula',
        },
      ],
    },
    {
      title: 'Komunitas & Karya',
      description: 'Tutorial berinteraksi & berbagi',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tutorials: [
        {
          title: 'Bergabung di Forum',
          description: 'Cara berpartisipasi dalam diskusi komunitas',
          duration: '5 menit',
          type: 'video',
          level: 'Pemula',
        },
        {
          title: 'Upload Karya Digital',
          description: 'Cara mengunggah dan menjual karya di marketplace',
          duration: '8 menit',
          type: 'video',
          level: 'Menengah',
        },
        {
          title: 'Mengatur Biolink',
          description: 'Membuat halaman biolink personal',
          duration: '6 menit',
          type: 'text',
          level: 'Menengah',
        },
      ],
    },
  ];

  const faqItems = [
    {
      question: 'Bagaimana cara reset password?',
      answer:
        "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan ikuti instruksi yang dikirim via email.",
    },
    {
      question: 'Apakah platform ini gratis?',
      answer:
        'Ya, pendaftaran dan fitur dasar Santri Online gratis. Beberapa konten premium memerlukan DinCoin atau DirCoin.',
    },
    {
      question: 'Bagaimana cara mendapatkan DinCoin?',
      answer:
        'DinCoin bisa didapat melalui top up, menyelesaikan achievement, atau aktivitas pembelajaran tertentu.',
    },
    {
      question: 'Bisakah saya menggunakan platform ini di HP?',
      answer:
        'Ya, platform Santri Online responsif dan dapat diakses melalui browser mobile atau aplikasi mobile kami.',
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
              Tutorial &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Panduan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Pelajari cara menggunakan semua fitur Santri Online dengan tutorial lengkap dan mudah
              dipahami
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari tutorial atau panduan..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Categories */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {tutorialCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-8">
                  <div
                    className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center mr-4`}
                  >
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tutorials.map((tutorial, tutorialIndex) => (
                    <div
                      key={tutorialIndex}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {tutorial.type === 'video' ? (
                            <Video className="w-5 h-5 text-red-500 mr-2" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tutorial.level === 'Pemula'
                                ? 'bg-green-100 text-green-800'
                                : tutorial.level === 'Menengah'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tutorial.level}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {tutorial.duration}
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>

                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                        {tutorial.type === 'video' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Tonton Video
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Baca Panduan
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-lg text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
            <Link
              to="/bantuan"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hubungi Dukungan
            </Link>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Unduh Panduan PDF</h2>
          <p className="text-xl text-gray-600 mb-8">
            Dapatkan panduan lengkap dalam format PDF untuk dibaca offline
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Panduan Pengguna Lengkap</h3>
              <p className="text-gray-600 mb-4">
                Semua fitur dan cara penggunaan dalam satu dokumen
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Unduh PDF (2.5 MB)
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Quick Start Guide</h3>
              <p className="text-gray-600 mb-4">
                Panduan singkat untuk memulai menggunakan platform
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Unduh PDF (800 KB)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Siap Memulai?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Daftar sekarang dan mulai menggunakan semua fitur Santri Online
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
              Tutorial lengkap untuk pengalaman belajar yang optimal
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
