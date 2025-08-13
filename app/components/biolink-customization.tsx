import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Eye, Copy, ExternalLink, Palette } from 'lucide-react';

interface BiolinkCustomizationProps {
  username: string;
  bio: string;
  isPublic: boolean;
  theme: string;
  customDomain?: string;
  onUsernameChange: (username: string) => void;
  onBioChange: (bio: string) => void;
  onPublicChange: (isPublic: boolean) => void;
  onThemeChange: (theme: string) => void;
  onCustomDomainChange: (domain: string) => void;
}

const THEMES = [
  { value: 'light', label: 'Light', preview: 'bg-white text-gray-900' },
  { value: 'dark', label: 'Dark', preview: 'bg-gray-900 text-white' },
  {
    value: 'colorful',
    label: 'Colorful',
    preview: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
  },
];

export function BiolinkCustomization({
  username,
  bio,
  isPublic,
  theme,
  customDomain,
  onUsernameChange,
  onBioChange,
  onPublicChange,
  onThemeChange,
  onCustomDomainChange,
}: BiolinkCustomizationProps) {
  const [tempUsername, setTempUsername] = useState(username);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'checking' | null>(
    null,
  );

  const biolinkUrl = customDomain
    ? `https://${customDomain}`
    : `https://santrionline.com/${username || 'username'}`;

  const handleUsernameCheck = async () => {
    if (!tempUsername || tempUsername === username) return;

    setIsCheckingUsername(true);
    setUsernameStatus('checking');

    // Simulate API call to check username availability
    setTimeout(() => {
      // This should be replaced with actual API call
      const isAvailable = Math.random() > 0.5; // Random for demo
      setUsernameStatus(isAvailable ? 'available' : 'taken');
      setIsCheckingUsername(false);

      if (isAvailable) {
        onUsernameChange(tempUsername);
      }
    }, 1000);
  };

  const copyBiolinkUrl = () => {
    navigator.clipboard.writeText(biolinkUrl);
    // You might want to show a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Biolink URL Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            URL Biolink Anda
          </CardTitle>
          <CardDescription>Link publik yang dapat Anda bagikan kepada orang lain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="flex-1 font-mono text-sm">{biolinkUrl}</span>
            <Button size="sm" variant="outline" onClick={copyBiolinkUrl}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={biolinkUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={isPublic ? 'default' : 'secondary'}>
              {isPublic ? 'Publik' : 'Privat'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onPublicChange(!isPublic)}>
              {isPublic ? 'Jadikan Privat' : 'Jadikan Publik'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Username Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Username Biolink</CardTitle>
          <CardDescription>Pilih username unik untuk URL biolink Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2 mt-1">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  santrionline.com/
                </div>
                <Input
                  id="username"
                  value={tempUsername}
                  onChange={(e) => {
                    setTempUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    setUsernameStatus(null);
                  }}
                  placeholder="username"
                  className="pl-32"
                  maxLength={20}
                />
              </div>
              <Button
                onClick={handleUsernameCheck}
                disabled={!tempUsername || tempUsername === username || isCheckingUsername}
                variant="outline"
              >
                {isCheckingUsername ? 'Checking...' : 'Cek'}
              </Button>
            </div>
            {usernameStatus && (
              <div className="mt-2">
                {usernameStatus === 'available' && (
                  <p className="text-sm text-green-600">✓ Username tersedia!</p>
                )}
                {usernameStatus === 'taken' && (
                  <p className="text-sm text-red-600">✗ Username sudah digunakan</p>
                )}
                {usernameStatus === 'checking' && (
                  <p className="text-sm text-blue-600">Memeriksa ketersediaan...</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bio Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
          <CardDescription>Ceritakan sedikit tentang diri Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="bio">Deskripsi Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="Tulis bio Anda di sini..."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              maxLength={300}
            />
            <div className="text-right text-sm text-gray-500 mt-1">{bio.length}/300 karakter</div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Tema Biolink
          </CardTitle>
          <CardDescription>Pilih tema untuk halaman biolink Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {THEMES.map((themeOption) => (
              <div
                key={themeOption.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  theme === themeOption.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onThemeChange(themeOption.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onThemeChange(themeOption.value);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${themeOption.label} theme`}
              >
                <div className={`w-full h-16 rounded mb-2 ${themeOption.preview}`}>
                  <div className="p-2 h-full flex flex-col justify-center">
                    <div className="h-2 bg-current opacity-80 rounded mb-1"></div>
                    <div className="h-1 bg-current opacity-60 rounded"></div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium">{themeOption.label}</span>
                  {theme === themeOption.value && <Badge className="ml-2 text-xs">Aktif</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain (Premium Feature) */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Kustom</CardTitle>
          <CardDescription>
            Gunakan domain Anda sendiri untuk biolink (Fitur Premium)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="customDomain">Domain Kustom</Label>
            <Input
              id="customDomain"
              value={customDomain || ''}
              onChange={(e) => onCustomDomainChange(e.target.value)}
              placeholder="domain.com"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Gunakan domain kustom untuk biolink Anda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
