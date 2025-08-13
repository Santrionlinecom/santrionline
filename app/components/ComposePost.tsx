// ComposePost Component
// app/components/ComposePost.tsx

import { useState, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent } from '~/components/ui/card';
import { Image as ImageIcon, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { z } from 'zod';

// Validation schema
const postSchema = z.object({
  content: z
    .string()
    .min(1, 'Konten tidak boleh kosong')
    .max(5000, 'Konten maksimal 5000 karakter'),
});

interface PreviewImage {
  id: string;
  file: File;
  url: string;
  uploaded?: boolean;
  publicUrl?: string;
}

interface ComposePostProps {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  onSuccess?: () => void;
}

export default function ComposePost({ user, onSuccess }: ComposePostProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const postFetcher = useFetcher();

  // Character count
  const charCount = content.length;
  const isOverLimit = charCount > 5000;

  // Add images
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      setErrors({ images: 'Maksimal 4 gambar per post' });
      return;
    }

    const newImages: PreviewImage[] = files
      .map((file) => {
        // Validate file
        if (file.size > 2 * 1024 * 1024) {
          setErrors({ images: 'Ukuran file maksimal 2MB' });
          return null;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setErrors({ images: 'Format file harus JPG, PNG, atau WebP' });
          return null;
        }

        return {
          id: Math.random().toString(36),
          file,
          url: URL.createObjectURL(file),
        };
      })
      .filter(Boolean) as PreviewImage[];

    setImages((prev) => [...prev, ...newImages]);
    setErrors({});

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      // Cleanup object URL
      const removed = prev.find((img) => img.id === id);
      if (removed && !removed.uploaded) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  // Upload images to R2
  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        if (image.uploaded && image.publicUrl) {
          uploadedUrls.push(image.publicUrl);
          continue;
        }

        // Get signed URL
        const signedResponse = await fetch('/api/upload/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: `post-${Date.now()}`, // Temp ID
            contentType: image.file.type,
            size: image.file.size,
          }),
        });

        if (!signedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const { uploadEndpoint, publicUrl, key } = (await signedResponse.json()) as {
          uploadEndpoint: string;
          publicUrl: string;
          key: string;
        };

        // Upload file
        const formData = new FormData();
        formData.append('file', image.file);
        formData.append('key', key);

        const uploadResponse = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        uploadedUrls.push(publicUrl);

        // Mark as uploaded
        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, uploaded: true, publicUrl } : img)),
        );
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ upload: 'Gagal mengupload gambar' });
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  // Submit post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate content
    try {
      postSchema.parse({ content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    // Upload images first
    const imageUrls = await uploadImages();
    if (images.length > 0 && imageUrls.length === 0) {
      return; // Upload failed
    }

    // Submit post
    const formData = new FormData();
    formData.append('content', content);
    formData.append('imageUrls', JSON.stringify(imageUrls));
    formData.append('action', 'create');

    postFetcher.submit(formData, {
      method: 'POST',
      action: '/community',
    });
  };

  // Handle post success
  if ((postFetcher.data as { success?: boolean })?.success) {
    // Reset form
    setContent('');
    setImages([]);
    setErrors({});
    onSuccess?.();
  }

  const isSubmitting = postFetcher.state === 'submitting' || isUploading;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">Apa yang ingin Anda bagikan?</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis sesuatu yang menginspirasi..."
              className={`min-h-[120px] border-0 resize-none text-lg placeholder:text-gray-400 focus-visible:ring-0 ${
                isOverLimit ? 'text-red-500' : ''
              }`}
              maxLength={5000}
            />

            {/* Character count */}
            <div className="flex justify-end">
              <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                {charCount}/5000
              </span>
            </div>

            {errors.content && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.content}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Image previews */}
          {images.length > 0 && (
            <div
              className={`grid gap-2 ${
                images.length === 1
                  ? 'grid-cols-1'
                  : images.length === 2
                    ? 'grid-cols-2'
                    : images.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2'
              }`}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group rounded-lg overflow-hidden border ${
                    images.length === 3 && index === 0
                      ? 'col-span-3'
                      : images.length === 4 && index >= 2
                        ? 'col-span-1'
                        : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Upload status */}
                  {image.uploaded && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                      ✓ Uploaded
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error messages */}
          {(errors.images || errors.upload) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.images || errors.upload}</AlertDescription>
            </Alert>
          )}

          {(postFetcher.data as { error?: string })?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{(postFetcher.data as { error?: string }).error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              {/* Add images */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 4 || isSubmitting}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Gambar</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              {images.length > 0 && (
                <span className="text-xs text-gray-500">{images.length}/4 gambar</span>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || isOverLimit}
              className="px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUploading ? 'Mengupload...' : 'Memposting...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
