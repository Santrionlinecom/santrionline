// API route untuk comment
// app/routes/api.community.comment.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';

const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

const deleteCommentSchema = z.object({
  commentId: z.string().min(1),
  action: z.literal('delete'),
});

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');

    const userId = await requireUserId(request, context);
    const db = getDb(context);

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();
    const action = formData.get('action') as string;

    const { comments, posts } = await import('~/db/community-schema');
    const { eq } = await import('drizzle-orm');

    if (action === 'delete') {
      // Delete comment
      const { commentId } = deleteCommentSchema.parse({
        commentId: formData.get('commentId'),
        action: formData.get('action'),
      });

      // Check if user owns the comment or is admin
      const comment = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);

      if (!comment[0]) {
        return json({ error: 'Komentar tidak ditemukan' }, { status: 404 });
      }

      if (comment[0].userId !== userId) {
        // TODO: Add admin check
        return json({ error: 'Tidak bisa menghapus komentar orang lain' }, { status: 403 });
      }

      await db.delete(comments).where(eq(comments.id, commentId));

      return json({ success: true, action: 'deleted' });
    } else {
      // Create comment
      const { postId, content } = commentSchema.parse({
        postId: formData.get('postId'),
        content: formData.get('content'),
      });

      // Check if post exists
      const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

      if (!post[0]) {
        return json({ error: 'Post tidak ditemukan' }, { status: 404 });
      }

      // Create comment
      const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      await db.insert(comments).values({
        id: commentId,
        postId,
        userId,
        content: content.trim(),
        createdAt: new Date(),
      });

      // Get the created comment with user info
      const { user } = await import('~/db/schema');
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

      return json({
        success: true,
        comment: newComment[0],
        action: 'created',
      });
    }
  } catch (error) {
    console.error('Comment API error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function loader() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}
