import { memo } from 'react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

const LoadingSkeleton = memo(() => (
  <div className="bg-background text-foreground">
    {/* Hero Section Skeleton */}
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-16 w-5/6 mx-auto mb-6" />
          <Skeleton className="h-6 w-4/5 mx-auto mb-8" />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto mb-8">
            <Skeleton className="h-12 w-full sm:w-40" />
            <Skeleton className="h-12 w-full sm:w-40" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-24" />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Stats Section Skeleton */}
    <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="text-center bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm"
            >
              <Skeleton className="w-8 h-8 mx-auto mb-2" />
              <Skeleton className="h-8 w-16 mx-auto mb-1" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Tabs Feature Section Skeleton */}
    <section className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-32" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="bg-primary/5 p-6 sm:p-8 rounded-2xl border border-primary/10">
            <div className="flex items-center mb-6">
              <Skeleton className="w-12 h-12 mr-4" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-4/5 mb-6" />

            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="w-5 h-5 mt-0.5 mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-32 mt-8" />
          </div>

          <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-1 shadow-xl">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>

    {/* Features Grid Section Skeleton */}
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader className="p-4 sm:p-6">
                <Skeleton className="w-12 h-12 mb-4" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonial Section Skeleton */}
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/5 mb-6" />
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="w-4 h-4 mr-1" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section Skeleton */}
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <Skeleton className="h-10 w-80 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto mb-8 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto mb-8">
              <Skeleton className="h-12 w-full sm:w-48 bg-white/20" />
              <Skeleton className="h-12 w-full sm:w-32 bg-white/20" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-28 bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

export { LoadingSkeleton };
