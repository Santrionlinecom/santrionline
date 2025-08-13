import { Link } from '@remix-run/react';
import { cn } from '~/lib/utils';

export interface CategoryChip {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface CategoryChipsProps {
  categories: CategoryChip[];
  className?: string;
}

export function CategoryChips({ categories, className }: CategoryChipsProps) {
  return (
    <section className={cn('py-4', className)}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Horizontal scrollable container */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              prefetch="intent"
              className={cn(
                'flex-shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                'border border-gray-200 bg-white text-gray-700',
                'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                'active:scale-95',
                category.isActive && 'bg-emerald-100 border-emerald-300 text-emerald-800',
              )}
              aria-label={`Kategori ${category.label}`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
