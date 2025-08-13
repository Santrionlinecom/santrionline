// API route untuk delete post/comment
// app/routes/api.community.delete.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';

const deletePostSchema = z.object({
  postId: z.string().min(1),
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
    const { postId } = deletePostSchema.parse({
      postId: formData.get('postId'),
    });

    const { posts, postImages, likes, comments } = await import('~/db/community-schema');
    const { eq } = await import('drizzle-orm');

    // Check if post exists and user owns it
    const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post[0]) {
      return json({ error: 'Post tidak ditemukan' }, { status: 404 });
    }

    if (post[0].authorId !== userId) {
      // TODO: Add admin check here
      return json({ error: 'Tidak bisa menghapus post orang lain' }, { status: 403 });
    }

    // Delete associated data (cascade will handle some, but let's be explicit)
    // Delete comments
    await db.delete(comments).where(eq(comments.postId, postId));

    // Delete likes
    await db.delete(likes).where(eq(likes.postId, postId));

    // Delete images
    await db.delete(postImages).where(eq(postImages.postId, postId));

    // Delete the post itself
    await db.delete(posts).where(eq(posts.id, postId));

    return json({
      success: true,
      message: 'Post berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete API error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function loader() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}
