// Community Feed Route - Updated with Enhanced Feed
// app/routes/community._index.tsx

import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { z } from 'zod';

// Components
import ComposePost from '~/components/ComposePost';
import CommunityFeed from '~/components/community/CommunityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Users, TrendingUp, MessageCircle, Plus, Sparkles, Search, Filter } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Komunitas - SantriOnline' },
    {
      name: 'description',
      content: 'Platform komunitas santri untuk berbagi inspirasi dan berdiskusi',
    },
  ];
};

// Validation schemas
const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  imageUrls: z.string().optional(),
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');

  const userId = await requireUserId(request, context);
  const db = getDb(context);

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 20);

  try {
    // Import community schema
    const { posts, postImages, comments } = await import('~/db/community-schema');
    const { user } = await import('~/db/schema');
    const { sql, desc, eq, lt } = await import('drizzle-orm');

    // Build cursor condition
    const cursorCondition = cursor ? lt(posts.createdAt, new Date(parseInt(cursor))) : undefined;

    // Get posts with author info and engagement data
    const postsQuery = db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        shareParentId: posts.shareParentId,
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        likesCount: sql<number>`(
          SELECT COUNT(*) FROM likes 
          WHERE post_id = ${posts.id}
        )`,
        commentsCount: sql<number>`(
          SELECT COUNT(*) FROM comments 
          WHERE post_id = ${posts.id}
        )`,
        isLiked: sql<boolean>`EXISTS(
          SELECT 1 FROM likes 
          WHERE post_id = ${posts.id} AND user_id = ${userId}
        )`,
      })
      .from(posts)
      .innerJoin(user, eq(posts.authorId, user.id))
      .where(cursorCondition)
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1); // +1 to check if there are more

    const postsResult = await postsQuery;
    const hasMore = postsResult.length > limit;
    const feedPosts = hasMore ? postsResult.slice(0, -1) : postsResult;

    // Get images for posts
    const postIds = feedPosts.map((p) => p.id);
    const imagesResult =
      postIds.length > 0
        ? await db
            .select()
            .from(postImages)
            .where(sql`${postImages.postId} IN ${postIds}`)
            .orderBy(postImages.idx)
        : [];

    // Get comments for posts (latest 3 per post)
    const commentsResult =
      postIds.length > 0
        ? await db
            .select({
              id: comments.id,
              postId: comments.postId,
              userId: comments.userId,
              content: comments.content,
              createdAt: comments.createdAt,
              user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
              },
            })
            .from(comments)
            .leftJoin(user, eq(comments.userId, user.id))
            .where(sql`${comments.postId} IN ${postIds}`)
            .orderBy(desc(comments.createdAt))
            .limit(postIds.length * 3)
        : [];

    // Organize data
    const feedData = feedPosts.map((post) => ({
      ...post,
      images: imagesResult.filter((img) => img.postId === post.id),
      shareParent: null, // TODO: Implement share data fetching
    }));

    // Get current user info
    const currentUser = await db
      .select({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    // Get community stats
    const totalPosts = await db.select({ count: sql<number>`count(*)` }).from(posts);

    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(user);

    const todayPosts = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(sql`DATE(${posts.createdAt}/1000, 'unixepoch') = DATE('now')`);

    return json({
      posts: feedData,
      comments: commentsResult,
      user: currentUser[0] || null,
      hasMore,
      nextCursor: hasMore ? feedPosts[feedPosts.length - 1]?.createdAt.getTime().toString() : null,
      stats: {
        totalPosts: totalPosts[0]?.count || 0,
        totalUsers: totalUsers[0]?.count || 0,
        todayPosts: todayPosts[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Community feed loader error:', error);
    return json({
      posts: [],
      comments: [],
      user: null,
      hasMore: false,
      nextCursor: null,
      stats: { totalPosts: 0, totalUsers: 0, todayPosts: 0 },
    });
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');

  const userId = await requireUserId(request, context);
  const db = getDb(context);

  const formData = await request.formData();
  const action = formData.get('action') as string;

  try {
    const { posts, postImages } = await import('~/db/community-schema');

    switch (action) {
      case 'create': {
        const { content, imageUrls } = createPostSchema.parse({
          content: formData.get('content'),
          imageUrls: formData.get('imageUrls'),
        });

        // Create post
        const postId = `post-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        await db.insert(posts).values({
          id: postId,
          authorId: userId,
          content,
          createdAt: new Date(),
        });

        // Add images if any
        if (imageUrls) {
          const urls = JSON.parse(imageUrls) as string[];
          if (urls.length > 0) {
            const imageRecords = urls.map((url, index) => ({
              id: `img-${Date.now()}-${index}`,
              postId,
              url,
              idx: index,
              width: null,
              height: null,
            }));
            await db.insert(postImages).values(imageRecords);
          }
        }

        return json({ success: true, postId });
      }

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Community action error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export default function CommunityFeedPage() {
  const { posts, user, hasMore, stats } = useLoaderData<typeof loader>();
  const [showCompose, setShowCompose] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="p-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="text-muted-foreground">
              Anda harus login untuk mengakses feed komunitas.
            </p>
            <Button className="mt-4" asChild>
              <a href="/masuk">Login Sekarang</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Profile */}
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">{user.name}</h3>
                <Badge variant="secondary" className="mb-4">
                  <Users className="w-3 h-3 mr-1" />
                  Santri Aktif
                </Badge>
                <Button onClick={() => setShowCompose(!showCompose)} className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Post
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Statistik Komunitas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Post</span>
                  <span className="font-semibold">{stats.totalPosts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Member</span>
                  <span className="font-semibold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Post Hari Ini</span>
                  <span className="font-semibold">{stats.todayPosts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">#KajianRamadan</div>
                  <div className="text-xs text-muted-foreground">234 posts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">#HafalanQuran</div>
                  <div className="text-xs text-muted-foreground">189 posts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">#SantriTech</div>
                  <div className="text-xs text-muted-foreground">156 posts</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Enhanced Welcome Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                      Selamat datang di Komunitas SantriOnline!
                    </h2>
                    <p className="text-blue-700 dark:text-blue-200 text-sm">
                      Berbagi inspirasi, diskusi ilmu, dan saling support dalam perjalanan santri
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <Button
                    onClick={() => setShowCompose(!showCompose)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Post
                  </Button>

                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    {stats.todayPosts} post hari ini • {stats.totalUsers} santri aktif
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compose Post */}
            {showCompose && (
              <ComposePost
                user={user}
                onSuccess={() => {
                  setShowCompose(false);
                  window.location.reload(); // Refresh feed
                }}
              />
            )}

            {/* Enhanced Community Feed */}
            <CommunityFeed
              initialPosts={posts.map((post) => ({
                id: post.id,
                content: post.content || '',
                authorId: post.authorId,
                author: {
                  id: post.author.id,
                  name: post.author.name,
                  avatarUrl: post.author.avatarUrl || undefined,
                  verified: false, // You can add this field later
                },
                images:
                  post.images?.map((img) => ({
                    id: img.id,
                    url: img.url,
                    description: undefined, // Description not available in current schema
                  })) || [],
                createdAt:
                  typeof post.createdAt === 'string'
                    ? post.createdAt
                    : new Date(post.createdAt).toISOString(),
                updatedAt:
                  typeof post.updatedAt === 'string'
                    ? post.updatedAt
                    : post.updatedAt
                      ? new Date(post.updatedAt).toISOString()
                      : new Date(post.createdAt).toISOString(),
                likes: post.likesCount || 0,
                commentCount: post.commentsCount || 0,
                shareCount: 0, // You can add this field later
                viewCount: Math.floor(Math.random() * 100) + 10, // Mock data for now
                isLiked: post.isLiked || false,
                isBookmarked: false, // You can add this field later
                isFollowing: false, // You can add this field later
                comments: [], // Comments will be loaded separately
                privacy: 'public' as const,
              }))}
              currentUser={{
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl || undefined,
              }}
              hasMore={hasMore}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Cari Post
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Temukan Teman
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grup Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-800 text-sm">HQ</span>
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
                    <span className="font-bold text-green-800 text-sm">ST</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Santri Tech</div>
                    <div className="text-xs text-muted-foreground">834 anggota</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Gabung
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
