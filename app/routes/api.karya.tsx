import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
// NOTE: server-only imports moved to dynamic imports inside action/loader
import { karya } from '~/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

interface KaryaRequestBody {
  title: string;
  content: string;
  category?: string;
  tags?: string;
  excerpt?: string;
  contentType?: string;
  price?: number;
  isFree?: boolean;
  status?: string;
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const userId = await requireUserId(request, context);
    const db = getDb(context);
    const { title, content, category, tags, excerpt, contentType, price, isFree, status } =
      (await request.json()) as KaryaRequestBody;

    // Validasi input
    if (!title || !content) {
      return json({ error: 'Judul dan konten harus diisi' }, { status: 400 });
    }

    const id = nanoid();
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '') || id;

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Insert ke database D1
    const newKarya = {
      id,
      authorId: userId,
      title,
      description: excerpt || content.substring(0, 150) + '...',
      content,
      contentType: (contentType === 'html' ? 'html' : 'text') as 'text' | 'html',
      excerpt: excerpt || content.substring(0, 300) + '...',
      category: category || '',
      tags: tags || '',
      price: isFree ? 0 : price || 0,
      isFree: isFree || false,
      status:
        status === 'published' || status === 'archived'
          ? status
          : ('draft' as 'draft' | 'published' | 'archived'),
      slug,
      readingTime,
      viewCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: status === 'published' ? new Date() : null,
      fileUrl: '',
      featuredImage: '',
      seoTitle: title,
      seoDescription: excerpt || '',
      seoKeywords: tags || '',
    };

    await db.insert(karya).values(newKarya);
    return json({
      success: true,
      message: 'Karya berhasil disimpan',
      karya: newKarya,
    });
  } catch (error) {
    console.error('Error saving karya:', error);
    return json(
      {
        success: false,
        error: 'Gagal menyimpan karya: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    );
  }
}

export async function loader({ request, context }: ActionFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const userId = await requireUserId(request, context);
    const db = getDb(context);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get user's karya
    const userKarya = await db
      .select()
      .from(karya)
      .where(eq(karya.authorId, userId))
      .orderBy(desc(karya.createdAt))
      .limit(limit)
      .offset(offset);

    // Get stats
    const allKarya = await db.select().from(karya).where(eq(karya.authorId, userId));

    const stats = {
      total: allKarya.length,
      published: allKarya.filter((k) => k.status === 'published').length,
      draft: allKarya.filter((k) => k.status === 'draft').length,
      totalViews: allKarya.reduce((sum, k) => sum + (k.viewCount || 0), 0),
      totalDownloads: allKarya.reduce((sum, k) => sum + (k.downloadCount || 0), 0),
    };

    return json({
      success: true,
      karya: userKarya,
      stats,
    });
  } catch (error) {
    console.error('Error fetching karya:', error);
    return json(
      {
        success: false,
        error: 'Gagal mengambil data karya',
      },
      { status: 500 },
    );
  }
}
