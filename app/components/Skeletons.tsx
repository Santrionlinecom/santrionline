// Skeletons Component
// app/components/Skeletons.tsx

import { Card, CardContent } from '~/components/ui/card';

// Skeleton untuk post card
export function PostCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start space-x-3 mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse" />
        </div>

        {/* Image skeleton */}
        <div className="mb-4">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center space-x-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton untuk feed
export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton untuk compose post
export function ComposePostSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
        </div>

        <div className="h-32 bg-gray-200 rounded-lg mb-4 animate-pulse" />

        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton untuk comment
export function CommentSkeleton() {
  return (
    <div className="flex space-x-3">
      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
      <div className="flex-1">
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2 ml-4">
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Skeleton untuk comment list
export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton untuk sidebar stats
export function SidebarStatsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-6 animate-pulse" />
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full mt-4 animate-pulse" />
      </CardContent>
    </Card>
  );
}

// Skeleton untuk image grid
export function ImageGridSkeleton({ count = 1 }: { count?: number }) {
  const getGridClass = () => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-2';
    }
  };

  const getImageClass = (index: number) => {
    if (count === 1) return 'aspect-[4/3]';
    if (count === 2) return 'aspect-[4/3]';
    if (count === 3) {
      return index === 0 ? 'col-span-1 row-span-2 aspect-[3/4]' : 'aspect-[4/3]';
    }
    if (count === 4) return 'aspect-square';
    return 'aspect-[4/3]';
  };

  return (
    <div className={`grid gap-2 ${getGridClass()}`}>
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded-lg animate-pulse ${getImageClass(i)}`} />
      ))}
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
}

// Infinite scroll loading indicator
export function InfiniteScrollLoader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex items-center space-x-2 text-gray-500">
        <LoadingSpinner size="sm" />
        <span className="text-sm">Memuat postingan...</span>
      </div>
    </div>
  );
}
