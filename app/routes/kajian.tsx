import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { BookOpen, Calendar, Users, Clock, Play } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Kajian Islam Online - Santri Online' },
    {
      name: 'description',
      content:
        'Ikuti kajian Islam online dari para ulama terpercaya. Jadwal kajian rutin, webinar, dan diskusi seputar Islam Ahlussunnah wal Jamaah.',
    },
    {
      name: 'keywords',
      content: 'kajian islam online, webinar islam, kuliah umum, ustadz online, pengajian virtual',
    },
  ];
};

export default function KajianPage() {
  const upcomingKajian = [
    {
      id: 1,
      title: 'Tafsir Surat Al-Baqarah: Ayat-ayat Cinta dan Kasih Sayang',
      speaker: 'Prof. Dr. KH. Ahmad Thib Raya, MA',
      date: '15 Agustus 2025',
      time: '19:30 - 21:00 WIB',
      type: 'Live Streaming',
      participants: 1250,
      image: '/placeholder-kajian.jpg',
      category: 'Tafsir',
      description:
        'Pembahasan mendalam tentang ayat-ayat cinta dan kasih sayang dalam Al-Quran serta implementasinya dalam kehidupan sehari-hari.',
    },
    {
      id: 2,
      title: 'Fiqh Muamalah di Era Digital: Hukum Transaksi Online',
      speaker: 'Dr. Ustadz Abdul Rahman Hakim',
      date: '18 Agustus 2025',
      time: '20:00 - 21:30 WIB',
      type: 'Interactive Webinar',
      participants: 890,
      image: '/placeholder-kajian.jpg',
      category: 'Fiqh',
      description:
        'Membahas hukum-hukum syariah terkait transaksi digital, e-commerce, dan cryptocurrency dari perspektif fiqh muamalah.',
    },
    {
      id: 3,
      title: 'Akhlak Mulia dalam Mendidik Anak Generation Alpha',
      speaker: 'Ustadzah Dr. Siti Nurhasanah',
      date: '22 Agustus 2025',
      time: '19:00 - 20:30 WIB',
      type: 'Workshop',
      participants: 567,
      image: '/placeholder-kajian.jpg',
      category: 'Tarbiyah',
      description:
        'Strategi mendidik anak di era digital dengan tetap menjaga nilai-nilai akhlak Islami yang mulia.',
    },
  ];

  const pastKajian = [
    {
      id: 1,
      title: 'Sejarah Peradaban Islam: Masa Keemasan Abbasiyah',
      speaker: 'Dr. Prof. Muhammad Hasan',
      date: '10 Agustus 2025',
      views: 3450,
      duration: '1 jam 45 menit',
      category: 'Sejarah',
    },
    {
      id: 2,
      title: 'Hadits Arbain Nawawi: Hadits ke-15 tentang Kebaikan Akhlak',
      speaker: 'Ustadz Ahmad Fauzi, Lc',
      date: '8 Agustus 2025',
      views: 2890,
      duration: '1 jam 30 menit',
      category: 'Hadits',
    },
    {
      id: 3,
      title: 'Ekonomi Islam vs Ekonomi Konvensional',
      speaker: 'Dr. Ustadz Bambang Syukur',
      date: '5 Agustus 2025',
      views: 4120,
      duration: '2 jam',
      category: 'Ekonomi Islam',
    },
  ];

  const categories = [
    { name: 'Tafsir Al-Quran', count: 25, color: 'bg-blue-100 text-blue-800' },
    { name: 'Hadits', count: 18, color: 'bg-green-100 text-green-800' },
    { name: 'Fiqh', count: 32, color: 'bg-purple-100 text-purple-800' },
    { name: 'Aqidah', count: 15, color: 'bg-orange-100 text-orange-800' },
    { name: 'Sejarah Islam', count: 12, color: 'bg-red-100 text-red-800' },
    { name: 'Tarbiyah', count: 20, color: 'bg-pink-100 text-pink-800' },
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
              Kajian{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Islam Online
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ikuti kajian Islam berkualitas dari para ulama terpercaya. Tingkatkan pemahaman agama
              dengan materi yang sesuai Ahlussunnah wal Jamaah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/daftar"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Bergabung Gratis
              </Link>
              <Link
                to="/panduan"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Panduan Kajian
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Kategori Kajian</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="text-center">
                <div
                  className={`${category.color} rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer`}
                >
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs opacity-75">{category.count} kajian</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Kajian */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Kajian Mendatang</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jangan lewatkan kajian menarik dari para ulama pilihan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingKajian.map((kajian) => (
              <div
                key={kajian.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={kajian.image}
                    alt={kajian.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjxzdmcgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMTY4IiB5PSI2OCI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNOSAxMkw5IDE2TDE1IDEyTDkgOFYxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        kajian.type === 'Live Streaming'
                          ? 'bg-red-100 text-red-800'
                          : kajian.type === 'Interactive Webinar'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {kajian.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {kajian.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {kajian.title}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{kajian.speaker}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {kajian.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {kajian.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {kajian.participants.toLocaleString()} peserta terdaftar
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{kajian.description}</p>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Kajian */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Rekaman Kajian</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tonton kembali kajian-kajian yang telah berlalu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastKajian.map((kajian) => (
              <div
                key={kajian.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {kajian.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Play className="w-4 h-4 mr-1" />
                    {kajian.views.toLocaleString()} views
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {kajian.title}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{kajian.speaker}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{kajian.date}</span>
                  <span>{kajian.duration}</span>
                </div>

                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Tonton Rekaman
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/daftar"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Rekaman
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bergabung dengan Ribuan Santri Lainnya
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Dapatkan akses ke kajian eksklusif, diskusi langsung dengan ulama, dan materi
            pembelajaran berkualitas
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
            <p className="text-gray-400 mb-4">Kajian Islam berkualitas untuk santri modern</p>
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
