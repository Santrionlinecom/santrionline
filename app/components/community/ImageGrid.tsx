// ImageGrid Component
// app/components/community/ImageGrid.tsx

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface ImageGridProps {
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  compact?: boolean;
}

export default function ImageGrid({ images, compact = false }: ImageGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getGridClass = () => {
    const count = images.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  const getImageClass = (index: number) => {
    const count = images.length;
    const baseClass = `relative cursor-pointer rounded-lg overflow-hidden group ${compact ? 'h-24' : 'h-48'}`;

    if (count === 1) return `${baseClass} col-span-1`;
    if (count === 2) return `${baseClass} col-span-1`;
    if (count === 3) {
      if (index === 0) return `${baseClass} col-span-2`;
      return `${baseClass} col-span-1`;
    }
    if (count >= 4) {
      if (index === 0) return `${baseClass} col-span-2`;
      return `${baseClass} col-span-1`;
    }

    return baseClass;
  };

  return (
    <>
      <div className={`grid gap-2 ${getGridClass()}`}>
        {images.slice(0, 4).map((image, index) => (
          <div
            key={image.id}
            className={getImageClass(index)}
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <img
              src={image.url}
              alt={image.alt || `Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* More images indicator */}
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  ‹
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  ›
                </Button>
              </>
            )}

            {/* Main image */}
            <img
              src={images[lightboxIndex]?.url}
              alt={images[lightboxIndex]?.alt || `Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                closeLightbox();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close lightbox"
          />
        </div>
      )}
    </>
  );
}
