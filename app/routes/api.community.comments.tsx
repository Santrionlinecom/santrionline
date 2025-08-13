import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
// NOTE: server-only modules imported dynamically inside action
import { post_comment, community_post } from '~/db/schema';
import { eq } from 'drizzle-orm';
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
    const content = formData.get('content')?.toString();

    // Validation
    if (!postId) {
      return json({ 
        success: false, 
        error: 'Post ID diperlukan' 
      }, { status: 400 });
    }

    if (!content || content.trim().length < 3) {
      return json({ 
        success: false, 
        error: 'Komentar harus minimal 3 karakter' 
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

    // Create new comment
    const commentId = nanoid();
    const now = new Date();

    await db.insert(post_comment).values({
      id: commentId,
      postId,
      authorId: userId,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    });

    // Update post comments count
    const newCommentsCount = post.commentsCount + 1;
    await db.update(community_post)
      .set({ 
        commentsCount: newCommentsCount,
        updatedAt: new Date(),
      })
      .where(eq(community_post.id, postId));

    // Get user info for the response
    const { user: userSchema } = await import('~/db/schema');
    const user = await db.query.user.findFirst({
      where: eq(userSchema.id, userId),
      columns: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });

    return json({
      success: true,
      message: 'Komentar berhasil ditambahkan!',
      comment: {
        id: commentId,
        content: content.trim(),
        createdAt: now.toISOString(),
        author: {
          id: userId,
          name: user?.name || 'Anonymous',
          avatarUrl: user?.avatarUrl,
          initials: user?.name 
            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'AN'
        }
      },
      commentsCount: newCommentsCount,
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return json({ 
      success: false, 
      error: 'Terjadi kesalahan saat membuat komentar' 
    }, { status: 500 });
  }
}
