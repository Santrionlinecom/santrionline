import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Users,
  MessageCircle,
  Heart,
  BookOpen,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Clock,
  Star,
  Award,
  Target,
  ArrowLeft,
  Shield,
  Globe,
  Lock,
  UserPlus,
  Filter,
} from 'lucide-react';
// NOTE: server-only session import moved into loader via dynamic import
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Grup Komunitas - Santri Online' },
    {
      name: 'description',
      content:
        'Bergabung dengan grup komunitas santri berdasarkan minat, lokasi, dan topik kajian. Temukan teman seperjuangan dalam menuntut ilmu.',
    },
    { property: 'og:title', content: 'Grup Komunitas - Santri Online' },
    {
      property: 'og:description',
      content:
        'Bergabung dengan grup komunitas santri berdasarkan minat, lokasi, dan topik kajian.',
    },
    { property: 'og:type', content: 'website' },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getUserId } = await import('~/lib/session.server');
  const userId = await getUserId(request, context);

  // For now, we'll use static data. Later this can be moved to database
  const groups = [
    {
      id: 'hafalan-quran',
      name: 'Hafalan Al-Quran',
      description:
        "Komunitas para penghafal Al-Quran untuk saling berbagi tips, motivasi, dan jadwal muraja'ah bersama.",
      category: 'hafalan',
      memberCount: 1247,
      isPrivate: false,
      lastActivity: '2 jam yang lalu',
      avatar: 'HQ',
      color: 'bg-blue-100 text-blue-800',
      admin: 'Ustadz Ahmad',
      topics: ['Tahfidz', "Muraja'ah", 'Tips Menghafal'],
      joinedByUser: false,
    },
    {
      id: 'fiqh-muamalah',
      name: 'Fiqh Muamalah Modern',
      description:
        'Diskusi seputar fiqh muamalah dalam konteks kehidupan modern, termasuk ekonomi syariah dan keuangan Islam.',
      category: 'kajian',
      memberCount: 856,
      isPrivate: false,
      lastActivity: '1 jam yang lalu',
      avatar: 'FM',
      color: 'bg-green-100 text-green-800',
      admin: 'Dr. Fatimah',
      topics: ['Ekonomi Syariah', 'Bank Syariah', 'Investasi Halal'],
      joinedByUser: true,
    },
    {
      id: 'santri-tech',
      name: 'Santri Tech Community',
      description:
        'Komunitas santri yang berkecimpung di dunia teknologi. Sharing pengalaman, project, dan peluang karir di bidang IT.',
      category: 'teknologi',
      memberCount: 634,
      isPrivate: false,
      lastActivity: '30 menit yang lalu',
      avatar: 'ST',
      color: 'bg-purple-100 text-purple-800',
      admin: 'Muhammad Rizki',
      topics: ['Programming', 'Islamic Apps', 'Tech Career'],
      joinedByUser: false,
    },
    {
      id: 'santri-jakarta',
      name: 'Santri Jakarta Raya',
      description:
        'Komunitas santri yang berdomisili di Jakarta dan sekitarnya. Sharing info kajian, diskusi, dan kegiatan sosial.',
      category: 'regional',
      memberCount: 1892,
      isPrivate: false,
      lastActivity: '15 menit yang lalu',
      avatar: 'SJ',
      color: 'bg-red-100 text-red-800',
      admin: 'Siti Nurhaliza',
      topics: ['Kajian Rutin', 'Gathering', 'Diskusi'],
      joinedByUser: true,
    },
    {
      id: 'business-syariah',
      name: 'Bisnis & Entrepreneurship Syariah',
      description:
        'Komunitas santri pengusaha dan yang berminat berbisnis dengan prinsip syariah. Share tips, networking, dan kolaborasi.',
      category: 'bisnis',
      memberCount: 445,
      isPrivate: false,
      lastActivity: '3 jam yang lalu',
      avatar: 'BS',
      color: 'bg-yellow-100 text-yellow-800',
      admin: 'Hasan Basri',
      topics: ['Startup Syariah', 'UMKM', 'Investment'],
      joinedByUser: false,
    },
    {
      id: 'santri-writers',
      name: 'Santri Writers Circle',
      description:
        'Komunitas santri yang gemar menulis. Berbagi karya, tips menulis, dan publishing artikel bernuansa Islami.',
      category: 'kreatif',
      memberCount: 723,
      isPrivate: false,
      lastActivity: '1 hari yang lalu',
      avatar: 'SW',
      color: 'bg-indigo-100 text-indigo-800',
      admin: 'Zahra Kamila',
      topics: ['Creative Writing', 'Islamic Articles', 'Publishing'],
      joinedByUser: false,
    },
    {
      id: 'alumni-pesantren',
      name: 'Alumni Pesantren Indonesia',
      description:
        'Komunitas alumni berbagai pesantren di Indonesia. Networking, sharing pengalaman, dan program alumni.',
      category: 'alumni',
      memberCount: 2134,
      isPrivate: false,
      lastActivity: '4 jam yang lalu',
      avatar: 'AP',
      color: 'bg-teal-100 text-teal-800',
      admin: 'KH. Abdullah',
      topics: ['Alumni Network', 'Career Support', 'Mentoring'],
      joinedByUser: true,
    },
    {
      id: 'kajian-kitab-kuning',
      name: 'Kajian Kitab Kuning',
      description:
        'Grup khusus untuk diskusi mendalam tentang kitab-kitab klasik (kitab kuning). Level menengah hingga lanjut.',
      category: 'kajian',
      memberCount: 567,
      isPrivate: true,
      lastActivity: '6 jam yang lalu',
      avatar: 'KK',
      color: 'bg-amber-100 text-amber-800',
      admin: 'Ustadz Yusuf',
      topics: ['Nahwu Sharaf', 'Fiqh Klasik', 'Tafsir'],
      joinedByUser: false,
    },
  ];

  const categories = [
    {
      name: 'Hafalan',
      slug: 'hafalan',
      count: groups.filter((g) => g.category === 'hafalan').length,
      icon: BookOpen,
    },
    {
      name: 'Kajian',
      slug: 'kajian',
      count: groups.filter((g) => g.category === 'kajian').length,
      icon: MessageCircle,
    },
    {
      name: 'Teknologi',
      slug: 'teknologi',
      count: groups.filter((g) => g.category === 'teknologi').length,
      icon: TrendingUp,
    },
    {
      name: 'Regional',
      slug: 'regional',
      count: groups.filter((g) => g.category === 'regional').length,
      icon: Globe,
    },
    {
      name: 'Bisnis',
      slug: 'bisnis',
      count: groups.filter((g) => g.category === 'bisnis').length,
      icon: Target,
    },
    {
      name: 'Kreatif',
      slug: 'kreatif',
      count: groups.filter((g) => g.category === 'kreatif').length,
      icon: Heart,
    },
    {
      name: 'Alumni',
      slug: 'alumni',
      count: groups.filter((g) => g.category === 'alumni').length,
      icon: Award,
    },
  ];

  return json({
    groups,
    categories,
    currentUser: userId,
  });
}

export default function GrupKomunitasPage() {
  const { groups, categories } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyJoined, setShowOnlyJoined] = useState(false);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesJoined = !showOnlyJoined || group.joinedByUser;
    return matchesSearch && matchesCategory && matchesJoined;
  });

  const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);
  const joinedGroups = groups.filter((group) => group.joinedByUser).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/komunitas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Komunitas
            </Link>
          </Button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Grup Komunitas</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bergabung dengan grup komunitas santri berdasarkan minat, lokasi, dan topik kajian.
              Temukan teman seperjuangan dalam menuntut ilmu.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl md:text-3xl font-bold mb-1">{groups.length}</div>
              <div className="text-sm text-muted-foreground">Total Grup</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <div className="text-2xl md:text-3xl font-bold mb-1">
                {totalMembers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Anggota</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
              <div className="text-2xl md:text-3xl font-bold mb-1">{joinedGroups}</div>
              <div className="text-sm text-muted-foreground">Grup Diikuti</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-2xl md:text-3xl font-bold mb-1">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Kategori</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Filter & Search */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Semua
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.slug}
                      variant={selectedCategory === category.slug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name === 'Hafalan' && <BookOpen className="w-4 h-4 mr-2" />}
                      {category.name === 'Kajian' && <MessageCircle className="w-4 h-4 mr-2" />}
                      {category.name === 'Teknologi' && <TrendingUp className="w-4 h-4 mr-2" />}
                      {category.name === 'Regional' && <Globe className="w-4 h-4 mr-2" />}
                      {category.name === 'Bisnis' && <Target className="w-4 h-4 mr-2" />}
                      {category.name === 'Kreatif' && <Heart className="w-4 h-4 mr-2" />}
                      {category.name === 'Alumni' && <Award className="w-4 h-4 mr-2" />}
                      {category.name}
                    </Button>
                  ))}
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari grup..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyJoined}
                    onChange={(e) => setShowOnlyJoined(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Hanya grup yang diikuti</span>
                </label>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all'
                  ? 'Semua Grup'
                  : `Grup ${categories.find((c) => c.slug === selectedCategory)?.name}`}
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  ({filteredGroups.length})
                </span>
              </h2>

              {filteredGroups.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Tidak ada grup ditemukan</h3>
                    <p className="text-muted-foreground mb-4">
                      Coba ubah filter atau kata kunci pencarian Anda.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        {/* Group Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${group.color.replace('text-', 'bg-').replace('-100', '-500')}`}
                            >
                              {group.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{group.name}</h3>
                                {group.isPrivate && (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                                {group.joinedByUser && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Diikuti
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {group.memberCount.toLocaleString()} anggota
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                {group.lastActivity}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Group Description */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {group.description}
                        </p>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {group.topics.slice(0, 3).map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {group.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.topics.length - 3} lainnya
                            </Badge>
                          )}
                        </div>

                        {/* Admin */}
                        <div className="flex items-center gap-2 mb-4 text-sm">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Admin:</span>
                          <span className="font-medium">{group.admin}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {group.joinedByUser ? (
                            <>
                              <Button size="sm" className="flex-1">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Lihat Grup
                              </Button>
                              <Button size="sm" variant="outline">
                                Keluar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" className="flex-1">
                                <UserPlus className="w-4 h-4 mr-2" />
                                {group.isPrivate ? 'Minta Bergabung' : 'Bergabung'}
                              </Button>
                              <Button size="sm" variant="outline">
                                Info
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategori Grup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCategory(category.slug);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      {category.name === 'Hafalan' && <BookOpen className="w-4 h-4" />}
                      {category.name === 'Kajian' && <MessageCircle className="w-4 h-4" />}
                      {category.name === 'Teknologi' && <TrendingUp className="w-4 h-4" />}
                      {category.name === 'Regional' && <Globe className="w-4 h-4" />}
                      {category.name === 'Bisnis' && <Target className="w-4 h-4" />}
                      {category.name === 'Kreatif' && <Heart className="w-4 h-4" />}
                      {category.name === 'Alumni' && <Award className="w-4 h-4" />}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Grup Baru
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Cari Anggota
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Jadwal Diskusi
                </Button>
              </CardContent>
            </Card>

            {/* Popular Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grup Populer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groups
                  .sort((a, b) => b.memberCount - a.memberCount)
                  .slice(0, 3)
                  .map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${group.color.replace('text-', 'bg-').replace('-100', '-500')}`}
                      >
                        {group.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm line-clamp-1">{group.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {group.memberCount.toLocaleString()} anggota
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Tidak Menemukan Grup yang Cocok?</h2>
            <p className="text-xl mb-6 opacity-90">
              Buat grup baru untuk topik atau minat yang belum tersedia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" variant="secondary" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Buat Grup Baru
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hubungi Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
