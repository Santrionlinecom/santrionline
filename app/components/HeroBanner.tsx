import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badgeText: string;
  imageSrc: string;
  imageAlt?: string;
}

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaHref,
  badgeText,
  imageSrc,
  imageAlt = 'Hero banner illustration',
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
            >
              {badgeText}
            </Badge>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mb-6 text-base text-gray-600 md:text-lg lg:max-w-lg">{subtitle}</p>

            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>

          {/* Hero Image */}
          <div className="flex-1 max-w-md md:max-w-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-xl">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage%3C/text%3E%3C/svg%3E";
                }}
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-emerald-200 opacity-30" />
              <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-green-300 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
