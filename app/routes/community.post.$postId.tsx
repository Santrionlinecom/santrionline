// Single Post Detail Route
// app/routes/community.post.$postId.tsx

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link } from '@remix-run/react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowLeft, Share2, Flag } from 'lucide-react';

import PostCard from '~/components/community/PostCard';
import CommentForm from '~/components/community/CommentForm';
import CommentList from '~/components/community/CommentList';
import { PostCardSkeleton } from '~/components/Skeletons';

import type { CommentWithAuthor } from '~/db/community-schema';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: 'Post Tidak Ditemukan - SantriOnline' },
      { name: 'description', content: 'Post yang Anda cari tidak ditemukan.' },
    ];
  }

  const { post } = data;
  const description = post.content
    ? post.content.slice(0, 160) + (post.content.length > 160 ? '...' : '')
    : `Post dari ${post.author?.name || 'Anonim'} di komunitas SantriOnline`;

  return [
    { title: `${post.author?.name || 'Post'} - SantriOnline` },
    { name: 'description', content: description },
    { property: 'og:title', content: `Post dari ${post.author?.name || 'Anonim'}` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
  ];
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');

  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const postId = params.postId;

  if (!postId) {
    throw new Response('Post ID required', { status: 400 });
  }

  try {
    const { posts, postImages, comments } = await import('~/db/community-schema');
    const { user } = await import('~/db/schema');
    const { sql, desc, eq } = await import('drizzle-orm');

    // Get the post with author info and engagement data
    const postQuery = await db
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
      .leftJoin(user, eq(posts.authorId, user.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (!postQuery[0]) {
      throw new Response('Post not found', { status: 404 });
    }

    const post = postQuery[0];

    // Get images for the post
    const imagesResult = await db
      .select()
      .from(postImages)
      .where(eq(postImages.postId, postId))
      .orderBy(postImages.idx);

    // Get all comments for the post (include parentId and map user -> author for CommentList)
    const commentsResult = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        parentId: comments.parentId,
        author: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(comments)
      .leftJoin(user, eq(comments.userId, user.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    // Get share parent if this is a shared post
    let shareParent = null;
    if (post.shareParentId) {
      const shareParentQuery = await db
        .select({
          id: posts.id,
          authorId: posts.authorId,
          content: posts.content,
          createdAt: posts.createdAt,
          author: {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
        })
        .from(posts)
        .leftJoin(user, eq(posts.authorId, user.id))
        .where(eq(posts.id, post.shareParentId))
        .limit(1);

      shareParent = shareParentQuery[0] || null;
    }

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

    // Organize data
    const postData = {
      ...post,
      // Ensure author is never null for PostCard typing
      author: post.author ?? { id: post.authorId, name: 'Anonim', avatarUrl: null },
      images: imagesResult,
      shareParent: shareParent
        ? {
            id: shareParent.id,
            content: shareParent.content,
            createdAt: shareParent.createdAt,
            updatedAt: null,
            shareParentId: null,
            authorId: shareParent.authorId,
            author: shareParent.author ? { name: shareParent.author.name } : { name: 'Unknown' },
          }
        : null,
    };

    // Increment view count (async, don't wait)
    // You might want to implement a view tracking system here

    return json({
      post: postData,
      comments: commentsResult.map((comment) => ({
        ...comment,
        author: comment.author ?? { id: comment.userId, name: 'Anonim', avatarUrl: null },
      })) as CommentWithAuthor[],
      user: currentUser[0] || null,
    });
  } catch (error) {
    console.error('Post detail loader error:', error);
    throw new Response('Server error', { status: 500 });
  }
}

export default function PostDetailPage() {
  const { post, comments, user } = useLoaderData<typeof loader>();

  if (!post || !user) {
    return <PostCardSkeleton />;
  }

  // (removed adaptedComments transformation since CommentForm no longer receives comments prop)

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      // You could show a toast here
      alert('Link post disalin ke clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback: open share dialog
      if (navigator.share) {
        navigator.share({
          title: `Post dari ${post.author?.name || 'Anonim'}`,
          text: post.content || 'Lihat post ini di SantriOnline',
          url: url,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/community" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Feed
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>

            {post.authorId !== user.id && (
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Laporkan
              </Button>
            )}
          </div>
        </div>

        {/* Main Post */}
        <div className="space-y-6">
          <PostCard post={post} currentUserId={user.id} />

          {/* Comments Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Komentar ({comments.length})</h3>

              {/* New Comment Form */}
              <CommentForm user={user} postId={post.id} onCommentAdded={() => {}} />

              {/* Comment List */}
              <CommentList
                comments={comments.map((comment) => ({
                  id: comment.id,
                  content: comment.content,
                  createdAt: comment.createdAt,
                  userId: comment.userId,
                  postId: comment.postId,
                  parentId: comment.parentId,
                  author: comment.author,
                }))}
                postId={post.id}
                currentUser={user}
              />
            </CardContent>
          </Card>

          {/* Related Posts or Recommendations */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Post Lainnya dari {post.author?.name || 'Penulis'}
              </h3>
              <div className="text-center text-muted-foreground py-8">
                <p>Fitur ini akan segera hadir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
