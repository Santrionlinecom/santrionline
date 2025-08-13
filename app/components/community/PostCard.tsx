// PostCard Component
// app/components/community/PostCard.tsx

import { useState } from 'react';
import { useFetcher, Link } from '@remix-run/react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock, Trash2 } from 'lucide-react';
import ImageGrid from '~/components/community/ImageGrid';

// Type that accepts both Date and string for createdAt/updatedAt
interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    createdAt: string | Date;
    updatedAt: string | Date | null;
    authorId: string;
    shareParentId: string | null;
    author: { id: string; name: string; avatarUrl: string | null };
    images: Array<{
      id: string;
      url: string;
      width: number | null;
      height: number | null;
      idx: number | null;
    }>;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    shareParent?: {
      id: string;
      content: string | null;
      createdAt: string | Date;
      author: { name: string };
    } | null;
  };
  currentUserId?: string;
  showActions?: boolean;
  compact?: boolean;
}

export default function PostCard({
  post,
  currentUserId,
  showActions = true,
  compact = false,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const likeFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const handleLike = () => {
    if (!currentUserId) return;

    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(newCount);

    const formData = new FormData();
    formData.append('postId', post.id);
    formData.append('action', newIsLiked ? 'like' : 'unlike');

    likeFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/like',
    });
  };

  const handleDelete = () => {
    if (!confirm('Apakah Anda yakin ingin menghapus post ini?')) return;

    const formData = new FormData();
    formData.append('postId', post.id);

    deleteFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/delete',
    });
  };

  const formatTime = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}j`;
    if (days < 7) return `${days}h`;

    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`w-full ${compact ? '' : 'hover:shadow-lg transition-shadow'}`}>
      <CardContent className={compact ? 'p-4' : 'p-6'}>
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className={compact ? 'h-8 w-8' : 'h-10 w-10'}>
              <AvatarImage src={post.author.avatarUrl || undefined} alt={post.author.name} />
              <AvatarFallback className={compact ? 'text-sm' : ''}>
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${compact ? 'text-sm' : ''}`}>
                  {post.author.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Santri
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-1">
              {currentUserId === post.authorId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteFetcher.state === 'submitting'}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Shared Post (if this is a share) */}
        {post.shareParent && (
          <div className="mb-4 p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">{post.shareParent.author.name}</span>
              <span className="text-xs text-muted-foreground">
                • {formatTime(post.shareParent.createdAt)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{post.shareParent.content}</p>
          </div>
        )}

        {/* Post Content */}
        {post.content && (
          <div className="mb-4">
            <p
              className={`whitespace-pre-wrap ${compact ? 'text-sm' : ''} ${compact ? 'line-clamp-2' : ''}`}
            >
              {post.content}
            </p>
          </div>
        )}

        {/* Images */}
        {post.images.length > 0 && (
          <div className="mb-4">
            <ImageGrid
              images={post.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: `Image ${img.idx || 0}`,
              }))}
              compact={compact}
            />
          </div>
        )}

        {/* Post Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>{likesCount} likes</span>
              <span>{post.commentsCount} comments</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!currentUserId || likeFetcher.state === 'submitting'}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link to={`/community/post/${post.id}`}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comment
                </Link>
              </Button>

              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
