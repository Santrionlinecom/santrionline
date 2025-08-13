import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';
// NOTE: server-only session helper dynamically imported inside loader/action
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ArrowLeft, Send, FileText, Hash } from 'lucide-react';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Buat Postingan - Komunitas Santri Online' },
    { name: 'description', content: 'Berbagi ilmu dan pengalaman dengan komunitas santri' },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  await requireUserId(request, context);
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  await requireUserId(request, context);

  const formData = await request.formData();
  const title = formData.get('title')?.toString();
  const content = formData.get('content')?.toString();
  const category = formData.get('category')?.toString();

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

  if (!category) {
    return json(
      {
        success: false,
        error: 'Kategori harus dipilih',
      },
      { status: 400 },
    );
  }

  // Forward to API
  const apiFormData = new FormData();
  apiFormData.append('title', title.trim());
  apiFormData.append('content', content.trim());
  apiFormData.append('category', category);

  try {
    const response = await fetch(`${new URL(request.url).origin}/api/community/posts`, {
      method: 'POST',
      body: apiFormData,
      headers: {
        Cookie: request.headers.get('Cookie') || '',
      },
    });

    const result = (await response.json()) as { success: boolean; error?: string };

    if (result.success) {
      return redirect('/komunitas?success=Postingan berhasil dibuat!');
    } else {
      return json(
        {
          success: false,
          error: result.error || 'Terjadi kesalahan saat membuat postingan',
        },
        { status: 400 },
      );
    }
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

const categories = [
  { value: 'hafalan', label: 'Hafalan', description: 'Tips dan pengalaman menghafal Al-Quran' },
  { value: 'kajian', label: 'Kajian', description: 'Diskusi kajian kitab dan ilmu agama' },
  {
    value: 'pengalaman',
    label: 'Pengalaman',
    description: 'Berbagi pengalaman spiritual dan ibadah',
  },
  {
    value: 'tanya-jawab',
    label: 'Tanya Jawab',
    description: 'Bertanya dan menjawab masalah keagamaan',
  },
  { value: 'teknologi', label: 'Teknologi', description: 'Teknologi dalam pendidikan Islam' },
  { value: 'umum', label: 'Umum', description: 'Topik umum seputar kehidupan santri' },
];

export default function BuatPostPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [content, setContent] = useState('');
  const isSubmitting = navigation.state === 'submitting';

  const selectedCategoryInfo = categories.find((c) => c.value === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/komunitas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Komunitas
            </Link>
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Buat Postingan Baru</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berbagi ilmu, pengalaman, atau ajukan pertanyaan kepada komunitas santri
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Tulis Postingan Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              {/* Error Alert */}
              {actionData?.error && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">{actionData.error}</p>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Judul Postingan *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Masukkan judul yang menarik dan deskriptif..."
                  required
                  className="text-lg py-3"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Judul yang baik akan menarik perhatian dan menjelaskan topik dengan jelas
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">
                  Kategori *
                </Label>
                <Select name="category-select" onValueChange={setSelectedCategory}>
                  <SelectTrigger className="text-base py-3">
                    <SelectValue placeholder="Pilih kategori yang sesuai..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input for form submission */}
                <input type="hidden" name="category" value={selectedCategory} required />
                {selectedCategoryInfo && (
                  <p className="text-sm text-muted-foreground">
                    📂 <strong>{selectedCategoryInfo.label}:</strong>{' '}
                    {selectedCategoryInfo.description}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-medium">
                  Konten Postingan *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Tulis konten postingan Anda di sini...

Beberapa tips untuk postingan yang baik:
- Gunakan bahasa yang sopan dan santun
- Sertakan dalil atau referensi jika membahas masalah agama  
- Berbagi pengalaman pribadi yang bermanfaat
- Ajukan pertanyaan yang jelas dan spesifik
- Hormati perbedaan pendapat dalam diskusi"
                  required
                  rows={12}
                  className="text-base resize-none"
                  disabled={isSubmitting}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {content.length} karakter • {Math.max(0, Math.ceil(content.length / 5))} kata
                  </span>
                  <span className={content.length < 10 ? 'text-red-500' : 'text-green-600'}>
                    {content.length < 10
                      ? `Minimal ${10 - content.length} karakter lagi`
                      : 'Panjang teks sudah cukup'}
                  </span>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">📝 Panduan Posting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pastikan konten sesuai dengan nilai-nilai Islam</li>
                  <li>• Hindari konten yang mengandung SARA atau menyinggung</li>
                  <li>• Gunakan bahasa Indonesia yang baik dan benar</li>
                  <li>• Sertakan sumber atau referensi jika membahas hadits/ayat</li>
                  <li>• Posting akan direview sebelum dipublikasikan</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || content.length < 10 || !selectedCategory}
                  className="flex-1 py-3"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menerbitkan...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Terbitkan Postingan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-3"
                  size="lg"
                  asChild
                  disabled={isSubmitting}
                >
                  <Link to="/komunitas">Batal</Link>
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold mb-2">💡 Butuh Inspirasi?</h3>
            <p className="text-muted-foreground mb-4">
              Lihat postingan populer lainnya atau baca panduan komunitas untuk mendapatkan ide
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to="/komunitas">Lihat Postingan Lain</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/panduan-komunitas">Panduan Komunitas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
