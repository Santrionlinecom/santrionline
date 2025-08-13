// Direct upload endpoint untuk R2
// app/routes/api.upload.direct.ts

import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    // Auth check
    const { requireUserId } = await import('~/lib/session.server');
    await requireUserId(request, context);

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;

    if (!file || !key) {
      return json({ error: 'Missing file or key' }, { status: 400 });
    }

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      return json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Get R2 bucket from context
    const bucket = context.cloudflare.env.R2_BUCKET;
    if (!bucket) {
      return json({ error: 'R2 bucket not configured' }, { status: 500 });
    }

    // Upload to R2
    const result = await bucket.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    if (!result) {
      return json({ error: 'Upload failed' }, { status: 500 });
    }

    // Return public URL
    const publicUrl = `https://pub-images.santrionline.com/${key}`;

    return json({
      success: true,
      url: publicUrl,
      key,
    });
  } catch (error) {
    console.error('Direct upload error:', error);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
}
