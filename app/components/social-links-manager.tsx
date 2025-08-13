import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SocialIcon, getSocialPlatformColor } from '~/components/ui/social-icons';
import { Trash2, Plus, Eye, EyeOff, GripVertical } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isVisible: boolean;
  displayOrder: number;
}

interface SocialLinksManagerProps {
  socialLinks: SocialLink[];
  onAddLink: (platform: string, url: string) => void;
  onUpdateLink: (id: string, url: string, isVisible: boolean) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (links: SocialLink[]) => void;
}

const SOCIAL_PLATFORMS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'tokopedia', label: 'Tokopedia' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'website', label: 'Website' },
];

export function SocialLinksManager({
  socialLinks,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
}: SocialLinksManagerProps) {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  const handleAddLink = () => {
    if (newPlatform && newUrl) {
      onAddLink(newPlatform, newUrl);
      setNewPlatform('');
      setNewUrl('');
      setIsAddingLink(false);
    }
  };

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => !socialLinks.some((link) => link.platform === platform.value),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Social Media Links</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingLink(true)}
            disabled={availablePlatforms.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Link
          </Button>
        </CardTitle>
        <CardDescription>Kelola link media sosial dan platform online Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Links */}
        {socialLinks.map((link) => (
          <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <div className="cursor-grab">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            <div className={`p-2 rounded ${getSocialPlatformColor(link.platform)}`}>
              <SocialIcon platform={link.platform} />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{link.platform}</span>
                {!link.isVisible && <EyeOff className="w-4 h-4 text-gray-400" />}
              </div>
              <Input
                value={link.url}
                onChange={(e) => onUpdateLink(link.id, e.target.value, link.isVisible)}
                placeholder={`URL ${link.platform}`}
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdateLink(link.id, link.url, !link.isVisible)}
                title={link.isVisible ? 'Sembunyikan' : 'Tampilkan'}
              >
                {link.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteLink(link.id)}
                title="Hapus link"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Link Form */}
        {isAddingLink && (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Platform</option>
                  {availablePlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLink} disabled={!newPlatform || !newUrl}>
                Tambah Link
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingLink(false);
                  setNewPlatform('');
                  setNewUrl('');
                }}
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {socialLinks.length === 0 && !isAddingLink && (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada link media sosial</p>
            <p className="text-sm">Klik &quot;Tambah Link&quot; untuk menambahkan yang pertama</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
