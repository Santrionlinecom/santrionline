import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import { community_post, user as userSchema, post_comment } from '~/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
// NOTE: server-only modules (db, session) now imported dynamically inside loader/action
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Textarea } from '~/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  Clock,
  Star,
  Send,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [{ title: 'Postingan Tidak Ditemukan - Santri Online' }];
  }

  return [
    { title: `${data.post.title} - Komunitas Santri Online` },
    { name: 'description', content: data.post.content.slice(0, 160) + '...' },
    { property: 'og:title', content: data.post.title },
    { property: 'og:description', content: data.post.content.slice(0, 160) + '...' },
    { property: 'og:type', content: 'article' },
  ];
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { postId } = params;
  const { getDb } = await import('~/db/drizzle.server');
  const { getUserId } = await import('~/lib/session.server');
  const db = getDb(context);
  const userId = await getUserId(request, context);

  if (!postId) {
    throw new Response('Post ID tidak ditemukan', { status: 404 });
  }

  try {
    // Get post with author info and user's like status
    const postData = await db
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
      .where(and(eq(community_post.id, postId), eq(community_post.isPublished, true)))
      .limit(1);

    if (!postData.length) {
      throw new Response('Postingan tidak ditemukan', { status: 404 });
    }

    const post = postData[0];

    // Get comments with author info
    const comments = await db
      .select({
        id: post_comment.id,
        content: post_comment.content,
        createdAt: post_comment.createdAt,
        author: {
          id: userSchema.id,
          name: userSchema.name,
          avatarUrl: userSchema.avatarUrl,
        },
      })
      .from(post_comment)
      .leftJoin(userSchema, eq(post_comment.authorId, userSchema.id))
      .where(eq(post_comment.postId, postId))
      .orderBy(desc(post_comment.createdAt));

    // Update view count (in a real app, you might want to do this more efficiently)
    await db
      .update(community_post)
      .set({
        viewsCount: post.viewsCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(community_post.id, postId));

    return json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        likes: post.likesCount,
        comments: post.commentsCount,
        views: post.viewsCount + 1, // Include the new view
        createdAt: formatRelativeTime(post.createdAt),
        author: post.author?.name || 'Anonymous',
        authorInitial: getInitials(post.author?.name || 'Anonymous'),
        authorAvatar: post.author?.avatarUrl,
        isLiked: Boolean(post.isLiked),
      },
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: formatRelativeTime(comment.createdAt),
        author: comment.author?.name || 'Anonymous',
        authorInitial: getInitials(comment.author?.name || 'Anonymous'),
        authorAvatar: comment.author?.avatarUrl,
      })),
      currentUser: userId,
    });
  } catch (error) {
    console.error('Error loading post:', error);
    throw new Response('Terjadi kesalahan saat memuat postingan', { status: 500 });
  }
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const { postId } = params;

  if (!postId) {
    return json({ success: false, error: 'Post ID diperlukan' }, { status: 400 });
  }

  const { requireUserId } = await import('~/lib/session.server');
  await requireUserId(request, context);
  const formData = await request.formData();
  const intent = formData.get('intent')?.toString();

  if (intent === 'comment') {
    const content = formData.get('content')?.toString();

    if (!content || content.trim().length < 3) {
      return json(
        {
          success: false,
          error: 'Komentar harus minimal 3 karakter',
        },
        { status: 400 },
      );
    }

    // Forward to comment API
    const apiFormData = new FormData();
    apiFormData.append('postId', postId);
    apiFormData.append('content', content.trim());

    try {
      const response = await fetch(`${new URL(request.url).origin}/api/community/comments`, {
        method: 'POST',
        body: apiFormData,
        headers: {
          Cookie: request.headers.get('Cookie') || '',
        },
      });

      const result = await response.json();
      return json(result);
    } catch (error) {
      console.error('Error creating comment:', error);
      return json(
        {
          success: false,
          error: 'Terjadi kesalahan saat membuat komentar',
        },
        { status: 500 },
      );
    }
  }

  return json({ success: false, error: 'Invalid intent' }, { status: 400 });
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

const categories = {
  hafalan: { name: 'Hafalan', color: 'bg-blue-100 text-blue-800' },
  kajian: { name: 'Kajian', color: 'bg-green-100 text-green-800' },
  pengalaman: { name: 'Pengalaman', color: 'bg-purple-100 text-purple-800' },
  'tanya-jawab': { name: 'Tanya Jawab', color: 'bg-yellow-100 text-yellow-800' },
  teknologi: { name: 'Teknologi', color: 'bg-indigo-100 text-indigo-800' },
  umum: { name: 'Umum', color: 'bg-gray-100 text-gray-800' },
};

export default function PostDetailPage() {
  const { post, comments, currentUser } = useLoaderData<typeof loader>();
  const likeFetcher = useFetcher();
  const commentFetcher = useFetcher();
  const [newComment, setNewComment] = useState('');

  const categoryInfo = categories[post.category as keyof typeof categories] || categories.umum;

  const handleLike = () => {
    if (!currentUser) {
      window.location.href = '/masuk?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    const formData = new FormData();
    formData.append('postId', post.id);
    formData.append('action', post.isLiked ? 'unlike' : 'like');

    likeFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/likes',
    });
  };

  const handleComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      window.location.href = '/masuk?redirectTo=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (newComment.trim().length < 3) return;

    const formData = new FormData();
    formData.append('intent', 'comment');
    formData.append('content', newComment.trim());

    commentFetcher.submit(formData, { method: 'POST' });
    setNewComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.slice(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/komunitas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Komunitas
            </Link>
          </Button>
        </div>

        {/* Post */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {post.authorAvatar ? (
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-lg font-bold">
                      {post.authorInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{post.author}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Santri
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.createdAt}
                    </div>
                    <Badge variant="outline" className={`text-xs ${categoryInfo.color}`}>
                      {categoryInfo.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
              <div className="prose prose-lg max-w-none text-foreground">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Post Stats & Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                  <span className="text-sm">suka</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comments}</span>
                  <span className="text-sm">komentar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{post.views}</span>
                  <span className="text-sm">dilihat</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={post.isLiked ? 'default' : 'outline'}
                  onClick={handleLike}
                  disabled={likeFetcher.state === 'submitting'}
                  className={post.isLiked ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.isLiked ? 'Disukai' : 'Suka'}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Komentar ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            {currentUser ? (
              <form onSubmit={handleComment} className="space-y-4">
                <Textarea
                  placeholder="Tulis komentar Anda..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                  disabled={commentFetcher.state === 'submitting'}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {newComment.length}/1000 karakter
                  </span>
                  <Button
                    type="submit"
                    disabled={newComment.trim().length < 3 || commentFetcher.state === 'submitting'}
                    size="sm"
                  >
                    {commentFetcher.state === 'submitting' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Bergabung untuk Berkomentar</h3>
                <p className="text-muted-foreground mb-4">
                  Daftar atau masuk untuk ikut berdiskusi dengan komunitas santri
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link to={`/masuk?redirectTo=${encodeURIComponent(window.location.pathname)}`}>
                      Masuk
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/daftar">Daftar</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Belum ada komentar</h3>
                <p className="text-muted-foreground">
                  Jadilah yang pertama berkomentar di postingan ini
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="w-10 h-10">
                      {comment.authorAvatar ? (
                        <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-sm font-bold">
                          {comment.authorInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Santri
                        </Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
