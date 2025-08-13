// API endpoint for handling bookmarks
// app/routes/api.community.bookmark.tsx

import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const { posts } = await import('~/db/community-schema');

    await requireUserId(request, context);
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const postId = formData.get('postId') as string;

    if (!postId) {
      return json({ error: 'Post ID is required' }, { status: 400 });
    }

    const db = getDb(context);

    switch (action) {
      case 'toggle-bookmark': {
        // Check if post exists
        const post = await db
          .select({ id: posts.id })
          .from(posts)
          .where(eq(posts.id, postId))
          .get();

        if (!post) {
          return json({ error: 'Post not found' }, { status: 404 });
        }

        // For now, just return success (you can implement actual bookmark storage later)
        return json({
          success: true,
          action: 'bookmarked', // This would toggle based on current state
          message: 'Bookmark toggled successfully',
        });
      }

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bookmark API error:', error);
    return json(
      {
        error: 'Failed to process bookmark action',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
