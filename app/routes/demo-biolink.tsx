import { type MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import { Link } from '@remix-run/react';
import {
  Users,
  BookOpen,
  Star,
  Award,
  ArrowRight,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  MessageCircle,
  User,
  GraduationCap,
  Heart,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';

export const meta: MetaFunction = () => {
  return [
    { title: 'Demo Biolink - Santri Online' },
    {
      name: 'description',
      content:
        'Lihat contoh biolink santri, ustadz, dan pengguna Santri Online lainnya. Buat biolink Anda sendiri untuk berbagi profil dan karya Islam.',
    },
    {
      name: 'keywords',
      content: 'biolink santri, profil ustadz, biolink islam, santri online demo, profil santri',
    },
  ];
};

export default function DemoBiolink() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const demoProfiles = [
    {
      id: 'santritest',
      name: 'Ahmad Santri',
      username: 'santritest',
      category: 'santri',
      bio: '🎓 Santri Pesantren Darunnajah | 📚 Menghafal Al-Quran | 🕌 Aktivis Dakwah',
      avatar: '/images/avatars/santri-1.jpg',
      theme: 'light',
      stats: { followers: 890, progress: 75, badges: 12 },
      highlights: ['Tahfidz Progress 15 Juz', 'Active in Islamic Studies', 'Program Volunteer'],
      socialCount: 4,
      karyaCount: 2,
      verified: false,
    },
    {
      id: 'ustadzfarhan',
      name: 'Ustadz Farhan Maulana',
      username: 'ustadzfarhan',
      category: 'ustadz',
      bio: '🎓 Alumni Al-Azhar Kairo | 📖 Pengajar Kitab Kuning | 🕌 Imam Masjid',
      avatar: '/images/avatars/ustadz-1.jpg',
      theme: 'dark',
      stats: { followers: 12400, students: 2890, lessons: 156 },
      highlights: ['Verified Islamic Teacher', '10+ Years Experience', 'Published Author'],
      socialCount: 5,
      karyaCount: 3,
      verified: true,
    },
    {
      id: 'santriwati',
      name: 'Ummul Khoirot',
      username: 'santriwati',
      category: 'santriwati',
      bio: '👩‍🎓 Santriwati Pon-Pes Lirboyo | 📿 Huffadhah Al-Quran | 🌸 Kajian Khusus Akhawat',
      avatar: '/images/avatars/santriwati-1.jpg',
      theme: 'colorful',
      stats: { followers: 8750, students: 1240, lessons: 89 },
      highlights: ['Female Islamic Scholar', 'Quran Memorizer', 'Women Studies Expert'],
      socialCount: 4,
      karyaCount: 2,
      verified: true,
    },
    {
      id: 'hafidzali',
      name: 'Hafidz Ali Rahman',
      username: 'hafidzali',
      category: 'hafidz',
      bio: '🕌 Hafidz 30 Juz | 🎯 Instruktur Tahfidz | 📱 Content Creator Islami',
      avatar: '/images/avatars/hafidz-1.jpg',
      theme: 'light',
      stats: { followers: 15600, students: 3420, lessons: 201 },
      highlights: ['Complete Quran Memorizer', 'MTQ National Champion', 'YouTube Creator'],
      socialCount: 5,
      karyaCount: 4,
      verified: true,
    },
  ];

  const categories = [
    { id: 'all', name: 'Semua Profil', icon: Users },
    { id: 'santri', name: 'Santri', icon: GraduationCap },
    { id: 'ustadz', name: 'Ustadz', icon: User },
    { id: 'santriwati', name: 'Santriwati', icon: Heart },
    { id: 'hafidz', name: 'Hafidz', icon: BookOpen },
  ];

  const filteredProfiles =
    selectedCategory === 'all'
      ? demoProfiles
      : demoProfiles.filter((profile) => profile.category === selectedCategory);

  const getThemePreview = (theme: string) => {
    switch (theme) {
      case 'light':
        return 'bg-gradient-to-br from-white via-blue-50 to-green-50';
      case 'dark':
        return 'bg-gradient-to-br from-gray-900 via-gray-800 to-black';
      case 'colorful':
        return 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500';
      default:
        return 'bg-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'santri':
        return 'bg-blue-500';
      case 'ustadz':
        return 'bg-green-500';
      case 'santriwati':
        return 'bg-pink-500';
      case 'hafidz':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/images/islamic-pattern.svg')",
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Demo Biolink</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Contoh <span className="text-yellow-300">Biolink</span> Santri Online
            </h1>

            <p className="text-xl sm:text-2xl mb-8 leading-relaxed opacity-90">
              Lihat berbagai contoh profil biolink dari <strong>santri</strong>,{' '}
              <strong>ustadz</strong>, dan <strong>pengguna</strong> platform Santri Online
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/daftar">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
                >
                  <User className="w-5 h-5 mr-2" />
                  Buat Biolink Gratis
                </Button>
              </Link>
              <Link to="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Pelajari Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Pilih Kategori Profil
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Demo Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200"
            >
              {/* Theme Preview */}
              <div className={`h-24 ${getThemePreview(profile.theme)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {profile.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`${getCategoryColor(profile.category)} text-white border-0`}
                  >
                    {profile.category.charAt(0).toUpperCase() + profile.category.slice(1)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 -mt-8 relative">
                {/* Profile Avatar */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-green-600 font-medium">@{profile.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Theme: {profile.theme}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 mb-4 leading-relaxed">{profile.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  {profile.category === 'santri' ? (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {profile.stats.followers}
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {profile.stats.progress}%
                        </div>
                        <div className="text-xs text-gray-500">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {profile.stats.badges}
                        </div>
                        <div className="text-xs text-gray-500">Badges</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {(profile.stats.followers / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {((profile.stats.students || 0) / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-gray-500">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {profile.stats.lessons || 0}
                        </div>
                        <div className="text-xs text-gray-500">Lessons</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-4">
                  {profile.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      {highlight}
                    </div>
                  ))}
                </div>

                {/* Features Count */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 p-2 bg-green-50 rounded">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {profile.socialCount} Social Links
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {profile.karyaCount} Karya
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/${profile.username}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:scale-105 transition-transform">
                      Lihat Profil
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Overview */}
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Fitur Biolink Santri Online
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profil Kustom</h3>
              <p className="text-gray-600">
                Buat profil yang mencerminkan identitas Islam Anda dengan berbagai tema menarik
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Links</h3>
              <p className="text-gray-600">
                Kumpulkan semua link media sosial Anda dalam satu tempat yang mudah diakses
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Showcase Karya</h3>
              <p className="text-gray-600">
                Tampilkan karya tulis, video, atau produk digital Islam Anda kepada dunia
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Siap Membuat Biolink Anda?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan santri, ustadz, dan muslimah yang sudah menggunakan
                platform Santri Online untuk berbagi karya dan dakwah Islam
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/daftar">
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Daftar Gratis Sekarang
                  </Button>
                </Link>
                <Link to="/tentang">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-80">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  100% Gratis
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Manhaj Aswaja
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Komunitas Aktif
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
