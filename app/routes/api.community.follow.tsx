// API endpoint for handling user follows
// app/routes/api.community.follow.tsx

import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const { user } = await import('~/db/schema');

    const userId = await requireUserId(request, context);
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const targetUserId = formData.get('userId') as string;

    if (!targetUserId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId === targetUserId) {
      return json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const db = getDb(context);

    switch (action) {
      case 'toggle-follow': {
        // Check if target user exists
        const targetUser = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.id, targetUserId))
          .get();

        if (!targetUser) {
          return json({ error: 'User not found' }, { status: 404 });
        }

        // For now, just return success (you can implement actual follow storage later)
        return json({
          success: true,
          action: 'followed', // This would toggle based on current state
          message: 'Follow toggled successfully',
        });
      }

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Follow API error:', error);
    return json(
      {
        error: 'Failed to process follow action',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
