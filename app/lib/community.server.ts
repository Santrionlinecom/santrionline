// Server utilities untuk komunitas
// app/lib/community.server.ts

import type { AppLoadContext } from '@remix-run/cloudflare';
import { eq, desc, sql, and, lt } from 'drizzle-orm';

// Rate limiting storage (dalam production, gunakan KV atau Durable Objects)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Rate limiting untuk posting dan interaksi
 */
export function checkRateLimit(
  userId: string,
  action: 'post' | 'comment' | 'like',
  window: number = 5 * 60 * 1000, // 5 menit
  maxActions: number = 5,
): boolean {
  const now = Date.now();
  const key = `${userId}:${action}`;
  const current = rateLimitMap.get(key);

  if (!current || now - current.lastReset > window) {
    // Reset window
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (current.count >= maxActions) {
    return false; // Rate limited
  }

  current.count++;
  return true;
}

/**
 * Get feed posts dengan cursor-based pagination
 */
export async function getFeed(params: {
  context: AppLoadContext;
  viewerId: string;
  cursor?: string;
  limit?: number;
}) {
  const { getDb } = await import('~/db/drizzle.server');
  const { posts, postImages, comments } = await import('~/db/community-schema');
  const { user } = await import('~/db/schema');

  const { context, viewerId, cursor, limit = 10 } = params;
  const db = getDb(context);

  try {
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
          WHERE post_id = ${posts.id} AND user_id = ${viewerId}
        )`,
      })
      .from(posts)
      .leftJoin(user, eq(posts.authorId, user.id))
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

    // Get recent comments for posts (latest 3 per post)
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

    return {
      posts: feedData,
      comments: commentsResult,
      hasMore,
      nextCursor: hasMore ? feedPosts[feedPosts.length - 1]?.createdAt.getTime().toString() : null,
    };
  } catch (error) {
    console.error('getFeed error:', error);
    return {
      posts: [],
      comments: [],
      hasMore: false,
      nextCursor: null,
    };
  }
}

/**
 * Toggle like pada post
 */
export async function toggleLike(params: {
  context: AppLoadContext;
  postId: string;
  userId: string;
  action: 'like' | 'unlike';
}) {
  const { getDb } = await import('~/db/drizzle.server');
  const { likes } = await import('~/db/community-schema');

  const { context, postId, userId, action } = params;
  const db = getDb(context);

  try {
    if (action === 'like') {
      const likeId = `like-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      await db.insert(likes).values({
        id: likeId,
        postId,
        userId,
        createdAt: new Date(),
      });
    } else {
      await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    }

    return { success: true };
  } catch (error) {
    console.error('toggleLike error:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

/**
 * Create comment
 */
export async function createComment(params: {
  context: AppLoadContext;
  postId: string;
  userId: string;
  content: string;
}) {
  const { getDb } = await import('~/db/drizzle.server');
  const { comments } = await import('~/db/community-schema');
  const { user } = await import('~/db/schema');

  const { context, postId, userId, content } = params;
  const db = getDb(context);

  try {
    const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    await db.insert(comments).values({
      id: commentId,
      postId,
      userId,
      content: content.trim(),
      createdAt: new Date(),
    });

    // Get the created comment with user info
    const newComment = await db
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
      .where(eq(comments.id, commentId))
      .limit(1);

    return { success: true, comment: newComment[0] };
  } catch (error) {
    console.error('createComment error:', error);
    return { success: false, error: 'Failed to create comment' };
  }
}

/**
 * Share post
 */
export async function sharePost(params: {
  context: AppLoadContext;
  postId: string;
  userId: string;
}) {
  const { getDb } = await import('~/db/drizzle.server');
  const { posts } = await import('~/db/community-schema');

  const { context, postId, userId } = params;
  const db = getDb(context);

  try {
    // Check if original post exists
    const originalPost = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!originalPost[0]) {
      return { success: false, error: 'Post not found' };
    }

    // Prevent sharing own post
    if (originalPost[0].authorId === userId) {
      return { success: false, error: 'Cannot share own post' };
    }

    // Check if already shared
    const existingShare = await db
      .select()
      .from(posts)
      .where(and(eq(posts.shareParentId, postId), eq(posts.authorId, userId)))
      .limit(1);

    if (existingShare[0]) {
      return { success: false, error: 'Already shared this post' };
    }

    // Create share post
    const shareId = `share-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    await db.insert(posts).values({
      id: shareId,
      authorId: userId,
      content: null,
      shareParentId: postId,
      createdAt: new Date(),
    });

    return { success: true, shareId };
  } catch (error) {
    console.error('sharePost error:', error);
    return { success: false, error: 'Failed to share post' };
  }
}

/**
 * Sanitize content
 */
export function sanitizeContent(content: string): string {
  // Basic HTML escaping
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

/**
 * Generate signed upload URL untuk R2
 */
export async function getSignedUploadUrl(params: {
  context: AppLoadContext;
  postId: string;
  contentType: string;
  size: number;
}) {
  const { postId, contentType, size } = params;

  // Validate file
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (size > maxSize) {
    return { success: false, error: 'File too large' };
  }

  if (!allowedTypes.includes(contentType)) {
    return { success: false, error: 'Invalid file type' };
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = contentType.split('/')[1];
  const key = `posts/${postId}/${timestamp}-${randomId}.${extension}`;

  // For now, return upload info for direct upload
  // In production, implement proper signed URL generation
  return {
    success: true,
    key,
    uploadEndpoint: '/api/upload/direct',
    publicUrl: `https://pub-images.santrionline.com/${key}`,
  };
}
