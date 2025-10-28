import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
// NOTE: server-only modules (db, session) dynamically imported inside loader/action
import { karya } from '~/db/schema';
import { nanoid } from 'nanoid';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Code,
  Settings,
  Image,
  Tag,
  DollarSign,
  Eye,
  Globe,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Tulis Karya Baru - Dashboard Santri Online' },
    {
      name: 'description',
      content:
        'Tulis dan publikasikan karya baru untuk mendukung dakwah digital santri. Buat artikel, cerpen, puisi, atau konten kreatif lainnya.',
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  await requireUserId(request, context);
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  const action = formData.get('action') as string;

  try {
    const id = nanoid();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const contentType = formData.get('contentType') as 'text' | 'html';
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const featuredImage = formData.get('featuredImage') as string;
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const isFree = formData.get('isFree') === 'true';
    const price = isFree ? 0 : parseInt(formData.get('price') as string) || 0;
    const status = action === 'publish' ? 'published' : 'draft';
    const slug =
      (formData.get('slug') as string) ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      id;

    if (!title || !content) {
      return json({ error: 'Judul dan konten harus diisi' }, { status: 400 });
    }

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const karyaData = {
      id,
      authorId: userId,
      title,
      description: description || excerpt || content.substring(0, 150) + '...',
      content,
      contentType,
      excerpt: excerpt || content.substring(0, 300) + '...',
      category: category || '',
      tags: tags || '',
      featuredImage: featuredImage || '',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || description || excerpt || '',
      seoKeywords: seoKeywords || '',
      price,
      isFree,
      status: status as 'draft' | 'published',
      slug,
      readingTime,
      viewCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: status === 'published' ? new Date() : null,
      fileUrl: '', // Will be set when file upload is implemented
    };

    await db.insert(karya).values(karyaData);

    const message = status === 'published' ? 'published' : 'saved';
    return redirect(`/dashboard/karyaku?success=${message}`);
  } catch (error) {
    console.error('Action error:', error);
    return json({ error: 'Terjadi kesalahan, silakan coba lagi' }, { status: 500 });
  }
}

export default function TulisKaryaPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [contentType, setContentType] = useState<'text' | 'html'>('text');
  const [showSeoSettings, setShowSeoSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = navigation.state === 'submitting';

  // Auto-resize textarea
  useEffect(() => {
    const textarea = contentType === 'html' ? htmlEditorRef.current : textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [contentType, content]);

  // Update word count
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const categories = [
    'Artikel Islami',
    'Syair & Puisi',
    'Kajian Kitab',
    'Pengalaman Spiritual',
    'Tutorial',
    'Cerita Inspiratif',
    'Review Buku',
    'Opini & Analisis',
    'Fiqih Sehari-hari',
    'Sejarah Islam',
    'Motivasi',
    'Pendidikan',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/dashboard/karyaku"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Karya Saya
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Tulis Karya Baru
            </h1>
            <p className="text-muted-foreground mt-2">
              Bagikan pemikiran, ilmu, dan kreativitas Anda kepada para pembaca santri
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Error Messages */}
      {actionData?.error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          ❌ {actionData.error}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {showPreview ? 'Preview Karya' : 'Editor Karya'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {showPreview ? (
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h1 className="text-3xl font-bold mb-4">Preview Judul Karya</h1>
                      <div className="flex items-center gap-2 mb-6">
                        <Badge variant="secondary">Kategori</Badge>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-lg">
                        {contentType === 'html' ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: content || '<p>Konten akan ditampilkan di sini...</p>',
                            }}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {content || 'Konten akan ditampilkan di sini...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form method="post" id="main-form" className="space-y-6">
                    {/* Basic Info */}
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
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Kosongkan untuk generate otomatis dari judul
                        </p>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                          Deskripsi Singkat
                        </label>
                        <Input
                          id="description"
                          name="description"
                          type="text"
                          placeholder="Ringkasan karya dalam 1-2 kalimat..."
                        />
                      </div>
                    </div>

                    {/* Content Type Selector */}
                    <div className="border rounded-lg p-4">
                      <label htmlFor="content-type-text" className="block text-sm font-medium mb-3">
                        Tipe Konten <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label
                          htmlFor="content-type-text"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            id="content-type-text"
                            type="radio"
                            name="contentType"
                            value="text"
                            checked={contentType === 'text'}
                            onChange={(e) => setContentType(e.target.value as 'text')}
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
                            onChange={(e) => setContentType(e.target.value as 'html')}
                            className="w-4 h-4"
                          />
                          <Code className="w-4 h-4" />
                          <span>HTML</span>
                        </label>
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium mb-2">
                        Konten <span className="text-red-500">*</span>
                      </label>
                      {contentType === 'text' ? (
                        <textarea
                          ref={textareaRef}
                          id="content"
                          name="content"
                          required
                          placeholder="Tulis konten karya Anda di sini... (Mendukung Markdown)

Contoh formatting:
# Heading 1
## Heading 2
**bold text**
*italic text*
- List item
1. Numbered list

Tulis dengan hati dan bagikan ilmu yang bermanfaat untuk sesama santri!"
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          className="w-full min-h-[500px] p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      ) : (
                        <textarea
                          ref={htmlEditorRef}
                          id="content"
                          name="content"
                          required
                          placeholder="<p>Tulis konten HTML Anda di sini...</p>
<h2>Contoh Heading</h2>
<p>Paragraf dengan <strong>text tebal</strong> dan <em>text miring</em>.</p>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>"
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                          className="w-full min-h-[500px] p-4 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      )}
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>
                          {contentType === 'text'
                            ? 'Gunakan Markdown untuk formatting (# Header, **bold**, *italic*, dll.)'
                            : 'Tulis HTML yang valid. Hindari tag script untuk keamanan.'}
                        </span>
                        <span>
                          {wordCount} kata • {Math.ceil(wordCount / 200)} menit baca
                        </span>
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
                        className="w-full h-24 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Kosongkan untuk generate otomatis dari konten
                      </p>
                    </div>

                    {/* Hidden fields for sidebar data */}
                    <input type="hidden" name="category" id="hidden-category" />
                    <input type="hidden" name="tags" id="hidden-tags" />
                    <input type="hidden" name="featuredImage" id="hidden-featuredImage" />
                    <input type="hidden" name="seoTitle" id="hidden-seoTitle" />
                    <input type="hidden" name="seoDescription" id="hidden-seoDescription" />
                    <input type="hidden" name="seoKeywords" id="hidden-seoKeywords" />
                    <input type="hidden" name="isFree" id="hidden-isFree" value="true" />
                    <input type="hidden" name="price" id="hidden-price" value="0" />

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                      <div className="flex gap-3 flex-1">
                        <Button
                          type="submit"
                          name="action"
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
                          name="action"
                          value="publish"
                          disabled={isSubmitting}
                          className="flex-1 sm:flex-none"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Publikasikan
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5" />
                  Pengaturan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                      Kategori
                    </label>
                    <select
                      id="category"
                      onChange={(e) => {
                        const hiddenField = document.getElementById(
                          'hidden-category',
                        ) as HTMLInputElement;
                        if (hiddenField) hiddenField.value = e.target.value;
                      }}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tags
                    </label>
                    <Input
                      id="tags"
                      type="text"
                      placeholder="islam, quran, hadits"
                      onChange={(e) => {
                        const hiddenField = document.getElementById(
                          'hidden-tags',
                        ) as HTMLInputElement;
                        if (hiddenField) hiddenField.value = e.target.value;
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Pisahkan dengan koma</p>
                  </div>

                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium mb-2">
                      <Image className="w-4 h-4 inline mr-1" />
                      Featured Image
                    </label>
                    <Input
                      id="featuredImage"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      onChange={(e) => {
                        const hiddenField = document.getElementById(
                          'hidden-featuredImage',
                        ) as HTMLInputElement;
                        if (hiddenField) hiddenField.value = e.target.value;
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5" />
                  Harga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="pricing-free"
                      className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-muted/20"
                    >
                      <input
                        id="pricing-free"
                        type="radio"
                        name="pricing"
                        value="true"
                        defaultChecked
                        onChange={(e) => {
                          const hiddenFree = document.getElementById(
                            'hidden-isFree',
                          ) as HTMLInputElement;
                          const hiddenPrice = document.getElementById(
                            'hidden-price',
                          ) as HTMLInputElement;
                          if (hiddenFree) hiddenFree.value = 'true';
                          if (hiddenPrice) hiddenPrice.value = '0';
                        }}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">Gratis</div>
                        <div className="text-sm text-muted-foreground">
                          Bagikan ilmu secara cuma-cuma
                        </div>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="pricing-free"
                      className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-muted/20"
                    >
                      <input
                        type="radio"
                        name="pricing"
                        value="false"
                        onChange={(e) => {
                          const hiddenFree = document.getElementById(
                            'hidden-isFree',
                          ) as HTMLInputElement;
                          if (hiddenFree) hiddenFree.value = 'false';
                        }}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Berbayar</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Dapatkan Dincoin dari karya Anda
                        </div>
                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          onChange={(e) => {
                            const hiddenPrice = document.getElementById(
                              'hidden-price',
                            ) as HTMLInputElement;
                            if (hiddenPrice) hiddenPrice.value = e.target.value;
                          }}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Harga dalam Dincoin</p>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SEO Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    SEO
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSeoSettings(!showSeoSettings)}
                  >
                    {showSeoSettings ? 'Sembunyikan' : 'Tampilkan'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showSeoSettings && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="seoTitle" className="block text-sm font-medium mb-2">
                        SEO Title
                      </label>
                      <Input
                        id="seoTitle"
                        type="text"
                        placeholder="Kosongkan untuk gunakan judul utama"
                        onChange={(e) => {
                          const hiddenField = document.getElementById(
                            'hidden-seoTitle',
                          ) as HTMLInputElement;
                          if (hiddenField) hiddenField.value = e.target.value;
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="seoDescription" className="block text-sm font-medium mb-2">
                        SEO Description
                      </label>
                      <textarea
                        id="seoDescription"
                        placeholder="Deskripsi untuk search engine"
                        className="w-full h-20 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        maxLength={160}
                        onChange={(e) => {
                          const hiddenField = document.getElementById(
                            'hidden-seoDescription',
                          ) as HTMLInputElement;
                          if (hiddenField) hiddenField.value = e.target.value;
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Maksimal 160 karakter</p>
                    </div>

                    <div>
                      <label htmlFor="seoKeywords" className="block text-sm font-medium mb-2">
                        SEO Keywords
                      </label>
                      <Input
                        id="seoKeywords"
                        type="text"
                        placeholder="kata kunci, islam, quran"
                        onChange={(e) => {
                          const hiddenField = document.getElementById(
                            'hidden-seoKeywords',
                          ) as HTMLInputElement;
                          if (hiddenField) hiddenField.value = e.target.value;
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Tips Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">💡 Tips Menulis</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 text-sm space-y-2">
                <p>• Mulai dengan pembukaan yang menarik</p>
                <p>• Gunakan heading untuk struktur yang jelas</p>
                <p>• Sertakan dalil atau referensi yang valid</p>
                <p>• Tulis dengan bahasa yang mudah dipahami</p>
                <p>• Proofread sebelum publikasi</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
