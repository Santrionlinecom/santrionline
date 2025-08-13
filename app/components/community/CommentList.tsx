// CommentList Component
// app/components/community/CommentList.tsx

import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import CommentForm from '~/components/community/CommentForm';

// Type that handles serialized dates
interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  userId: string;
  postId: string;
  parentId: string | null;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  likesCount?: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  postId: string;
  currentUser: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  showReplies?: boolean;
  maxDepth?: number;
  currentDepth?: number;
}

export default function CommentList({
  comments,
  postId,
  currentUser,
  showReplies = true,
  maxDepth = 3,
  currentDepth = 0,
}: CommentListProps) {
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

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

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleReplyForm = (commentId: string) => {
    setShowReplyForm((prev) => (prev === commentId ? null : commentId));
  };

  if (!comments?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          showReplies={showReplies}
          maxDepth={maxDepth}
          currentDepth={currentDepth}
          showReplyForm={showReplyForm === comment.id}
          expandedReplies={expandedReplies}
          onToggleReplies={() => toggleReplies(comment.id)}
          onToggleReplyForm={() => toggleReplyForm(comment.id)}
          formatTime={formatTime}
          getInitials={getInitials}
        />
      ))}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUser: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  showReplies: boolean;
  maxDepth: number;
  currentDepth: number;
  showReplyForm: boolean;
  expandedReplies: Set<string>;
  onToggleReplies: () => void;
  onToggleReplyForm: () => void;
  formatTime: (date: string | Date) => string;
  getInitials: (name: string) => string;
}

function CommentItem({
  comment,
  postId,
  currentUser,
  showReplies,
  maxDepth,
  currentDepth,
  showReplyForm,
  expandedReplies,
  onToggleReplies,
  onToggleReplyForm,
  formatTime,
  getInitials,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const likeFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    setIsLiked(newIsLiked);
    setLikesCount(newCount);

    const formData = new FormData();
    formData.append('commentId', comment.id);
    formData.append('action', newIsLiked ? 'like-comment' : 'unlike-comment');

    likeFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/comment',
    });
  };

  const handleDelete = () => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

    const formData = new FormData();
    formData.append('commentId', comment.id);
    formData.append('action', 'delete-comment');

    deleteFetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/comment',
    });
  };

  const canReply = showReplies && currentDepth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const repliesExpanded = expandedReplies.has(comment.id);

  return (
    <div className={`${currentDepth > 0 ? 'ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatarUrl || undefined} alt={comment.author.name} />
          <AvatarFallback className="text-sm">{getInitials(comment.author.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <Badge variant="secondary" className="text-xs">
                Santri
              </Badge>
              <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
            </div>

            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <button
              onClick={handleLike}
              disabled={likeFetcher.state === 'submitting'}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount || 'Like'}</span>
            </button>

            {canReply && (
              <button
                onClick={onToggleReplyForm}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Balas
              </button>
            )}

            {hasReplies && (
              <button
                onClick={onToggleReplies}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {repliesExpanded ? 'Sembunyikan' : `Lihat ${comment.replies!.length} balasan`}
              </button>
            )}

            {currentUser.id === comment.userId && (
              <button
                onClick={handleDelete}
                disabled={deleteFetcher.state === 'submitting'}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && canReply && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                user={currentUser}
                placeholder={`Balas ${comment.author.name}...`}
                compact={true}
                onCommentAdded={onToggleReplyForm}
              />
            </div>
          )}

          {/* Nested Replies */}
          {hasReplies && repliesExpanded && canReply && (
            <div className="mt-3">
              <CommentList
                comments={comment.replies!}
                postId={postId}
                currentUser={currentUser}
                showReplies={showReplies}
                maxDepth={maxDepth}
                currentDepth={currentDepth + 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
