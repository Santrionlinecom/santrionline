import { Link } from '@remix-run/react';
import { ArrowRight } from 'lucide-react';
import { BookRow, BookGrid, type Book } from './BookCard';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export interface ContentSectionProps {
  id: string;
  title: string;
  ctaText?: string;
  ctaHref: string;
  books: Book[];
  variant?: 'row' | 'grid';
  className?: string;
  isLoading?: boolean;
}

export function ContentSection({
  id,
  title,
  ctaText = 'Lihat Semua',
  ctaHref,
  books,
  variant = 'row',
  className,
  isLoading = false,
}: ContentSectionProps) {
  return (
    <section className={cn('space-y-4', className)} aria-labelledby={`${id}-title`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 id={`${id}-title`} className="text-lg font-semibold text-gray-900 md:text-xl">
          {title}
        </h2>

        <Button
          asChild
          variant="default"
          size="sm"
          className="btn btn-green btn-sm flex items-center gap-1.5"
        >
          <Link to={ctaHref} prefetch="intent">
            <span>{ctaText}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      {/* Books Display */}
      {variant === 'grid' ? (
        <BookGrid books={books} isLoading={isLoading} className="mt-4" />
      ) : (
        <BookRow books={books} isLoading={isLoading} className="mt-4" />
      )}

      {/* Loading state announcement for screen readers */}
      {isLoading && (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Memuat daftar buku {title}
        </div>
      )}
    </section>
  );
}
