import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import {
  BookOpen,
  Users,
  Star,
  Globe,
  Heart,
  CheckCircle,
  Lightbulb,
  Target,
  MapPin,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Direktori Ulama - Santri Online' },
    {
      name: 'description',
      content:
        'Temukan dan ikuti ulama terpercaya di platform Santri Online. Akses kajian, konsultasi, dan pembelajaran langsung dari para ulama.',
    },
    {
      name: 'keywords',
      content: 'ulama indonesia, direktori ulama, kajian islam, konsultasi agama, ustadz, kyai',
    },
  ];
};

export default function UlamaPage() {
  const featuredUlama = [
    {
      id: 1,
      name: 'Prof. Dr. KH. Ahmad Thib Raya, MA',
      title: 'Ahli Tafsir & Hadits',
      location: 'Jakarta',
      image: '/placeholder-avatar.jpg',
      verified: true,
      followers: 15420,
      specialization: ['Tafsir Al-Quran', 'Hadits', 'Aqidah'],
      description:
        'Profesor Tafsir dan Hadits dengan pengalaman 30+ tahun dalam dakwah dan pendidikan Islam.',
      rating: 4.9,
      totalKajian: 145,
    },
    {
      id: 2,
      name: 'Dr. Ustadz Abdul Rahman Hakim',
      title: 'Pakar Fiqh & Muamalah',
      location: 'Yogyakarta',
      image: '/placeholder-avatar.jpg',
      verified: true,
      followers: 12350,
      specialization: ['Fiqh', 'Muamalah', 'Ekonomi Islam'],
      description: 'Doktor Syariah dengan fokus pada fiqh kontemporer dan ekonomi Islam modern.',
      rating: 4.8,
      totalKajian: 98,
    },
    {
      id: 3,
      name: 'Ustadzah Dr. Siti Nurhasanah',
      title: 'Ahli Pendidikan Islam',
      location: 'Bandung',
      image: '/placeholder-avatar.jpg',
      verified: true,
      followers: 9870,
      specialization: ['Pendidikan Islam', 'Psikologi Islam', 'Keluarga'],
      description:
        'Ahli pendidikan Islam dengan fokus pada pembentukan karakter dan keluarga sakinah.',
      rating: 4.9,
      totalKajian: 87,
    },
  ];

  const categories = [
    { name: 'Tafsir & Hadits', count: 25, icon: BookOpen },
    { name: 'Fiqh & Hukum', count: 32, icon: CheckCircle },
    { name: 'Aqidah & Akhlaq', count: 18, icon: Heart },
    { name: 'Sejarah Islam', count: 15, icon: Globe },
    { name: 'Ekonomi Islam', count: 12, icon: Target },
    { name: 'Pendidikan', count: 22, icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
              Direktori{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Ulama
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Temukan dan belajar dari para ulama terpercaya. Akses kajian, konsultasi, dan
              pembelajaran langsung dari ahli agama berpengalaman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/daftar"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Bergabung Sekarang
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

      {/* Search & Filter */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari ulama berdasarkan nama, lokasi, atau spesialisasi..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Yogyakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>Semua Bidang</option>
                <option>Tafsir & Hadits</option>
                <option>Fiqh & Hukum</option>
                <option>Aqidah & Akhlaq</option>
                <option>Ekonomi Islam</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Bidang Keahlian</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <category.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.count} ulama</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Ulama */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ulama Unggulan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Para ulama terpercaya dengan pengalaman dan kredibilitas tinggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredUlama.map((ulama) => (
              <div
                key={ulama.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={ulama.image}
                        alt={ulama.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                        }}
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg text-gray-900">{ulama.name}</h3>
                          {ulama.verified && <CheckCircle className="w-5 h-5 text-blue-500 ml-2" />}
                        </div>
                        <p className="text-green-600 font-medium">{ulama.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {ulama.location}
                    <div className="flex items-center ml-4">
                      <Users className="w-4 h-4 mr-1" />
                      {ulama.followers.toLocaleString()} pengikut
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{ulama.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {ulama.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{ulama.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">{ulama.totalKajian} kajian</div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Ikuti
                    </button>
                    <button className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors text-sm">
                      Lihat Profil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/daftar"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Semua Ulama
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bergabung dengan Komunitas Pembelajaran
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Akses kajian eksklusif, konsultasi langsung dengan ulama, dan bergabung dengan ribuan
            santri lainnya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/daftar"
              className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Santri Online</span>
            </Link>
            <p className="text-gray-400 mb-4">Belajar Islam dari para ulama terpercaya</p>
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
