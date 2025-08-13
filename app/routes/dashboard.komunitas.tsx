import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData, useFetcher } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Textarea } from '~/components/ui/textarea';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  TrendingUp,
  Clock,
  Eye,
  Star,
  Bookmark,
  MoreHorizontal,
  Search,
  Image as ImageIcon,
  Video,
  User,
  Calendar,
} from 'lucide-react';
import { community_post, user as userSchema } from '~/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
// NOTE: server-only imports (db, session) are dynamically imported inside loader
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Feed Komunitas - Dashboard Santri Online' },
    {
      name: 'description',
      content: 'Feed personal komunitas santri, postingan terbaru, dan interaksi sosial',
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);

  try {
    // Get recent posts for feed
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
        isLiked: sql<boolean>`EXISTS(
          SELECT 1 FROM post_like 
          WHERE post_id = ${community_post.id} 
          AND user_id = ${userId}
        )`,
      })
      .from(community_post)
      .leftJoin(userSchema, eq(community_post.authorId, userSchema.id))
      .where(eq(community_post.isPublished, true))
      .orderBy(desc(community_post.createdAt))
      .limit(10);

    // Get user info
    const userInfo = await db
      .select({
        id: userSchema.id,
        name: userSchema.name,
        avatarUrl: userSchema.avatarUrl,
      })
      .from(userSchema)
      .where(eq(userSchema.id, userId))
      .limit(1);

    // Get total stats
    const totalPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(community_post)
      .where(eq(community_post.isPublished, true));

    const userPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(community_post)
      .where(eq(community_post.authorId, userId));

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
      user: userInfo[0] || null,
      stats: {
        totalPosts: totalPosts[0]?.count || 0,
        userPosts: userPosts[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return json({
      posts: [],
      user: null,
      stats: { totalPosts: 0, userPosts: 0 },
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

export default function DashboardKomunitasPage() {
  const { posts, user, stats } = useLoaderData<typeof loader>();
  const likeFetcher = useFetcher();
  const [newPostContent, setNewPostContent] = useState('');

  const handleLike = (postId: string, isCurrentlyLiked: boolean) => {
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('action', isCurrentlyLiked ? 'unlike' : 'like');

    likeFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/likes',
    });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Feed Komunitas',
      href: '/community',
      color: 'text-blue-600',
    },
    {
      icon: Plus,
      label: 'Buat Postingan',
      href: '/dashboard/komunitas/buat-post',
      color: 'text-green-600',
    },
    { icon: Users, label: 'Grup Komunitas', href: '/komunitas/grup', color: 'text-purple-600' },
    { icon: User, label: 'Profil Saya', href: '/komunitas/profil', color: 'text-indigo-600' },
    { icon: Search, label: 'Cari Diskusi', href: '/komunitas', color: 'text-orange-600' },
  ];

  const categories = {
    hafalan: { name: 'Hafalan', color: 'bg-blue-100 text-blue-800' },
    kajian: { name: 'Kajian', color: 'bg-green-100 text-green-800' },
    pengalaman: { name: 'Pengalaman', color: 'bg-purple-100 text-purple-800' },
    'tanya-jawab': { name: 'Tanya Jawab', color: 'bg-yellow-100 text-yellow-800' },
    event: { name: 'Event', color: 'bg-red-100 text-red-800' },
    teknologi: { name: 'Teknologi', color: 'bg-indigo-100 text-indigo-800' },
    umum: { name: 'Umum', color: 'bg-gray-100 text-gray-800' },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{user?.name || 'Santri'}</h3>
                  <Badge variant="secondary" className="mb-3">
                    <Star className="w-3 h-3 mr-1" />
                    Santri Aktif
                  </Badge>
                  <div className="grid grid-cols-2 gap-4 text-center w-full">
                    <div>
                      <div className="font-bold text-lg">{stats.userPosts}</div>
                      <div className="text-xs text-muted-foreground">Postingan</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">0</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="ghost" className="w-full justify-start" asChild>
                    <Link to={action.href}>
                      <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                      {action.label}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">#HafalanRamadan</div>
                  <div className="text-xs text-muted-foreground">1,234 posts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">#SantriTech</div>
                  <div className="text-xs text-muted-foreground">856 posts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">#KajianOnline</div>
                  <div className="text-xs text-muted-foreground">643 posts</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Post */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                    <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Apa yang ingin Anda bagikan hari ini?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px] border-0 resize-none p-0 focus-visible:ring-0"
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Foto
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4 mr-2" />
                          Video
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Event
                        </Button>
                      </div>
                      <Button asChild>
                        <Link to="/dashboard/komunitas/buat-post">
                          <Plus className="w-4 h-4 mr-2" />
                          Post
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada postingan</h3>
                    <p className="text-muted-foreground mb-4">
                      Jadilah yang pertama membuat postingan di feed Anda!
                    </p>
                    <Button asChild>
                      <Link to="/dashboard/komunitas/buat-post">
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Postingan Pertama
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                posts
                  .filter((post) => post !== null)
                  .map((post) => {
                    if (!post) return null;
                    const categoryInfo =
                      categories[post.category as keyof typeof categories] || categories.umum;

                    return (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={post.authorAvatar || undefined}
                                  alt={post.author}
                                />
                                <AvatarFallback>{post.authorInitial}</AvatarFallback>
                              </Avatar>
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
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${categoryInfo.color}`}
                                  >
                                    {categoryInfo.name}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                              <Link
                                to={`/komunitas/post/${post.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                          </div>

                          {/* Post Actions */}
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
                                {post.isLiked ? 'Liked' : 'Like'}
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/komunitas/post/${post.id}`}>
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Comment
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
            </div>

            {/* Load More */}
            {posts.length > 0 && (
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Lihat Postingan Lainnya
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Komunitas Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Postingan</span>
                  <span className="font-bold">{stats.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anggota Aktif</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Diskusi Hari Ini</span>
                  <span className="font-bold">34</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/komunitas">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grup Untuk Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-800">HQ</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Hafalan Al-Quran</div>
                    <div className="text-xs text-muted-foreground">1,247 anggota</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Gabung
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-800">ST</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Santri Tech</div>
                    <div className="text-xs text-muted-foreground">634 anggota</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Gabung
                  </Button>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/komunitas/grup">Lihat Semua Grup</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Komunitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Member</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Post Hari Ini</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Diskusi Aktif</span>
                  <span className="font-semibold">12</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/komunitas">Bergabung Diskusi</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
