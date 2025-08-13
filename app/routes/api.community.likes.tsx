import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
// NOTE: server-only modules imported dynamically inside action
import { post_like, community_post } from '~/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
    
    const formData = await request.formData();
    const postId = formData.get('postId')?.toString();
    const action = formData.get('action')?.toString(); // 'like' or 'unlike'

    if (!postId) {
      return json({ 
        success: false, 
        error: 'Post ID diperlukan' 
      }, { status: 400 });
    }

    // Check if post exists
    const post = await db.query.community_post.findFirst({
      where: eq(community_post.id, postId),
    });

    if (!post) {
      return json({ 
        success: false, 
        error: 'Postingan tidak ditemukan' 
      }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await db.query.post_like.findFirst({
      where: and(
        eq(post_like.postId, postId),
        eq(post_like.userId, userId)
      ),
    });

    let newLikesCount = post.likesCount;
    let isLiked = false;

    if (action === 'like' && !existingLike) {
      // Add like
      const likeId = nanoid();
      await db.insert(post_like).values({
        id: likeId,
        postId,
        userId,
        createdAt: new Date(),
      });
      newLikesCount = post.likesCount + 1;
      isLiked = true;
    } else if (action === 'unlike' && existingLike) {
      // Remove like
      await db.delete(post_like).where(
        and(
          eq(post_like.postId, postId),
          eq(post_like.userId, userId)
        )
      );
      newLikesCount = Math.max(0, post.likesCount - 1);
      isLiked = false;
    } else {
      // Toggle behavior - if exists remove, if doesn't exist add
      if (existingLike) {
        await db.delete(post_like).where(
          and(
            eq(post_like.postId, postId),
            eq(post_like.userId, userId)
          )
        );
        newLikesCount = Math.max(0, post.likesCount - 1);
        isLiked = false;
      } else {
        const likeId = nanoid();
        await db.insert(post_like).values({
          id: likeId,
          postId,
          userId,
          createdAt: new Date(),
        });
        newLikesCount = post.likesCount + 1;
        isLiked = true;
      }
    }

    // Update post likes count
    await db.update(community_post)
      .set({ 
        likesCount: newLikesCount,
        updatedAt: new Date(),
      })
      .where(eq(community_post.id, postId));

    return json({
      success: true,
      isLiked,
      likesCount: newLikesCount,
    });

  } catch (error) {
    console.error('Error handling like:', error);
    return json({ 
      success: false, 
      error: 'Terjadi kesalahan saat memproses like' 
    }, { status: 500 });
  }
}
