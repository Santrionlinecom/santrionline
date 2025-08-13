import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData, useFetcher } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  Plus,
  Search,
  Clock,
  Eye,
  Star,
  Award,
  Target,
  ArrowLeft,
  User,
} from 'lucide-react';
// server-only db import moved to dynamic import in loader
import { community_post, user as userSchema } from '~/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
// session helper moved to dynamic import in loader
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Komunitas - Santri Online' },
    {
      name: 'description',
      content:
        'Bergabunglah dengan komunitas santri dari seluruh Indonesia. Diskusi, berbagi ilmu, dan tumbuh bersama.',
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getDb } = await import('~/db/drizzle.server');
  const { getUserId } = await import('~/lib/session.server');
  const db = getDb(context);
  const userId = await getUserId(request, context);

  try {
    // Get recent posts with author info and user's like status
    const posts = await db
      .select({
        id: community_post.id,
        title: community_post.title,
        content: community_post.content,
        category: community_post.category,
        likesCount: community_post.likesCount,
        commentsCount: community_post.commentsCount,
        viewsCount: community_post.viewsCount,
        createdAt: community_post.createdAt,
        author: {
          id: userSchema.id,
          name: userSchema.name,
          avatarUrl: userSchema.avatarUrl,
        },
        isLiked: userId
          ? sql<boolean>`EXISTS(
          SELECT 1 FROM post_like 
          WHERE post_id = ${community_post.id} 
          AND user_id = ${userId}
        )`
          : sql<boolean>`0`,
      })
      .from(community_post)
      .leftJoin(userSchema, eq(community_post.authorId, userSchema.id))
      .where(eq(community_post.isPublished, true))
      .orderBy(desc(community_post.createdAt))
      .limit(20);

    // Get category statistics
    const categoryStats = await db
      .select({
        category: community_post.category,
        count: sql<number>`count(*)`,
      })
      .from(community_post)
      .where(eq(community_post.isPublished, true))
      .groupBy(community_post.category);

    // Get total community stats
    const totalPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(community_post)
      .where(eq(community_post.isPublished, true));

    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(userSchema);

    return json({
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        likes: post.likesCount,
        comments: post.commentsCount,
        views: post.viewsCount,
        createdAt: formatRelativeTime(post.createdAt),
        author: post.author?.name || 'Anonymous',
        authorInitial: getInitials(post.author?.name || 'Anonymous'),
        authorAvatar: post.author?.avatarUrl,
        isLiked: Boolean(post.isLiked),
      })),
      categoryStats: categoryStats.reduce(
        (acc, stat) => {
          acc[stat.category] = stat.count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      totalPosts: totalPosts[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      currentUser: userId,
    });
  } catch (error) {
    console.error('Error loading community data:', error);
    // Return empty data if database error
    return json({
      posts: [],
      categoryStats: {},
      totalPosts: 0,
      totalUsers: 0,
      currentUser: userId,
    });
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function KomunitasPage() {
  const { posts, categoryStats, totalPosts, totalUsers, currentUser } =
    useLoaderData<typeof loader>();
  const likeFetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const communityStats = [
    {
      icon: Users,
      label: 'Anggota Aktif',
      value: totalUsers.toLocaleString(),
      color: 'text-blue-600',
    },
    {
      icon: MessageCircle,
      label: 'Total Diskusi',
      value: totalPosts.toLocaleString(),
      color: 'text-green-600',
    },
    {
      icon: BookOpen,
      label: 'Sharing Ilmu',
      value: Math.floor(totalPosts * 0.4).toLocaleString(),
      color: 'text-purple-600',
    },
    {
      icon: Award,
      label: 'Expert Members',
      value: Math.max(1, Math.floor(totalUsers * 0.02)).toLocaleString(),
      color: 'text-yellow-600',
    },
  ];

  const categories = [
    {
      name: 'Hafalan',
      slug: 'hafalan',
      count: (categoryStats as Record<string, number>).hafalan || 0,
      color: 'bg-blue-100 text-blue-800',
      icon: BookOpen,
    },
    {
      name: 'Kajian',
      slug: 'kajian',
      count: (categoryStats as Record<string, number>).kajian || 0,
      color: 'bg-green-100 text-green-800',
      icon: MessageCircle,
    },
    {
      name: 'Pengalaman',
      slug: 'pengalaman',
      count: (categoryStats as Record<string, number>).pengalaman || 0,
      color: 'bg-purple-100 text-purple-800',
      icon: Heart,
    },
    {
      name: 'Tanya Jawab',
      slug: 'tanya-jawab',
      count: (categoryStats as Record<string, number>)['tanya-jawab'] || 0,
      color: 'bg-yellow-100 text-yellow-800',
      icon: Target,
    },
    {
      name: 'Teknologi',
      slug: 'teknologi',
      count: (categoryStats as Record<string, number>).teknologi || 0,
      color: 'bg-indigo-100 text-indigo-800',
      icon: TrendingUp,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    if (!post) return false;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: string, isCurrentlyLiked: boolean) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/masuk?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('action', isCurrentlyLiked ? 'unlike' : 'like');

    likeFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/likes',
    });
  };

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
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Komunitas Santri Online</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan santri dari seluruh Indonesia. Berbagi ilmu, diskusi, dan
              tumbuh bersama dalam kebaikan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 max-w-2xl mx-auto">
              {currentUser ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard/komunitas/buat-post">
                    <Plus className="w-5 h-5 mr-2" />
                    Buat Postingan
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link to="/daftar">
                    <Plus className="w-5 h-5 mr-2" />
                    Bergabung Sekarang
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link to="/komunitas/grup">
                  <Users className="w-5 h-5 mr-2" />
                  Grup Komunitas
                </Link>
              </Button>
              {currentUser && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/komunitas/profil">
                    <User className="w-5 h-5 mr-2" />
                    Profil Saya
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Semua
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari diskusi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all'
                  ? 'Diskusi Terbaru'
                  : `Diskusi ${categories.find((c) => c.slug === selectedCategory)?.name}`}
              </h2>

              {filteredPosts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada postingan</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedCategory !== 'all'
                        ? 'Tidak ada postingan yang sesuai dengan pencarian Anda.'
                        : 'Jadilah yang pertama membuat postingan di komunitas ini!'}
                    </p>
                    {currentUser && (
                      <Button asChild>
                        <Link to="/dashboard/komunitas/buat-post">
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Postingan Pertama
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPosts
                  .filter((post) => post !== null)
                  .map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {post.authorInitial}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{post.author}</span>
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Santri
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {post.createdAt}
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {categories.find((c) => c.slug === post.category)?.name ||
                                    post.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                          <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                        </div>

                        {/* Post Stats & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id, post.isLiked)}
                              disabled={likeFetcher.state === 'submitting'}
                              className={post.isLiked ? 'text-red-500' : ''}
                            >
                              <Heart
                                className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`}
                              />
                              {post.isLiked ? 'Disukai' : 'Suka'}
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/komunitas/post/${post.id}`}>
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Balas
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4 mr-1" />
                              Bagikan
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}

              {filteredPosts.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    Lihat Lebih Banyak Postingan
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm" asChild>
                  <Link to="/komunitas/grup">
                    <Users className="w-4 h-4 mr-2" />
                    Lihat Semua Grup
                  </Link>
                </Button>
                {currentUser && (
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link to="/dashboard/komunitas/buat-post">
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Postingan
                    </Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Cari Anggota
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategori Diskusi</CardTitle>
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
                      <category.icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Mulai Berkontribusi di Komunitas</h2>
            <p className="text-xl mb-6 opacity-90">
              Bergabunglah dengan diskusi, berbagi pengalaman, dan tumbuh bersama santri lainnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              {currentUser ? (
                <Button size="lg" variant="secondary" className="flex-1" asChild>
                  <Link to="/dashboard/komunitas/buat-post">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Postingan
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="flex-1" asChild>
                  <Link to="/daftar">
                    <Plus className="w-4 h-4 mr-2" />
                    Daftar Sekarang
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 flex-1"
                asChild
              >
                <Link to="/kontak">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
