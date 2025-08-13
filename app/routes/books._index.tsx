import type { MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { HeroBanner, type HeroBannerProps } from '~/components/HeroBanner';
import { CategoryChips, type CategoryChip } from '~/components/CategoryChips';
import { ContentSection } from '~/components/ContentSection';
import { type Book } from '~/components/BookCard';
import { Button } from '~/components/ui/button';

// SEO Meta
export const meta: MetaFunction = () => {
  const title = 'Jodoh Preloved – Platform Jual Beli Buku Bekas Terpercaya';
  const description =
    'Temukan ribuan buku bekas berkualitas dengan harga terjangkau. Jual beli buku mudah dan aman di Jodoh Preloved.';
  const url = 'https://jodohpreloved.com';
  const image = `${url}/og-image.jpg`;

  return [
    { title },
    { name: 'description', content: description },
    {
      name: 'keywords',
      content: 'jual beli buku bekas, buku second, toko buku online, buku murah, preloved books',
    },
    { name: 'author', content: 'Jodoh Preloved' },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
};

// Loader function to fetch home page data
export async function loader() {
  // Mock data - in production, this would fetch from your database/API
  const categories: CategoryChip[] = [
    { id: '1', label: 'Chicklit', href: '/kategori/chicklit', isActive: true },
    { id: '2', label: 'Desain', href: '/kategori/desain' },
    { id: '3', label: 'Diary', href: '/kategori/diary' },
    { id: '4', label: 'Drama', href: '/kategori/drama' },
    { id: '5', label: 'Fantasy', href: '/kategori/fantasy' },
    { id: '6', label: 'History', href: '/kategori/history' },
    { id: '7', label: 'Horror', href: '/kategori/horror' },
    { id: '8', label: 'Romance', href: '/kategori/romance' },
    { id: '9', label: 'Sci-Fi', href: '/kategori/sci-fi' },
    { id: '10', label: 'Thriller', href: '/kategori/thriller' },
  ];

  const sampleBooks: Book[] = [
    {
      id: '1',
      title: 'Sunset Bersama Rosie',
      author: 'Tere Liye',
      coverUrl:
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&q=80',
      rating: 4.9,
    },
    {
      id: '2',
      title: 'Dilan 1990',
      author: 'Pidi Baiq',
      coverUrl:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop&q=80',
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      coverUrl:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop&q=80',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Negeri 5 Menara',
      author: 'Ahmad Fuadi',
      coverUrl:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop&q=80',
      rating: 4.9,
    },
    {
      id: '5',
      title: 'Ayat-Ayat Cinta',
      author: 'Habiburrahman El Shirazy',
      coverUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop&q=80',
      rating: 4.6,
    },
    {
      id: '6',
      title: 'Perahu Kertas',
      author: 'Dee Lestari',
      coverUrl:
        'https://images.unsplash.com/photo-1535905557558-afc4877cdf3f?w=300&h=450&fit=crop&q=80',
      rating: 4.8,
    },
    {
      id: '7',
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      coverUrl:
        'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=450&fit=crop&q=80',
      rating: 4.9,
    },
    {
      id: '8',
      title: 'Tentang Kamu',
      author: 'Tere Liye',
      coverUrl:
        'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=450&fit=crop&q=80',
      rating: 4.7,
    },
  ];

  const sections = [
    {
      id: 'best-seller',
      title: 'Today Best Seller',
      ctaHref: '/best-seller',
      books: sampleBooks.slice(0, 6),
    },
    {
      id: 'kli-11-stories',
      title: 'Best Selling KLI 11 Stories',
      ctaHref: '/kli-11-stories',
      books: sampleBooks.slice(2, 8),
    },
    {
      id: 'swc-kli-11-stories',
      title: 'Best Selling SWC KLI 11 Stories',
      ctaHref: '/swc-kli-11-stories',
      books: sampleBooks.slice(1, 7),
    },
    {
      id: 'swc-kli-9-stories',
      title: 'Best Selling SWC KLI 9 Stories',
      ctaHref: '/swc-kli-9-stories',
      books: sampleBooks.slice(3, 8),
    },
  ];

  const heroBanner: HeroBannerProps = {
    title: 'Jodoh Preloved',
    subtitle:
      'Temukan buku impian Anda dengan harga terjangkau. Ribuan koleksi buku bekas berkualitas menanti Anda.',
    ctaText: 'Download Aplikasi Sekarang',
    ctaHref: '/download',
    badgeText: '🔥 Platform Terpercaya',
    imageSrc:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&q=80',
    imageAlt: 'Koleksi buku-buku terbaik',
  };

  return json({
    categories,
    sections,
    heroBanner,
  });
}

export default function BookHomePage() {
  const { categories, sections, heroBanner } = useLoaderData<typeof loader>();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Banner */}
      <HeroBanner {...heroBanner} />

      {/* Category Chips */}
      <CategoryChips categories={categories} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <ContentSection
              key={section.id}
              id={section.id}
              title={section.title}
              ctaHref={section.ctaHref}
              books={section.books}
              variant="row"
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-3"
          >
            Lihat lebih banyak
          </Button>
        </div>
      </div>

      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OnlineStore',
            name: 'Jodoh Preloved',
            description:
              'Platform jual beli buku bekas terpercaya dengan ribuan koleksi berkualitas.',
            url: 'https://jodohpreloved.com',
            sameAs: [
              'https://www.facebook.com/jodohpreloved',
              'https://www.instagram.com/jodohpreloved',
            ],
            offers: {
              '@type': 'AggregateOffer',
              offerCount: '10000',
              lowPrice: '5000',
              highPrice: '500000',
              priceCurrency: 'IDR',
            },
          }),
        }}
      />
    </div>
  );
}
