import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
// server-only db import moved to dynamic import in loader
import { karya, user } from '~/db/schema';
import { eq, and } from 'drizzle-orm';
import { 
  ArrowLeft,
  Clock,
  Eye,
  Download,
  Heart,
  Share2,
  Calendar,
  Tag,
  DollarSign,
  BookOpen,
  User,
  Globe
} from "lucide-react";
import { formatDate, formatRelativeTime, formatDincoin } from '~/lib/utils';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.karya) {
    return [
      { title: "Karya Tidak Ditemukan - Santri Online" },
      { name: "description", content: "Karya yang Anda cari tidak ditemukan." },
    ];
  }

  const { karya } = data;
  return [
    { title: `${karya.seoTitle || karya.title} - Santri Online` },
    { name: "description", content: karya.seoDescription || karya.description || karya.excerpt },
    { name: "keywords", content: karya.seoKeywords || karya.tags },
    { property: "og:title", content: karya.seoTitle || karya.title },
    { property: "og:description", content: karya.seoDescription || karya.description || karya.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:image", content: karya.featuredImage || "/logo-light.png" },
    { property: "article:author", content: karya.authorName },
    { property: "article:published_time", content: karya.publishedAt ? new Date(karya.publishedAt).toISOString() : undefined },
    { property: "article:modified_time", content: karya.updatedAt ? new Date(karya.updatedAt).toISOString() : undefined },
    { property: "article:tag", content: karya.tags },
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const { getDb } = await import('~/db/drizzle.server');
  const db = getDb(context);
  
  // Try to find by slug first, then by ID
  let karyaData = await db
    .select({
      id: karya.id,
      title: karya.title,
      description: karya.description,
      content: karya.content,
      excerpt: karya.excerpt,
      category: karya.category,
      tags: karya.tags,
      price: karya.price,
      isFree: karya.isFree,
      featuredImage: karya.featuredImage,
      viewCount: karya.viewCount,
      downloadCount: karya.downloadCount,
      readingTime: karya.readingTime,
      contentType: karya.contentType,
      slug: karya.slug,
      seoTitle: karya.seoTitle,
      seoDescription: karya.seoDescription,
      seoKeywords: karya.seoKeywords,
      status: karya.status,
      publishedAt: karya.publishedAt,
      createdAt: karya.createdAt,
      updatedAt: karya.updatedAt,
      authorId: karya.authorId,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
    })
    .from(karya)
    .leftJoin(user, eq(karya.authorId, user.id))
    .where(and(
      eq(karya.slug, slug),
      eq(karya.status, 'published')
    ))
    .limit(1);

  // If not found by slug, try by ID (for backward compatibility)
  if (karyaData.length === 0) {
    karyaData = await db
      .select({
        id: karya.id,
        title: karya.title,
        description: karya.description,
        content: karya.content,
        excerpt: karya.excerpt,
        category: karya.category,
        tags: karya.tags,
        price: karya.price,
        isFree: karya.isFree,
        featuredImage: karya.featuredImage,
        viewCount: karya.viewCount,
        downloadCount: karya.downloadCount,
        readingTime: karya.readingTime,
        contentType: karya.contentType,
        slug: karya.slug,
        seoTitle: karya.seoTitle,
        seoDescription: karya.seoDescription,
        seoKeywords: karya.seoKeywords,
        status: karya.status,
        publishedAt: karya.publishedAt,
        createdAt: karya.createdAt,
        updatedAt: karya.updatedAt,
        authorId: karya.authorId,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
      })
      .from(karya)
      .leftJoin(user, eq(karya.authorId, user.id))
      .where(and(
        eq(karya.id, slug),
        eq(karya.status, 'published')
      ))
      .limit(1);
  }

  if (karyaData.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  const karyaItem = karyaData[0];
  
  // Increment view count
  await db.update(karya).set({ 
    viewCount: (karyaItem.viewCount || 0) + 1 
  }).where(eq(karya.id, karyaItem.id));

  return json({ 
    karya: {
      ...karyaItem,
      viewCount: (karyaItem.viewCount || 0) + 1
    }
  });
}

export default function KaryaDetailPage() {
  const { karya } = useLoaderData<typeof loader>();

  const tags = karya.tags ? karya.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/komunitas">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Komunitas
                </Link>
              </Button>
            </div>

            <div className="max-w-4xl">
              {/* Category & Status */}
              <div className="flex items-center gap-2 mb-4">
                {karya.category && (
                  <Badge variant="outline" className="mb-2">
                    <Tag className="w-3 h-3 mr-1" />
                    {karya.category}
                  </Badge>
                )}
                <Badge variant="default">
                  <Globe className="w-3 h-3 mr-1" />
                  Published
                </Badge>
                {karya.isFree ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Gratis
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatDincoin(karya.price)}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {karya.title}
              </h1>

              {karya.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {karya.excerpt}
                </p>
              )}

              {/* Author & Meta Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={karya.authorAvatar || `https://placehold.co/48x48/10b981/ffffff?text=${karya.authorName?.charAt(0) || 'U'}`} />
                    <AvatarFallback>{karya.authorName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{karya.authorName}</div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(karya.publishedAt || karya.createdAt)}
                  </div>
                  {karya.readingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {karya.readingTime} menit baca
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {karya.viewCount || 0} views
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {karya.featuredImage && (
                <div className="mb-8">
                  <img 
                    src={karya.featuredImage} 
                    alt={karya.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className={`prose prose-lg max-w-none ${
                    karya.contentType === 'html' ? '' : 'whitespace-pre-wrap'
                  }`}>
                    {karya.contentType === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: karya.content || '' }} />
                    ) : (
                      <div className="space-y-4">
                        {(karya.content || '').split('\n\n').map((paragraph, index) => (
                          <p key={index} className="leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tags & Actions */}
      <section className="py-8 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Tags */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {karya.viewCount || 0} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {karya.downloadCount || 0} downloads
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Suka
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan
                  </Button>
                  {!karya.isFree && (
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download ({formatDincoin(karya.price)})
                    </Button>
                  )}
                  {karya.isFree && (
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Gratis
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Author Info */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Tentang Penulis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={karya.authorAvatar || `https://placehold.co/64x64/10b981/ffffff?text=${karya.authorName?.charAt(0) || 'U'}`} />
                      <AvatarFallback className="text-lg">{karya.authorName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{karya.authorName}</h3>
                      <p className="text-muted-foreground mb-4">
                        Santri aktif yang gemar berbagi ilmu dan pengalaman melalui tulisan.
                        Bergabung dengan komunitas Santri Online untuk menginspirasi sesama.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/${karya.authorId}`}>
                          Lihat Profil
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
