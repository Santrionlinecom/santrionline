import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
// NOTE: server-only modules imported dynamically inside action
import { community_post } from '~/db/schema';
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
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const category = formData.get('category')?.toString() || 'umum';

    // Validation
    if (!title || title.trim().length < 5) {
      return json(
        {
          success: false,
          error: 'Judul harus minimal 5 karakter',
        },
        { status: 400 },
      );
    }

    if (!content || content.trim().length < 10) {
      return json(
        {
          success: false,
          error: 'Konten harus minimal 10 karakter',
        },
        { status: 400 },
      );
    }

    // Validate category
    const validCategories = [
      'hafalan',
      'kajian',
      'pengalaman',
      'tanya-jawab',
      'event',
      'teknologi',
      'umum',
    ];
    if (!validCategories.includes(category)) {
      return json(
        {
          success: false,
          error: 'Kategori tidak valid',
        },
        { status: 400 },
      );
    }

    // Create new post
    const postId = nanoid();
    const now = new Date();

    await db.insert(community_post).values({
      id: postId,
      authorId: userId,
      title: title.trim(),
      content: content.trim(),
      category: category as
        | 'hafalan'
        | 'kajian'
        | 'pengalaman'
        | 'tanya-jawab'
        | 'event'
        | 'teknologi'
        | 'umum',
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    });

    return json({
      success: true,
      message: 'Postingan berhasil dibuat!',
      postId,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return json(
      {
        success: false,
        error: 'Terjadi kesalahan saat membuat postingan',
      },
      { status: 500 },
    );
  }
}
