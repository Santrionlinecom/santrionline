// Professional Facebook-like Community Feed Component
// app/components/community/CommunityFeed.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFetcher, Link } from '@remix-run/react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Textarea } from '~/components/ui/textarea';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Send,
  ChevronDown,
  Eye,
  Users,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';

// =====================
// Types
// =====================

interface PostImage {
  id: string;
  url: string;
  description?: string;
}

interface PostAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  verified?: boolean;
}

interface PostComment {
  id: string;
  content: string;
  authorId: string;
  author: PostAuthor;
  createdAt: string;
  likes: number;
  parentId?: string;
  replies?: PostComment[];
  isLiked?: boolean;
}

interface CommunityPost {
  id: string;
  content: string;
  authorId: string;
  author: PostAuthor;
  images: PostImage[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  comments: PostComment[];
  tags?: string[];
  privacy: 'public' | 'friends' | 'private';
}

interface CommunityFeedProps {
  initialPosts: CommunityPost[];
  currentUser: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  hasMore: boolean;
}

// ===== NEW: tipe respons + type guard =====
type FeedResponse = {
  posts: CommunityPost[];
  hasMore: boolean;
};

function isFeedResponse(value: unknown): value is FeedResponse {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  const postsOk = Array.isArray(v.posts);
  const hasMoreOk = typeof v.hasMore === 'boolean';
  return postsOk && hasMoreOk;
}

// =====================

export default function CommunityFeed({
  initialPosts,
  currentUser,
  hasMore: initialHasMore,
}: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const likeFetcher = useFetcher();
  const commentFetcher = useFetcher();
  const shareFetcher = useFetcher();
  const bookmarkFetcher = useFetcher();
  const followFetcher = useFetcher();

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/community?page=${page + 1}`);
      const json: unknown = await response.json();

      if (isFeedResponse(json) && json.posts.length > 0) {
        setPosts((prev) => [...prev, ...json.posts]);
        setPage((prev) => prev + 1);
        setHasMore(json.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  // Optimistic updates
  const updatePostLocally = (postId: string, updates: Partial<CommunityPost>) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, ...updates } : post)));
  };

  const updateCommentLocally = (
    postId: string,
    commentId: string,
    updates: Partial<PostComment>,
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId ? { ...comment, ...updates } : comment,
            ),
          };
        }
        return post;
      }),
    );
  };

  // Actions
  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic update
    updatePostLocally(postId, {
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
    });

    // API call
    likeFetcher.submit(
      { postId, action: 'toggle-like' },
      { method: 'POST', action: '/api/community/like' },
    );
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    const post = posts.find((p) => p.id === postId);
    const comment = post?.comments.find((c) => c.id === commentId);
    if (!comment) return;

    // Optimistic update
    updateCommentLocally(postId, commentId, {
      isLiked: !comment.isLiked,
      likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
    });

    // API call
    likeFetcher.submit(
      { commentId, action: 'toggle-comment-like' },
      { method: 'POST', action: '/api/community/like' },
    );
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    // Optimistic update
    const tempComment: PostComment = {
      id: `temp-${Date.now()}`,
      content,
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, tempComment],
            commentCount: post.commentCount + 1,
          };
        }
        return post;
      }),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

    // API call
    commentFetcher.submit(
      { postId, content, action: 'create-comment' },
      { method: 'POST', action: '/api/community/comment' },
    );
  };

  const handleReply = (postId: string, parentCommentId: string) => {
    const content = replyInputs[parentCommentId]?.trim();
    if (!content) return;

    // Similar to comment but with parentId
    const tempReply: PostComment = {
      id: `temp-reply-${Date.now()}`,
      content,
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      parentId: parentCommentId,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), tempReply],
                };
              }
              return comment;
            }),
            commentCount: post.commentCount + 1,
          };
        }
        return post;
      }),
    );

    setReplyInputs((prev) => ({ ...prev, [parentCommentId]: '' }));
    setActiveReply(null);

    // API call
    commentFetcher.submit(
      { postId, parentCommentId, content, action: 'create-reply' },
      { method: 'POST', action: '/api/community/comment' },
    );
  };

  const handleShare = (postId: string) => {
    updatePostLocally(postId, {
      shareCount: posts.find((p) => p.id === postId)!.shareCount + 1,
    });

    shareFetcher.submit(
      { postId, action: 'share' },
      { method: 'POST', action: '/api/community/share' },
    );
  };

  const handleBookmark = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    updatePostLocally(postId, {
      isBookmarked: !post.isBookmarked,
    });

    bookmarkFetcher.submit(
      { postId, action: 'toggle-bookmark' },
      { method: 'POST', action: '/api/community/bookmark' },
    );
  };

  const handleFollow = (userId: string, postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    updatePostLocally(postId, {
      isFollowing: !post.isFollowing,
    });

    followFetcher.submit(
      { userId, action: 'toggle-follow' },
      { method: 'POST', action: '/api/community/follow' },
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return 'Baru saja';
      if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
      if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
      if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
      return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
    } catch {
      return 'Baru saja';
    }
  };

  const renderPostImages = (images: PostImage[]) => {
    if (images.length === 0) return null;

    return (
      <div
        className={`mt-3 rounded-lg overflow-hidden ${
          images.length === 1
            ? 'grid-cols-1'
            : images.length === 2
              ? 'grid grid-cols-2 gap-1'
              : images.length === 3
                ? 'grid grid-cols-2 gap-1'
                : 'grid grid-cols-2 gap-1'
        }`}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative ${
              images.length === 3 && index === 0
                ? 'col-span-2'
                : images.length > 4 && index >= 3
                  ? 'hidden'
                  : ''
            }`}
          >
            <button
              type="button"
              className="w-full h-auto max-h-96 cursor-pointer hover:opacity-95 transition-opacity bg-transparent border-0 p-0"
              onClick={() => {
                // TODO: Open image modal
                console.log('Open image modal:', image.url);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  console.log('Open image modal:', image.url);
                }
              }}
              aria-label={`View image ${index + 1}: ${image.description || 'Post image'}`}
            >
              <img
                src={image.url}
                alt={image.description || `Image ${index + 1}`}
                className="w-full h-auto max-h-96 object-cover"
              />
            </button>
            {images.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                +{images.length - 4} lainnya
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (comment: PostComment, postId: string, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mt-3'}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
          <AvatarFallback className="text-xs">
            {comment.author.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">{comment.author.name}</span>
              {comment.author.verified && (
                <Badge variant="secondary" className="text-xs px-1">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <span>{formatRelativeTime(comment.createdAt)}</span>

            <button
              onClick={() => handleCommentLike(postId, comment.id)}
              className={`hover:text-red-500 transition-colors ${
                comment.isLiked ? 'text-red-500 font-semibold' : ''
              }`}
            >
              Suka {comment.likes > 0 && `(${comment.likes})`}
            </button>

            {!isReply && (
              <button
                onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
                className="hover:text-blue-500 transition-colors"
              >
                Balas
              </button>
            )}
          </div>

          {/* Reply input */}
          {!isReply && activeReply === comment.id && (
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-xs">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center space-x-2">
                <Textarea
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({ ...prev, [comment.id]: e.target.value }))
                  }
                  placeholder="Tulis balasan..."
                  className="min-h-[32px] text-sm py-1"
                  rows={1}
                />
                <Button
                  size="sm"
                  onClick={() => handleReply(postId, comment.id)}
                  disabled={!replyInputs[comment.id]?.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderComment(reply, postId, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Link to={`/profile/${post.author.id}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                    <AvatarFallback>
                      {post.author.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/profile/${post.author.id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {post.author.name}
                    </Link>
                    {post.author.verified && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                    {post.author.role && (
                      <Badge variant="outline" className="text-xs">
                        {post.author.role}
                      </Badge>
                    )}
                    {!post.isFollowing && post.author.id !== currentUser.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFollow(post.author.id, post.id)}
                        className="text-xs h-6 px-2"
                      >
                        Ikuti
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(post.createdAt)}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.viewCount}</span>
                    </div>
                    {post.privacy !== 'public' && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.privacy === 'friends' ? 'Teman' : 'Pribadi'}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBookmark(post.id)}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    {post.isBookmarked ? 'Hapus Bookmark' : 'Bookmark'}
                  </DropdownMenuItem>
                  {post.author.id !== currentUser.id && (
                    <>
                      <DropdownMenuItem>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Laporkan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="w-4 h-4 mr-2" />
                        {post.isFollowing ? 'Berhenti Mengikuti' : 'Ikuti'} {post.author.name}
                      </DropdownMenuItem>
                    </>
                  )}
                  {post.author.id === currentUser.id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Post</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Hapus Post</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Post content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Images */}
            {renderPostImages(post.images)}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`hover:bg-red-50 hover:text-red-600 transition-colors ${
                    post.isLiked ? 'text-red-600 bg-red-50' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{post.commentCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(post.id)}
                  className="hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{post.shareCount}</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark(post.id)}
                className={`hover:bg-yellow-50 hover:text-yellow-600 transition-colors ${
                  post.isBookmarked ? 'text-yellow-600 bg-yellow-50' : ''
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Comments section */}
            {expandedComments.has(post.id) && (
              <div className="mt-4 border-t pt-4">
                {/* Add comment */}
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback className="text-xs">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center space-x-2">
                    <Textarea
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Tulis komentar..."
                      className="min-h-[36px] text-sm"
                      rows={1}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Comments list */}
                <div className="space-y-1">
                  {post.comments.map((comment) => renderComment(comment, post.id))}
                </div>

                {post.comments.length > 5 && (
                  <Button variant="ghost" size="sm" className="mt-3 text-gray-500">
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Muat komentar lainnya
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memuat postingan...</span>
            </div>
          ) : (
            <Button variant="outline" onClick={loadMore}>
              Muat lebih banyak
            </Button>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>Anda telah melihat semua postingan</p>
        </div>
      )}
    </div>
  );
}
// Assuming you have a data file for footer links
