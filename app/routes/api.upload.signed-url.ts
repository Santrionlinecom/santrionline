// R2 Upload Handler
// app/api/upload/signed-url.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';

// Validation schema
const uploadRequestSchema = z.object({
  postId: z.string().min(1),
  contentType: z
    .string()
    .refine(
      (type) => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
      'Content type must be JPEG, PNG, or WebP',
    ),
  size: z.number().max(2 * 1024 * 1024), // 2MB max
});

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    // Auth check
    const { requireUserId } = await import('~/lib/session.server');
    await requireUserId(request, context);

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json();
    const { postId, contentType, size } = uploadRequestSchema.parse(body);

    // Get R2 bucket from context
    const bucket = context.cloudflare.env.R2_BUCKET;
    if (!bucket) {
      return json({ error: 'R2 bucket not configured' }, { status: 500 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = contentType.split('/')[1];
    const key = `posts/${postId}/${timestamp}-${randomId}.${extension}`;

    // For demo purposes, we'll use direct upload to R2
    // In production, implement proper signed URL generation
    const publicUrl = `https://pub-images.santrionline.com/${key}`;

    return json({
      key,
      uploadEndpoint: '/api/upload/direct', // Custom endpoint for direct upload
      publicUrl,
      metadata: {
        contentType,
        size,
        postId,
      },
    });
  } catch (error) {
    console.error('Upload signed URL error:', error);
    if (error instanceof z.ZodError) {
      return json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    return json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
