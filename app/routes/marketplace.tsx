import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link, useRevalidator } from '@remix-run/react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
// server-only db import moved to dynamic import in loader
import { karya, user } from '~/db/schema';
import { eq, desc, isNull, and } from 'drizzle-orm';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Download,
  Eye,
  TrendingUp,
  Palette,
  Music,
  BookOpen,
  Camera,
  Code,
  Video,
  Crown,
  Coins,
  Clock,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Marketplace - Santri Online' },
    {
      name: 'description',
      content:
        'Temukan dan beli karya-karya kreatif dari para santri. Kaligrafi, nasyid, tulisan, dan banyak lagi.',
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const { getDb } = await import('~/db/drizzle.server');
    const { ensureMigrated } = await import('~/db/autoMigrate.server');
    const db = getDb(context);
    await ensureMigrated(context);

    // Only get published & non-deleted karya (omit heavy content field to reduce payload)
    const allKarya = await db
      .select({
        id: karya.id,
        title: karya.title,
        description: karya.description,
        excerpt: karya.excerpt,
        category: karya.category,
        tags: karya.tags,
        price: karya.price,
        isFree: karya.isFree,
        featuredImage: karya.featuredImage,
        viewCount: karya.viewCount,
        downloadCount: karya.downloadCount,
        readingTime: karya.readingTime,
        createdAt: karya.createdAt,
        publishedAt: karya.publishedAt,
        slug: karya.slug,
        authorName: user.name,
        authorId: user.id,
      })
      .from(karya)
      .leftJoin(user, eq(karya.authorId, user.id))
      .where(and(eq(karya.status, 'published'), isNull(karya.deletedAt)))
      .orderBy(desc(karya.publishedAt))
      .limit(50);

    const stats = {
      totalKarya: allKarya.length,
      totalCreators: new Set(allKarya.map((k) => k.authorId)).size,
      totalViews: allKarya.reduce((sum, k) => sum + (k.viewCount || 0), 0),
      totalDownloads: allKarya.reduce((sum, k) => sum + (k.downloadCount || 0), 0),
    };

    return json({ allKarya, stats });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Marketplace loader error:', error?.message, error?.stack);
    // Return safe empty payload so UI can render (avoid 500 so we can see client errors)
    return json(
      {
        allKarya: [],
        stats: { totalKarya: 0, totalCreators: 0, totalViews: 0, totalDownloads: 0 },
        error: 'failed_to_load',
      },
      { status: 200 },
    );
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
      type: 'spring',
      stiffness: 100,
    } as const,
  },
};

export default function MarketplacePage() {
  const { allKarya, stats } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [liveKarya, setLiveKarya] = React.useState(allKarya);
  const lastRef = React.useRef<number>(Date.now());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [sortBy, setSortBy] = React.useState('newest');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Count categories
  const categoryCounts = liveKarya.reduce(
    (acc, item) => {
      const cat = item.category || 'Lainnya';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categories = [
    {
      name: 'Artikel Islami',
      icon: BookOpen,
      count: categoryCounts['Artikel Islami'] || 0,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Syair & Puisi',
      icon: Music,
      count: categoryCounts['Syair & Puisi'] || 0,
      color: 'bg-green-100 text-green-800',
    },
    {
      name: 'Kajian Kitab',
      icon: BookOpen,
      count: categoryCounts['Kajian Kitab'] || 0,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Tutorial',
      icon: Video,
      count: categoryCounts['Tutorial'] || 0,
      color: 'bg-red-100 text-red-800',
    },
    {
      name: 'Cerita Inspiratif',
      icon: Camera,
      count: categoryCounts['Cerita Inspiratif'] || 0,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: 'Lainnya',
      icon: Code,
      count: categoryCounts['Lainnya'] || 0,
      color: 'bg-indigo-100 text-indigo-800',
    },
  ];

  const marketplaceStats = [
    {
      icon: Palette,
      label: 'Karya Tersedia',
      value: stats.totalKarya.toString(),
      color: 'text-blue-600',
    },
    {
      icon: Crown,
      label: 'Creator Aktif',
      value: stats.totalCreators.toString(),
      color: 'text-yellow-600',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: stats.totalViews.toString(),
      color: 'text-green-600',
    },
    {
      icon: Download,
      label: 'Downloads',
      value: stats.totalDownloads.toString(),
      color: 'text-purple-600',
    },
  ];

  // Display products from database
  const filteredKarya = liveKarya.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort filtered results
  const sortedKarya = [...filteredKarya].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
        );
      case 'oldest':
        return (
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
        );
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedKarya.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKarya = sortedKarya.slice(startIndex, startIndex + itemsPerPage);

  const displayProducts = paginatedKarya.map((item) => ({
    ...item,
    rating: '5.0', // Default rating
    sales: item.downloadCount || 0,
    category: item.category || 'Umum',
    authorAvatar: '',
    views: item.viewCount || 0,
    likes: Math.floor(Math.random() * 20), // Random likes for demo
  }));

  // Real-time polling with auto-revalidation
  React.useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch(`/api/karya-events?since=${lastRef.current}`);
        if (!res.ok) return;
        const data = (await res.json()) as { events: Array<Record<string, unknown>> };
        if (cancelled) return;
        if (data.events?.length) {
          lastRef.current = Date.now();
          // Check if any events affect marketplace (published/deleted/restored)
          const relevantEvents = data.events.filter((e: Record<string, unknown>) =>
            ['created', 'status_changed', 'deleted', 'restored', 'hard_deleted'].includes(
              e.type as string,
            ),
          );
          if (relevantEvents.length > 0) {
            // Trigger Remix revalidation to refresh loader data
            revalidator.revalidate();
          }
        }
      } catch (error) {
        console.log('Poll error:', error);
      }
    }
    const id = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [revalidator]);

  // Update live data when loader revalidates
  React.useEffect(() => {
    setLiveKarya(allKarya);
  }, [allKarya]);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary/10 via-blue-50 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Marketplace{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Santri
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Temukan karya-karya kreatif dari para santri Indonesia. Dukung talenta lokal dengan
              berkarya dan berkreasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Search className="w-5 h-5 mr-2" />
                Jelajahi Karya
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <Palette className="w-5 h-5 mr-2" />
                Jual Karyamu
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-12 border-b"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {marketplaceStats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={itemVariants}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="space-y-6">
            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cari Karya</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Cari karya..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <select
                      className="flex-1 px-3 py-2 text-sm border border-input bg-background rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="popular">Terpopuler</option>
                      <option value="price-high">Harga Tertinggi</option>
                      <option value="price-low">Harga Terendah</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kategori</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary/10 border border-primary/20'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category.name ? '' : category.name)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCategory(
                            selectedCategory === category.name ? '' : category.name,
                          );
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Filter by ${category.name} category`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className={category.color}>
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Price Range */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rentang Harga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>0 - 50 Dincoin</span>
                      <span className="text-muted-foreground">0 karya</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>51 - 100 Dincoin</span>
                      <span className="text-muted-foreground">0 karya</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>101+ Dincoin</span>
                      <span className="text-muted-foreground">0 karya</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Products */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Karya Unggulan</h2>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Lihat Trending
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {displayProducts.slice(0, 4).map((item) => {
                  const product = {
                    id: item.id,
                    title: item.title,
                    author: item.authorName || 'Unknown',
                    avatar: item.authorAvatar || '',
                    category: item.category || 'Umum',
                    rating: '5.0',
                    sales: item.downloadCount || 0,
                    price: item.isFree ? 0 : item.price,
                    badge: 'Featured',
                  };

                  return (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="absolute top-4 right-4 z-10">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            {product.badge}
                          </Badge>
                        </div>

                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Palette className="w-16 h-16 text-primary/60" />
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={product.avatar} />
                              <AvatarFallback>{product.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{product.author}</div>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold mb-2">{product.title}</h3>

                          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{product.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="w-4 h-4" />
                              <span>{product.sales} terjual</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coins className="w-5 h-5 text-yellow-600" />
                              <span className="text-2xl font-bold text-primary">
                                {product.price}
                              </span>
                              <span className="text-sm text-muted-foreground">Dincoin</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="sm">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Beli
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* All Products */}
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Semua Karya</h2>
                <div className="flex gap-2 items-center">
                  {(searchTerm || selectedCategory) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                    >
                      Bersihkan Filter
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Badge variant="secondary">Terbaru</Badge>
                    <Badge variant="outline">Terpopuler</Badge>
                    <Badge variant="outline">Termurah</Badge>
                  </div>
                </div>
              </div>

              {/* Results counter */}
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, sortedKarya.length)} dari {sortedKarya.length}{' '}
                karya
                {sortedKarya.length !== allKarya.length &&
                  ` (difilter dari ${allKarya.length} total)`}
                {searchTerm && ` untuk "${searchTerm}"`}
                {selectedCategory && ` dalam kategori "${selectedCategory}"`}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <Link to={`/karya/${item.slug || item.id}`} className="block">
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                          {item.featuredImage ? (
                            <img
                              src={item.featuredImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Palette className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge variant="outline" className="bg-white/90">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="bg-white/90">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={''} />
                            <AvatarFallback>{item.authorName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{item.authorName}</span>
                        </div>

                        <Link to={`/karya/${item.slug || item.id}`}>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {item.excerpt || item.description}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{item.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{item.likes}</span>
                          </div>
                          {item.readingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.readingTime}m</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1">
                            {item.isFree ? (
                              <span className="text-lg font-bold text-green-600">GRATIS</span>
                            ) : (
                              <>
                                <Coins className="w-4 h-4 text-yellow-600" />
                                <span className="text-xl font-bold text-primary">{item.price}</span>
                                <span className="text-xs text-muted-foreground">Dincoin</span>
                              </>
                            )}
                          </div>
                          <Link to={`/karya/${item.slug || item.id}`}>
                            <Button size="sm" className="group-hover:shadow-md transition-shadow">
                              {item.isFree ? (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Beli
                                </>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {displayProducts.length === 0 && allKarya.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Tidak Ada Hasil</h3>
                      <p className="text-muted-foreground mb-6">
                        Tidak ditemukan karya yang sesuai dengan pencarian Anda.
                        {searchTerm && ` Coba kata kunci lain selain "${searchTerm}".`}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('');
                        }}
                      >
                        Bersihkan Filter
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {displayProducts.length === 0 && allKarya.length === 0 && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Belum Ada Karya</h3>
                      <p className="text-muted-foreground mb-6">
                        Jadilah yang pertama membuat karya di marketplace ini!
                      </p>
                      <Button>
                        <Palette className="w-4 h-4 mr-2" />
                        Upload Karya Pertama
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {displayProducts.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}

              {displayProducts.length > 0 && totalPages <= 1 && (
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    Lihat Lebih Banyak Karya
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
