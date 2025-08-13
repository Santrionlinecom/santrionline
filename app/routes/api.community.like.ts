// API route untuk like/unlike
// app/routes/api.community.like.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';

const likeSchema = z.object({
  postId: z.string().min(1),
  action: z.enum(['like', 'unlike']),
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
    const { postId, action } = likeSchema.parse({
      postId: formData.get('postId'),
      action: formData.get('action'),
    });

    const { likes } = await import('~/db/community-schema');
    const { eq, and } = await import('drizzle-orm');

    if (action === 'like') {
      // Add like
      const likeId = `like-${Date.now()}-${Math.random().toString(36).substring(2)}`;

      try {
        await db.insert(likes).values({
          id: likeId,
          postId,
          userId,
          createdAt: new Date(),
        });

        // Update likes count in posts table (if you want to cache it)
        // await db.update(posts)
        //   .set({ likesCount: sql`${posts.likesCount} + 1` })
        //   .where(eq(posts.id, postId));

        return json({ success: true, action: 'liked' });
      } catch (error) {
        // Handle unique constraint violation (user already liked)
        console.error('Like error:', error);
        return json({ error: 'Sudah like sebelumnya' }, { status: 400 });
      }
    } else {
      // Remove like
      await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

      // Update likes count in posts table (if you want to cache it)
      // await db.update(posts)
      //   .set({ likesCount: sql`${posts.likesCount} - 1` })
      //   .where(eq(posts.id, postId));

      return json({ success: true, action: 'unliked' });
    }
  } catch (error) {
    console.error('Like API error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

// GET method tidak didukung
export async function loader() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}
