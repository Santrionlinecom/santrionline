// API route untuk share
// app/routes/api.community.share.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';

const shareSchema = z.object({
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
    const { postId } = shareSchema.parse({
      postId: formData.get('postId'),
    });

    const { posts } = await import('~/db/community-schema');
    const { eq } = await import('drizzle-orm');

    // Check if original post exists
    const originalPost = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!originalPost[0]) {
      return json({ error: 'Post tidak ditemukan' }, { status: 404 });
    }

    // Prevent sharing own post
    if (originalPost[0].authorId === userId) {
      return json({ error: 'Tidak bisa share post sendiri' }, { status: 400 });
    }

    // Check if user already shared this post
    const { and } = await import('drizzle-orm');
    const existingShare = await db
      .select()
      .from(posts)
      .where(and(eq(posts.shareParentId, postId), eq(posts.authorId, userId)))
      .limit(1);

    if (existingShare[0]) {
      return json({ error: 'Sudah share post ini sebelumnya' }, { status: 400 });
    }

    // Create share post
    const shareId = `share-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    await db.insert(posts).values({
      id: shareId,
      authorId: userId,
      content: null, // Share posts don't have content
      shareParentId: postId,
      createdAt: new Date(),
    });

    return json({
      success: true,
      shareId,
      message: 'Post berhasil dibagikan!',
    });
  } catch (error) {
    console.error('Share API error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}

export async function loader() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}
