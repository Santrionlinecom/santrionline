// CommentForm Component
// app/components/community/CommentForm.tsx

import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  onCommentAdded?: () => void;
  placeholder?: string;
  compact?: boolean;
}

export default function CommentForm({
  postId,
  parentId,
  user,
  onCommentAdded,
  placeholder = 'Tulis komentar...',
  compact = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === 'submitting';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', content.trim());
    formData.append('action', 'create-comment');

    if (parentId) {
      formData.append('parentId', parentId);
    }

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/community/comment',
    });

    // Reset form
    setContent('');
    setFocused(false);

    if (onCommentAdded) {
      onCommentAdded();
    }
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
    <div className={`flex space-x-3 ${compact ? 'py-2' : 'py-4'}`}>
      <Avatar className={compact ? 'h-8 w-8' : 'h-10 w-10'}>
        <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
        <AvatarFallback className={compact ? 'text-sm' : ''}>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            className={`resize-none ${compact ? 'min-h-[60px]' : 'min-h-[80px]'} ${
              focused || content ? 'border-primary' : ''
            }`}
            disabled={isSubmitting}
          />

          {(focused || content.trim()) && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{content.length}/500 karakter</div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContent('');
                    setFocused(false);
                  }}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!content.trim() || isSubmitting || content.length > 500}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      {parentId ? 'Balas' : 'Komentar'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
