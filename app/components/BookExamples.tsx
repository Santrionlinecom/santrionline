import { HeroBanner, type HeroBannerProps } from './HeroBanner';
import { CategoryChips, type CategoryChip } from './CategoryChips';
import { BookCard, BookGrid, BookRow, type Book } from './BookCard';
import { ContentSection } from './ContentSection';

// Example data for demonstration
const exampleHeroBanner: HeroBannerProps = {
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

const exampleCategories: CategoryChip[] = [
  { id: '1', label: 'Chicklit', href: '/kategori/chicklit', isActive: true },
  { id: '2', label: 'Desain', href: '/kategori/desain' },
  { id: '3', label: 'Diary', href: '/kategori/diary' },
  { id: '4', label: 'Drama', href: '/kategori/drama' },
  { id: '5', label: 'Fantasy', href: '/kategori/fantasy' },
  { id: '6', label: 'History', href: '/kategori/history' },
  { id: '7', label: 'Horror', href: '/kategori/horror' },
  { id: '8', label: 'Romance', href: '/kategori/romance' },
];

const exampleBooks: Book[] = [
  {
    id: '1',
    title: 'Sunset Bersama Rosie',
    author: 'Tere Liye',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&q=80',
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
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop&q=80',
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
];

/**
 * Example usage of all book marketplace components
 * Copy-paste these examples into your pages as needed
 */
export function ExampleUsage() {
  return (
    <div className="bg-white">
      {/* Hero Banner Example */}
      <HeroBanner {...exampleHeroBanner} />

      {/* Category Chips Example */}
      <CategoryChips categories={exampleCategories} />

      {/* Content Section with Row Layout (Mobile-friendly) */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <ContentSection
          id="best-seller"
          title="Today Best Seller"
          ctaHref="/best-seller"
          books={exampleBooks}
          variant="row"
        />

        {/* Content Section with Grid Layout */}
        <ContentSection
          id="trending"
          title="Trending Books"
          ctaHref="/trending"
          books={exampleBooks}
          variant="grid"
          className="mt-8"
        />
      </div>

      {/* Individual Components Examples */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-bold mb-4">Individual Components</h2>

        {/* Single Book Card */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Single BookCard</h3>
          <BookCard book={exampleBooks[0]} />
        </div>

        {/* Book Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">BookGrid (Responsive)</h3>
          <BookGrid books={exampleBooks} />
        </div>

        {/* Book Row (Horizontal Scroll) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">BookRow (Horizontal Scroll)</h3>
          <BookRow books={exampleBooks} />
        </div>

        {/* Loading States */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Loading States</h3>
          <BookGrid books={[]} isLoading={true} />
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal example for quick implementation
 */
export function MinimalBookPage() {
  return (
    <div className="bg-white">
      <HeroBanner {...exampleHeroBanner} />
      <CategoryChips categories={exampleCategories} />

      <div className="container mx-auto px-4 py-6 space-y-8">
        <ContentSection
          id="featured"
          title="Featured Books"
          ctaHref="/featured"
          books={exampleBooks}
          variant="row"
        />
      </div>
    </div>
  );
}

/**
 * Custom styling example
 */
export function CustomStyledExample() {
  const customBooks = exampleBooks.map((book) => ({
    ...book,
    href: `/custom-books/${book.id}`, // Custom routing
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Custom hero with different colors */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Custom Book Store</h1>
          <p className="text-center text-gray-600 mb-8">Your custom implementation</p>
        </div>
      </section>

      {/* Custom category styling */}
      <CategoryChips categories={exampleCategories} className="bg-white shadow-sm" />

      {/* Custom section with different colors */}
      <div className="container mx-auto px-4 py-8">
        <ContentSection
          id="custom"
          title="Custom Section"
          ctaText="View All Custom"
          ctaHref="/custom-all"
          books={customBooks}
          variant="grid"
          className="bg-white rounded-lg p-6 shadow-sm"
        />
      </div>
    </div>
  );
}
