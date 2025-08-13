import { Link } from '@remix-run/react';
import { Star } from 'lucide-react';
import { cn } from '~/lib/utils';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  href?: string;
}

export interface BookCardProps {
  book: Book;
  className?: string;
  isLoading?: boolean;
}

export function BookCard({ book, className, isLoading = false }: BookCardProps) {
  if (isLoading) {
    return <BookCardSkeleton className={className} />;
  }

  const href = book.href || `/books/${book.id}`;

  return (
    <Link
      to={href}
      prefetch="intent"
      className={cn(
        'group block w-36 md:w-44 flex-shrink-0 snap-start',
        'transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
      aria-label={`Buku ${book.title} oleh ${book.author}`}
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200">
        <img
          src={book.coverUrl}
          alt={`Cover buku ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect fill='%23f3f4f6' width='200' height='300'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3ENo Image%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EAvailable%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Rating Badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-sm px-2 py-1 text-xs font-medium shadow-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-900">{book.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Book Info */}
      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
      </div>
    </Link>
  );
}

export function BookCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('w-36 md:w-44 flex-shrink-0 snap-start animate-pulse', className)}
      aria-label="Loading book..."
      role="status"
    >
      {/* Cover Skeleton */}
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-gray-200">
        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />

        {/* Rating Badge Skeleton */}
        <div className="absolute left-2 top-2 h-6 w-12 rounded-md bg-white/80" />
      </div>

      {/* Text Skeleton */}
      <div className="mt-2 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

// Grid variant for responsive layouts
export function BookGrid({
  books,
  className,
  isLoading = false,
}: {
  books: Book[];
  className?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5', className)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <BookCardSkeleton key={i} className="w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5', className)}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} className="w-full" />
      ))}
    </div>
  );
}

// Row scroll variant for mobile-friendly horizontal scrolling
export function BookRow({
  books,
  className,
  isLoading = false,
}: {
  books: Book[];
  className?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className={cn('flex gap-4 overflow-x-auto pb-2 scrollbar-hide', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory',
        className,
      )}
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
