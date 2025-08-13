/**
 * Book Marketplace Configuration
 * Centralized configuration for easy customization
 */

// Color Theme Configuration
export const bookTheme = {
  primary: {
    50: 'emerald-50',
    100: 'emerald-100',
    500: 'emerald-500',
    600: 'emerald-600',
    700: 'emerald-700',
  },
  accent: {
    400: 'yellow-400', // For star ratings
    500: 'yellow-500',
  },
  neutral: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    600: 'gray-600',
    900: 'gray-900',
  },
} as const;

// Layout Configuration
export const layoutConfig = {
  container: 'container mx-auto px-4 md:px-6 lg:px-8',
  sectionSpacing: 'py-6 md:py-8',
  cardGap: 'gap-4 md:gap-6',

  // Responsive breakpoints for book grids
  bookGrid: {
    mobile: 'grid-cols-2', // 2 columns on mobile
    tablet: 'md:grid-cols-3', // 3 columns on tablet
    desktop: 'xl:grid-cols-5', // 5 columns on desktop
  },
} as const;

// Content Configuration
export const contentConfig = {
  // Default hero banner content
  defaultHero: {
    title: 'Jodoh Preloved',
    subtitle:
      'Temukan buku impian Anda dengan harga terjangkau. Ribuan koleksi buku bekas berkualitas menanti Anda.',
    ctaText: 'Download Aplikasi Sekarang',
    badgeText: '🔥 Platform Terpercaya',
  },

  // Default section titles
  sections: {
    bestSeller: 'Today Best Seller',
    trending: 'Trending Books',
    newArrivals: 'New Arrivals',
    recommended: 'Recommended for You',
  },

  // Default category labels
  categories: [
    'Chicklit',
    'Desain',
    'Diary',
    'Drama',
    'Fantasy',
    'History',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ],

  // Loading simulation time
  loadingDelay: 800, // milliseconds
} as const;

// SEO Configuration
export const seoConfig = {
  siteName: 'Jodoh Preloved',
  defaultTitle: 'Jodoh Preloved – Platform Jual Beli Buku Bekas Terpercaya',
  defaultDescription:
    'Temukan ribuan buku bekas berkualitas dengan harga terjangkau. Jual beli buku mudah dan aman di Jodoh Preloved.',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@jodohpreloved',

  // Structured data
  organization: {
    name: 'Jodoh Preloved',
    description: 'Platform jual beli buku bekas terpercaya dengan ribuan koleksi berkualitas.',
    sameAs: ['https://www.facebook.com/jodohpreloved', 'https://www.instagram.com/jodohpreloved'],
  },
} as const;

// API Configuration (for future backend integration)
export const apiConfig = {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://api.jodohpreloved.com'
      : 'http://localhost:3000/api',

  endpoints: {
    books: '/books',
    categories: '/categories',
    search: '/search',
    user: '/user',
  },

  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

// Image Configuration
export const imageConfig = {
  // Placeholder images from Unsplash
  placeholders: {
    book: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop&q=80',
    hero: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&q=80',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
  },

  // Image sizes for different breakpoints
  sizes: {
    bookCard: '(max-width: 768px) 150px, (max-width: 1200px) 200px, 250px',
    hero: '(max-width: 768px) 100vw, 50vw',
  },

  // Fallback SVG for failed image loads
  fallbackSvg:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect fill='%23f3f4f6' width='200' height='300'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3ENo Image%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EAvailable%3C/text%3E%3C/svg%3E",
} as const;

// Animation Configuration
export const animationConfig = {
  // Transition durations
  fast: 'duration-200',
  normal: 'duration-300',
  slow: 'duration-500',

  // Hover effects
  cardHover: 'hover:-translate-y-0.5 hover:shadow-lg',
  buttonHover: 'hover:shadow-xl',

  // Loading skeleton
  shimmer: 'animate-pulse',
} as const;

// Accessibility Configuration
export const a11yConfig = {
  // Screen reader labels
  labels: {
    bookCard: (title: string, author: string) => `Buku ${title} oleh ${author}`,
    rating: (rating: number) => `Rating ${rating} dari 5`,
    category: (category: string) => `Kategori ${category}`,
    loading: 'Memuat daftar buku',
  },

  // Focus management
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',

  // Live regions
  liveRegion: 'aria-live="polite" aria-atomic="true"',
} as const;

// Utility functions for configuration
export const getThemeColor = (path: string): string | null => {
  const keys = path.split('.');
  let value: unknown = bookTheme;

  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return null;
    }
    if (!value) return null;
  }

  return typeof value === 'string' ? value : null;
};

export const getGridClasses = () => {
  return `grid ${layoutConfig.bookGrid.mobile} ${layoutConfig.bookGrid.tablet} ${layoutConfig.bookGrid.desktop} ${layoutConfig.cardGap}`;
};

export const getContainerClasses = (additionalClasses = '') => {
  return `${layoutConfig.container} ${additionalClasses}`.trim();
};
