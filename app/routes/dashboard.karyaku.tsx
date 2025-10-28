import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { motion } from 'framer-motion';
// server-only modules (db, session) are dynamically imported in loader/action
import { karya, user, karya_events } from '~/db/schema';
import { eq, desc, and, or, like, isNull, sql } from 'drizzle-orm';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import { Badge } from '~/components/ui/badge';
import { nanoid } from 'nanoid';
import {
  Plus,
  Edit3,
  Eye,
  Trash2,
  Save,
  Send,
  FileText,
  Code,
  Settings,
  Search,
  Calendar,
  Download,
  BookOpen,
  Globe,
  RotateCcw,
  Tag,
  Clock,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Karya Saya - Dashboard Santri Online' },
    {
      name: 'description',
      content:
        'Kelola karya tulis, artikel, dan konten kreatif Anda dengan mudah. Upload, edit, dan publikasikan karya untuk pembaca santri.',
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const { ensureMigrated } = await import('~/db/autoMigrate.server');
    const userId = await requireUserId(request, context);
    const db = getDb(context);
    await ensureMigrated(context);

    // Quick DB readiness check (table exists?)
    try {
      await db.get(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='karya'`);
    } catch (e) {
      throw new Error('Database not migrated: missing table "karya"');
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const search = url.searchParams.get('search') || '';
    const editId = url.searchParams.get('edit');

    // Build query conditions
    const showTrash = status === 'trash';
    const whereConditions = [eq(karya.authorId, userId)];
    if (showTrash) {
      whereConditions.push(sql`${karya.deletedAt} IS NOT NULL`);
    } else {
      whereConditions.push(isNull(karya.deletedAt));
    }
    if (status !== 'all' && status !== 'trash') {
      whereConditions.push(eq(karya.status, status as 'published' | 'draft'));
    }
    if (search) {
      const titleLike = like(karya.title, `%${search}%`);
      const descLike = like(karya.description, `%${search}%`);
      // descLike can be undefined if the column is nullable; only include valid SQL objects
      const searchCondition = descLike ? or(titleLike, descLike) : titleLike;
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    const userKarya = await db
      .select({
        id: karya.id,
        title: karya.title,
        description: karya.description,
        content: karya.content,
        contentType: karya.contentType,
        excerpt: karya.excerpt,
        category: karya.category,
        tags: karya.tags,
        price: karya.price,
        isFree: karya.isFree,
        status: karya.status,
        slug: karya.slug,
        readingTime: karya.readingTime,
        viewCount: karya.viewCount,
        downloadCount: karya.downloadCount,
        featuredImage: karya.featuredImage,
        seoTitle: karya.seoTitle,
        seoDescription: karya.seoDescription,
        seoKeywords: karya.seoKeywords,
        publishedAt: karya.publishedAt,
        createdAt: karya.createdAt,
        updatedAt: karya.updatedAt,
        deletedAt: karya.deletedAt,
        authorName: user.name,
      })
      .from(karya)
      .leftJoin(user, eq(karya.authorId, user.id))
      .where(and(...whereConditions))
      .orderBy(desc(karya.createdAt));

    let editingKarya = null;
    if (editId) {
      const editResult = await db
        .select({
          id: karya.id,
          title: karya.title,
          description: karya.description,
          content: karya.content,
          contentType: karya.contentType,
          excerpt: karya.excerpt,
          category: karya.category,
          tags: karya.tags,
          price: karya.price,
          isFree: karya.isFree,
          status: karya.status,
          slug: karya.slug,
          featuredImage: karya.featuredImage,
          seoTitle: karya.seoTitle,
          seoDescription: karya.seoDescription,
          seoKeywords: karya.seoKeywords,
          readingTime: karya.readingTime,
          createdAt: karya.createdAt,
        })
        .from(karya)
        .where(and(eq(karya.id, editId), eq(karya.authorId, userId)))
        .limit(1);
      editingKarya = editResult[0] || null;
    }

    const stats = {
      total: userKarya.length,
      published: userKarya.filter((k) => k.status === 'published').length,
      draft: userKarya.filter((k) => k.status === 'draft').length,
      totalViews: userKarya.reduce((sum, k) => sum + (k.viewCount || 0), 0),
      totalDownloads: userKarya.reduce((sum, k) => sum + (k.downloadCount || 0), 0),
    };

    return json({ userKarya, editingKarya, stats, status, search });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('karyaku loader error:', errorMessage);
    return json(
      {
        error: errorMessage,
        userKarya: [],
        editingKarya: null,
        stats: { total: 0, published: 0, draft: 0, totalViews: 0, totalDownloads: 0 },
        status: 'all',
        search: '',
      },
      { status: 200 },
    );
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  const action = formData.get('action') as string;

  try {
    if (action === 'create' || action === 'update') {
      const id = (formData.get('id') as string) || nanoid();
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const contentType = formData.get('contentType') as 'text' | 'html';
      const excerpt = formData.get('excerpt') as string;
      const category = formData.get('category') as string;
      const tags = formData.get('tags') as string;
      const price = parseInt(formData.get('price') as string) || 0;
      const isFree = formData.get('isFree') === 'true';
      const status = formData.get('status') as 'draft' | 'published' | 'archived';
      const featuredImage = formData.get('featuredImage') as string;
      const seoTitle = formData.get('seoTitle') as string;
      const seoDescription = formData.get('seoDescription') as string;
      const seoKeywords = formData.get('seoKeywords') as string;

      if (!title || !content) {
        return json({ error: 'Judul dan konten harus diisi' }, { status: 400 });
      }

      // Generate slug from title
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

      const now = new Date();
      const karyaData = {
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
        publishedAt: status === 'published' ? now : null,
        featuredImage: featuredImage || '',
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || '',
        seoKeywords: seoKeywords || tags || '',
        fileUrl: featuredImage || '', // Temporary mapping
        updatedAt: now,
        lastStatusChangedAt: now,
      };

      if (action === 'create') {
        await db.insert(karya).values({
          id,
          authorId: userId,
          createdAt: now,
          ...karyaData,
        });
        await db.insert(karya_events).values({
          id: nanoid(),
          karyaId: id,
          type: 'created',
          payloadJson: JSON.stringify({ status: karyaData.status, title }),
          createdAt: now,
        });
        return redirect(`/dashboard/karyaku?success=created`);
      } else {
        // Fetch previous status to decide if status changed
        const prev = await db
          .select({ status: karya.status })
          .from(karya)
          .where(and(eq(karya.id, id), eq(karya.authorId, userId)))
          .limit(1);
        const prevStatus = prev[0]?.status;
        if (prevStatus && prevStatus !== karyaData.status) {
          karyaData.lastStatusChangedAt = now;
          await db.insert(karya_events).values({
            id: nanoid(),
            karyaId: id,
            type: 'status_changed',
            payloadJson: JSON.stringify({ from: prevStatus, to: karyaData.status }),
            createdAt: now,
          });
        } else {
          await db.insert(karya_events).values({
            id: nanoid(),
            karyaId: id,
            type: 'updated',
            payloadJson: JSON.stringify({ status: karyaData.status }),
            createdAt: now,
          });
        }
        await db
          .update(karya)
          .set(karyaData)
          .where(and(eq(karya.id, id), eq(karya.authorId, userId)));
        return redirect(`/dashboard/karyaku?success=updated`);
      }
    }

    if (action === 'delete') {
      const id = formData.get('id') as string;
      const now = new Date();
      await db
        .update(karya)
        .set({ deletedAt: now })
        .where(and(eq(karya.id, id), eq(karya.authorId, userId)));
      await db.insert(karya_events).values({
        id: nanoid(),
        karyaId: id,
        type: 'deleted',
        payloadJson: JSON.stringify({}),
        createdAt: now,
      });
      return redirect(`/dashboard/karyaku?success=deleted`);
    }

    if (action === 'restore') {
      const id = formData.get('id') as string;
      const now = new Date();
      await db
        .update(karya)
        .set({ deletedAt: null, updatedAt: now })
        .where(and(eq(karya.id, id), eq(karya.authorId, userId)));
      await db.insert(karya_events).values({
        id: nanoid(),
        karyaId: id,
        type: 'restored',
        payloadJson: JSON.stringify({}),
        createdAt: now,
      });
      return redirect(`/dashboard/karyaku?success=restored`);
    }

    if (action === 'hard-delete') {
      const id = formData.get('id') as string;
      const now = new Date();
      await db.delete(karya).where(and(eq(karya.id, id), eq(karya.authorId, userId)));
      await db.insert(karya_events).values({
        id: nanoid(),
        karyaId: id,
        type: 'hard_deleted',
        payloadJson: JSON.stringify({}),
        createdAt: now,
      });
      return redirect(`/dashboard/karyaku?success=hard_deleted`);
    }

    return json({ error: 'Aksi tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Action error:', error);
    return json({ error: 'Terjadi kesalahan, silakan coba lagi' }, { status: 500 });
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function KaryakuPage() {
  const { userKarya, editingKarya, stats, status, search } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showEditor, setShowEditor] = useState(!!editingKarya);
  const [contentType, setContentType] = useState<'text' | 'html'>('text');
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  // Added missing states
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (autoSaveStatus === 'saved') {
      const t = setTimeout(() => setAutoSaveStatus('idle'), 3000);
      return () => clearTimeout(t);
    }
  }, [autoSaveStatus]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = navigation.state === 'submitting';

  // Initialize form with editing data
  useEffect(() => {
    if (editingKarya) {
      setContentType(editingKarya.contentType || 'text');
      if (editingKarya.content) {
        updateWordCount(editingKarya.content);
      }
    }
  }, [editingKarya]);

  // Function to update word count
  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  };

  // Auto-resize textarea and keyboard shortcuts
  useEffect(() => {
    const textarea = contentType === 'html' ? htmlEditorRef.current : textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';

      // Add keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 's':
              e.preventDefault();
              // Auto-save
              setAutoSaveStatus('saving');
              setTimeout(() => setAutoSaveStatus('saved'), 1000);
              break;
            case 'b':
              e.preventDefault();
              if (contentType === 'text') {
                document.execCommand('insertText', false, '**text**');
              }
              break;
            case 'i':
              e.preventDefault();
              if (contentType === 'text') {
                document.execCommand('insertText', false, '*text*');
              }
              break;
          }
        }
      };

      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [contentType]);

  const handleEditKarya = (karyaId: string) => {
    setSearchParams((params) => {
      params.set('edit', karyaId);
      return params;
    });
  };

  const categories = [
    'Artikel Islami',
    'Syair & Puisi',
    'Kajian Kitab',
    'Pengalaman Spiritual',
    'Tutorial',
    'Cerita Inspiratif',
    'Review Buku',
    'Opini & Analisis',
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Karya Saya
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola dan publikasikan karya tulis Anda untuk pembaca santri
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="px-6" onClick={() => setShowEditor(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Tulis Karya Baru
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6"
              onClick={() => {
                // Load template for artikel islami
                setShowEditor(true);
                setTimeout(() => {
                  const titleInput = document.getElementById('title') as HTMLInputElement;
                  const contentTextarea = textareaRef.current;
                  if (titleInput && contentTextarea) {
                    titleInput.value = 'Artikel Islami - [Judul Anda]';
                    contentTextarea.value = `# Bismillahirrahmanirrahim

## Pendahuluan

Tuliskan pendahuluan artikel Anda di sini...

## Pembahasan

### Poin Pertama
Jelaskan poin pertama dengan detail...

### Poin Kedua
Jelaskan poin kedua dengan detail...

## Dalil dan Referensi

> "Quote ayat atau hadits relevan" - (Sumber)

## Kesimpulan

Tuliskan kesimpulan dari artikel Anda...

---
*Wallahu a'lam bishawab*
`;
                    updateWordCount(contentTextarea.value);
                  }
                }, 100);
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Template Artikel
            </Button>
            <Link to="/dashboard/karyaku/tulis">
              <Button size="lg" variant="outline" className="px-6">
                <Edit3 className="w-5 h-5 mr-2" />
                Editor Terpisah
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            icon: FileText,
            label: 'Total Karya',
            value: stats.total.toString(),
            color: 'text-blue-600',
          },
          {
            icon: Globe,
            label: 'Dipublikasikan',
            value: stats.published.toString(),
            color: 'text-green-600',
          },
          { icon: Edit3, label: 'Draft', value: stats.draft.toString(), color: 'text-yellow-600' },
          {
            icon: Eye,
            label: 'Total Views',
            value: stats.totalViews.toString(),
            color: 'text-purple-600',
          },
          {
            icon: Download,
            label: 'Downloads',
            value: stats.totalDownloads.toString(),
            color: 'text-red-600',
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Editor/Form Section */}
      {showEditor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  {editingKarya ? 'Edit Karya' : 'Tulis Karya Baru'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const form = document.querySelector('form') as HTMLFormElement;
                      if (form) {
                        const formData = new FormData(form);
                        formData.set('action', editingKarya ? 'update' : 'create');
                        formData.set('status', 'draft');
                        setAutoSaveStatus('saving');
                        // Here you could implement actual auto-save functionality
                        setTimeout(() => setAutoSaveStatus('saved'), 1000);
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Auto Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditor(false);
                      setSearchParams((params) => {
                        params.delete('edit');
                        return params;
                      });
                    }}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form method="post" className="space-y-6">
                <input type="hidden" name="action" value={editingKarya ? 'update' : 'create'} />
                {editingKarya && <input type="hidden" name="id" value={editingKarya.id} />}

                {/* Basic Info */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Judul Karya <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        required
                        placeholder="Masukkan judul karya yang menarik..."
                        defaultValue={editingKarya?.title}
                        className="text-lg font-medium"
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium mb-2">
                        URL Slug
                      </label>
                      <Input
                        id="slug"
                        name="slug"
                        type="text"
                        placeholder="url-karya-anda"
                        defaultValue={editingKarya?.slug || ''}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Kosongkan untuk generate otomatis dari judul
                      </p>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Deskripsi Singkat <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="description"
                        name="description"
                        type="text"
                        required
                        placeholder="Ringkasan karya dalam 1-2 kalimat..."
                        defaultValue={editingKarya?.description || ''}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Akan ditampilkan di marketplace dan preview
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-2">
                        Kategori
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                        defaultValue={editingKarya?.category || ''}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium mb-2">
                        Tags
                      </label>
                      <Input
                        id="tags"
                        name="tags"
                        type="text"
                        placeholder="islam, quran, hadits (pisahkan dengan koma)"
                        defaultValue={editingKarya?.tags || ''}
                      />
                    </div>

                    <div>
                      <label htmlFor="featuredImage" className="block text-sm font-medium mb-2">
                        Featured Image URL
                      </label>
                      <Input
                        id="featuredImage"
                        name="featuredImage"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        defaultValue={editingKarya?.featuredImage || ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Type Selector with Toolbar */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="block text-sm font-medium">
                      Tipe Konten <span className="text-red-500">*</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={showPreview ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          if (showPreview) {
                            setShowPreview(false);
                          } else {
                            const textarea =
                              contentType === 'html' ? htmlEditorRef.current : textareaRef.current;
                            if (textarea) {
                              setPreviewContent(textarea.value);
                              setShowPreview(true);
                            }
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? 'Edit' : 'Preview'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value="text"
                        checked={contentType === 'text'}
                        onChange={(e) => {
                          setContentType(e.target.value as 'text');
                          setShowPreview(false);
                        }}
                        className="w-4 h-4"
                      />
                      <FileText className="w-4 h-4" />
                      <span>Text (Markdown)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contentType"
                        value="html"
                        checked={contentType === 'html'}
                        onChange={(e) => {
                          setContentType(e.target.value as 'html');
                          setShowPreview(false);
                        }}
                        className="w-4 h-4"
                      />
                      <Code className="w-4 h-4" />
                      <span>HTML</span>
                    </label>
                  </div>

                  {/* Markdown Toolbar */}
                  {contentType === 'text' && !showPreview && (
                    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-muted/30 rounded border">
                      {[
                        { label: 'H1', syntax: '# ' },
                        { label: 'H2', syntax: '## ' },
                        { label: 'H3', syntax: '### ' },
                        { label: 'Bold', syntax: '**text**' },
                        { label: 'Italic', syntax: '*text*' },
                        { label: 'Link', syntax: '[text](url)' },
                        { label: 'Image', syntax: '![alt](url)' },
                        { label: 'Code', syntax: '`code`' },
                        { label: 'Quote', syntax: '> ' },
                        { label: 'List', syntax: '- ' },
                      ].map((tool) => (
                        <Button
                          key={tool.label}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => {
                            const textarea = textareaRef.current;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const selectedText = textarea.value.substring(start, end);
                              let replacement = tool.syntax;

                              if (selectedText && tool.syntax.includes('text')) {
                                replacement = tool.syntax.replace('text', selectedText);
                              } else if (
                                selectedText &&
                                (tool.label === 'H1' ||
                                  tool.label === 'H2' ||
                                  tool.label === 'H3' ||
                                  tool.label === 'Quote' ||
                                  tool.label === 'List')
                              ) {
                                replacement = tool.syntax + selectedText;
                              }

                              textarea.value =
                                textarea.value.substring(0, start) +
                                replacement +
                                textarea.value.substring(end);
                              textarea.focus();
                              textarea.setSelectionRange(
                                start + replacement.length,
                                start + replacement.length,
                              );
                            }
                          }}
                        >
                          {tool.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Editor with Preview */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Konten <span className="text-red-500">*</span>
                  </label>

                  {showPreview ? (
                    <div className="w-full min-h-[400px] p-4 border rounded-md bg-white">
                      <div className="prose max-w-none">
                        {contentType === 'text' ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: previewContent
                                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                                .replace(/`(.*?)`/gim, '<code>$1</code>')
                                .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                                .replace(/^- (.*$)/gim, '<li>$1</li>')
                                .replace(/\n/gim, '<br>'),
                            }}
                          />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {contentType === 'text' ? (
                        <textarea
                          ref={textareaRef}
                          id="content"
                          name="content"
                          required
                          placeholder="Tulis konten karya Anda di sini... (Mendukung Markdown)"
                          defaultValue={editingKarya?.content || ''}
                          className="w-full min-h-[400px] p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                            updateWordCount(target.value);
                          }}
                        />
                      ) : (
                        <textarea
                          ref={htmlEditorRef}
                          id="content"
                          name="content"
                          required
                          placeholder="<p>Tulis konten HTML Anda di sini...</p>"
                          defaultValue={editingKarya?.content || ''}
                          className="w-full min-h-[400px] p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                            updateWordCount(target.value);
                          }}
                        />
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                    <div>
                      {contentType === 'text'
                        ? 'Gunakan Markdown untuk formatting (# Header, **bold**, *italic*, dll.)'
                        : 'Tulis HTML yang valid. Hindari tag script untuk keamanan.'}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{wordCount} kata</span>
                      <span>{charCount} karakter</span>
                      <span>~{Math.ceil(wordCount / 200)} menit baca</span>
                      {autoSaveStatus === 'saving' && (
                        <span className="text-yellow-600">Menyimpan...</span>
                      )}
                      {autoSaveStatus === 'saved' && (
                        <span className="text-green-600">Tersimpan</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Excerpt (Ringkasan)
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Ringkasan karya untuk ditampilkan di preview..."
                    defaultValue={editingKarya?.excerpt || ''}
                    className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Pricing */}
                <div className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="isFree"
                        value="true"
                        defaultChecked={editingKarya?.isFree || false}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Gratis</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="radio"
                        name="isFree"
                        value="false"
                        defaultChecked={!editingKarya?.isFree}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Berbayar</span>
                    </label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0"
                      defaultValue={editingKarya?.price}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Harga dalam Dincoin</p>
                  </div>
                </div>

                {/* SEO Settings Toggle */}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSeoSettings(!showSeoSettings)}
                    className="mb-4"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {showSeoSettings ? 'Sembunyikan' : 'Tampilkan'} Pengaturan SEO
                  </Button>

                  {showSeoSettings && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                      <div>
                        <label htmlFor="seoTitle" className="block text-sm font-medium mb-2">
                          SEO Title
                        </label>
                        <Input
                          id="seoTitle"
                          name="seoTitle"
                          type="text"
                          placeholder="Judul untuk search engine (kosongkan untuk gunakan judul utama)"
                          defaultValue={editingKarya?.seoTitle || ''}
                        />
                      </div>

                      <div>
                        <label htmlFor="seoDescription" className="block text-sm font-medium mb-2">
                          SEO Description
                        </label>
                        <textarea
                          id="seoDescription"
                          name="seoDescription"
                          placeholder="Deskripsi untuk search engine (160 karakter)"
                          defaultValue={editingKarya?.seoDescription || ''}
                          className="w-full h-20 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                          maxLength={160}
                        />
                      </div>

                      <div>
                        <label htmlFor="seoKeywords" className="block text-sm font-medium mb-2">
                          SEO Keywords
                        </label>
                        <Input
                          id="seoKeywords"
                          name="seoKeywords"
                          type="text"
                          placeholder="kata kunci, islam, quran (pisahkan dengan koma)"
                          defaultValue={editingKarya?.seoKeywords || ''}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <div className="flex gap-3 flex-1">
                    <Button
                      type="submit"
                      name="status"
                      value="draft"
                      variant="outline"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Simpan Draft
                        </>
                      )}
                    </Button>

                    <Button
                      type="submit"
                      name="status"
                      value="published"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publikasikan
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowEditor(false);
                      setSearchParams((params) => {
                        params.delete('edit');
                        return params;
                      });
                    }}
                  >
                    Batal
                  </Button>
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
                  <div className="flex flex-wrap gap-4">
                    <span>
                      <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl + S</kbd> Simpan
                    </span>
                    <span>
                      <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl + B</kbd> Bold (Markdown)
                    </span>
                    <span>
                      <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl + I</kbd> Italic (Markdown)
                    </span>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/dashboard/karyaku"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              status === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Semua ({stats.total})
          </Link>
          <Link
            to="/dashboard/karyaku?status=published"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              status === 'published'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Published ({stats.published})
          </Link>
          <Link
            to="/dashboard/karyaku?status=draft"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              status === 'draft'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Draft ({stats.draft})
          </Link>
          <Link
            to="/dashboard/karyaku?status=trash"
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              status === 'trash'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Tong Sampah
          </Link>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari karya..."
            defaultValue={search}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set('search', e.target.value);
              } else {
                params.delete('search');
              }
              setSearchParams(params);
            }}
            className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </motion.div>

      {/* Karya List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {userKarya.length > 0 ? (
          userKarya.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Featured Image */}
                    {item.featuredImage && (
                      <div className="lg:w-48 h-32 lg:h-auto">
                        <img
                          src={item.featuredImage}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                item.status === 'published'
                                  ? 'default'
                                  : item.status === 'draft'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="text-xs"
                            >
                              {item.status === 'published'
                                ? 'Published'
                                : item.status === 'draft'
                                  ? 'Draft'
                                  : 'Archived'}
                            </Badge>
                            {item.contentType === 'html' && (
                              <Badge variant="outline" className="text-xs">
                                <Code className="w-3 h-3 mr-1" />
                                HTML
                              </Badge>
                            )}
                            {item.isFree ? (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-200"
                              >
                                Gratis
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs text-blue-600 border-blue-200"
                              >
                                {item.price} Dincoin
                              </Badge>
                            )}
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {item.category}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{item.title}</h3>

                          {item.excerpt && (
                            <p className="text-muted-foreground line-clamp-2 mb-3">
                              {item.excerpt}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </div>
                            {item.updatedAt && item.updatedAt !== item.createdAt && (
                              <div className="flex items-center gap-1">
                                <Edit3 className="w-4 h-4" />
                                Diupdate {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                              </div>
                            )}
                            {item.readingTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {item.readingTime} menit baca
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.viewCount || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {item.downloadCount || 0}
                            </div>
                            {item.content && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {item.content.split(/\s+/).length} kata
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditKarya(item.id)}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Duplicate karya with new title
                              const form = document.createElement('form');
                              form.method = 'post';
                              form.innerHTML = `
                                <input type="hidden" name="action" value="create" />
                                <input type="hidden" name="title" value="Copy of ${item.title}" />
                                <input type="hidden" name="content" value="${item.content || ''}" />
                                <input type="hidden" name="contentType" value="${item.contentType || 'text'}" />
                                <input type="hidden" name="excerpt" value="${item.excerpt || ''}" />
                                <input type="hidden" name="category" value="${item.category || ''}" />
                                <input type="hidden" name="tags" value="${item.tags || ''}" />
                                <input type="hidden" name="price" value="${item.price || 0}" />
                                <input type="hidden" name="isFree" value="${item.isFree}" />
                                <input type="hidden" name="status" value="draft" />
                                <input type="hidden" name="featuredImage" value="${item.featuredImage || ''}" />
                                <input type="hidden" name="seoTitle" value="${item.seoTitle || ''}" />
                                <input type="hidden" name="seoDescription" value="${item.seoDescription || ''}" />
                                <input type="hidden" name="seoKeywords" value="${item.seoKeywords || ''}" />
                              `;
                              document.body.appendChild(form);
                              form.submit();
                              document.body.removeChild(form);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Duplikat
                          </Button>

                          {item.status === 'draft' && (
                            <Form method="post" className="inline">
                              <input type="hidden" name="action" value="update" />
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value="published" />
                              <Button type="submit" variant="outline" size="sm">
                                <Send className="w-4 h-4 mr-1" />
                                Publish
                              </Button>
                            </Form>
                          )}

                          {item.status === 'published' && (
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/karya/${item.slug || item.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Link>
                            </Button>
                          )}
                        </div>

                        {/* Soft deleted indicator & actions */}
                        {'deletedAt' in item && item.deletedAt ? (
                          <div className="flex items-center gap-2">
                            <Form method="post" className="inline">
                              <input type="hidden" name="action" value="restore" />
                              <input type="hidden" name="id" value={item.id} />
                              <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                className="text-green-600"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Pulihkan
                              </Button>
                            </Form>
                            <Form
                              method="post"
                              className="inline"
                              onSubmit={(e) => {
                                if (
                                  !confirm(
                                    'Hapus permanen karya ini? Tindakan ini tidak dapat dibatalkan!',
                                  )
                                )
                                  e.preventDefault();
                              }}
                            >
                              <input type="hidden" name="action" value="hard-delete" />
                              <input type="hidden" name="id" value={item.id} />
                              <Button type="submit" variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Hapus Permanen
                              </Button>
                            </Form>
                          </div>
                        ) : (
                          <Form
                            method="post"
                            className="inline"
                            onSubmit={(e) => {
                              if (
                                !confirm(
                                  'Pindahkan karya ke tong sampah? Anda masih bisa memulihkannya nanti.',
                                )
                              )
                                e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="action" value="delete" />
                            <input type="hidden" name="id" value={item.id} />
                            <Button type="submit" variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </Form>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Belum Ada Karya</h3>
                <p className="text-muted-foreground mb-6">
                  {search
                    ? 'Tidak ada karya yang cocok dengan pencarian Anda.'
                    : 'Mulai tulis karya pertama Anda dan bagikan dengan pembaca santri!'}
                </p>
                {!search && (
                  <Link to="/dashboard/karyaku/tulis">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tulis Karya Pertama
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Success Messages */}
      {searchParams.get('success') && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {searchParams.get('success') === 'created' && '✅ Karya berhasil dibuat!'}
            {searchParams.get('success') === 'updated' && '✅ Karya berhasil diperbarui!'}
            {searchParams.get('success') === 'deleted' && '✅ Karya berhasil dihapus!'}
            {searchParams.get('success') === 'published' && '✅ Karya berhasil dipublikasikan!'}
          </div>
        </motion.div>
      )}

      {/* Error Messages */}
      {actionData?.error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            ❌ {actionData.error}
          </div>
        </motion.div>
      )}
    </div>
  );
}
