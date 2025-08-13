import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
// NOTE: server-only modules dynamically imported inside loader/action
import { user as userTable, user_social_links } from "~/db/schema";
import { eq, and, sql } from "drizzle-orm";
// session helper moved to dynamic import
import { useState } from "react";
import { useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { User, Link, Settings, Shield, Plus, Trash2, Eye, EyeOff } from "lucide-react";

export const meta: MetaFunction = () => {
  return [{ title: "Pengaturan Akun - Santri Online" }];
};

// Schemas
const ProfileUpdateSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  avatarUrl: z.string().url('URL avatar tidak valid').optional().or(z.literal('')),
});

const BiolinkUpdateSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(20, 'Username maksimal 20 karakter').regex(/^[a-z0-9_]+$/, 'Username hanya boleh huruf kecil, angka, dan underscore'),
  bio: z.string().max(300, 'Bio maksimal 300 karakter').optional().or(z.literal('')),
  isPublic: z.boolean(),
  theme: z.enum(['light', 'dark', 'colorful']),
});

const SocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform wajib'),
  url: z.string().url('URL tidak valid'),
  // Gunakan coerce supaya 'true' / 'false' (string FormData) diterima sebagai boolean
  isVisible: z.coerce.boolean(),
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  
  // Get tab from URL searchParams
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'profile';

  const currentUser = await db.query.user.findFirst({
    where: eq(userTable.id, userId),
    columns: { 
      name: true, 
      email: true, 
      avatarUrl: true,
      username: true,
      bio: true,
      isPublic: true,
      theme: true,
    },
  });

  if (!currentUser) {
    throw new Response("User tidak ditemukan", { status: 404 });
  }

  const socialLinks = await db.query.user_social_links.findMany({
    where: eq(user_social_links.userId, userId),
    orderBy: [user_social_links.displayOrder],
  });

  return json({ 
    user: currentUser,
    socialLinks: socialLinks || [],
    activeTab: tab,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'update-profile') {
    const submission = parseWithZod(formData, { schema: ProfileUpdateSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }

    await db.update(userTable)
      .set({
        name: submission.value.name,
        email: submission.value.email,
        avatarUrl: submission.value.avatarUrl || null,
      })
      .where(eq(userTable.id, userId));

    return json({ success: true });
  }

  if (intent === 'update-biolink') {
    const submission = parseWithZod(formData, { schema: BiolinkUpdateSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }

    // Check username availability
    if (submission.value.username) {
      const existingUser = await db.query.user.findFirst({
        where: eq(userTable.username, submission.value.username),
      });

      const currentUser = await db.query.user.findFirst({
        where: eq(userTable.id, userId),
        columns: { username: true },
      });

      if (existingUser && existingUser.id !== userId && currentUser?.username !== submission.value.username) {
        return json(submission.reply({
          fieldErrors: { username: ['Username sudah digunakan'] }
        }));
      }
    }

    await db.update(userTable)
      .set({
        username: submission.value.username,
        bio: submission.value.bio || null,
        isPublic: submission.value.isPublic,
        theme: submission.value.theme,
      })
      .where(eq(userTable.id, userId));

    return json({ success: true });
  }

  if (intent === 'add-social-link') {
    const submission = parseWithZod(formData, { schema: SocialLinkSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }

    // Hitung displayOrder berikutnya (max + 1)
    let nextOrder = 0;
    try {
      const maxRow = await db
        .select({ max: sql<number>`max(${user_social_links.displayOrder})` })
        .from(user_social_links)
        .where(eq(user_social_links.userId, userId));
      nextOrder = ((maxRow[0]?.max as number | null) ?? -1) + 1;
    } catch {}

    await db.insert(user_social_links).values({
      id: `social_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userId,
      platform: submission.value.platform as any,
      url: submission.value.url,
      isVisible: submission.value.isVisible,
      displayOrder: nextOrder,
      createdAt: new Date(),
    });

    return json({ success: true });
  }

  if (intent === 'update-social-link') {
    const linkId = formData.get('linkId') as string;
    const submission = parseWithZod(formData, { schema: SocialLinkSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    // Pastikan linkId ada
    if (!linkId) return json({ error: 'linkId diperlukan' }, { status: 400 });
    await db.update(user_social_links)
      .set({
        url: submission.value.url,
        isVisible: submission.value.isVisible,
      })
      .where(and(
        eq(user_social_links.id, linkId),
        eq(user_social_links.userId, userId)
      ));

    return json({ success: true });
  }

  if (intent === 'delete-social-link') {
    const linkId = formData.get('linkId') as string;
    await db.delete(user_social_links)
      .where(and(
        eq(user_social_links.id, linkId),
        eq(user_social_links.userId, userId)
      ));

    return json({ success: true });
  }

  return json({ error: 'Invalid intent' }, { status: 400 });
}

export default function PengaturanPage() {
  const { user, socialLinks, activeTab: defaultTab } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const submit = useSubmit();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Profile form
  const [profileForm, profileFields] = useForm({
    lastResult: lastResult && 'status' in lastResult ? lastResult : undefined,
    constraint: getZodConstraint(ProfileUpdateSchema),
    defaultValue: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
    }
  });

  // Biolink form
  const [biolinkForm, biolinkFields] = useForm({
    lastResult: lastResult && 'status' in lastResult ? lastResult : undefined,
    constraint: getZodConstraint(BiolinkUpdateSchema),
    defaultValue: {
      username: user.username || '',
      bio: user.bio || '',
      isPublic: user.isPublic ?? true,
      theme: user.theme || 'light',
    }
  });

  const handleAddSocialLink = () => {
    if (!newSocialPlatform || !newSocialUrl) return;
    
    const formData = new FormData();
    formData.append('intent', 'add-social-link');
    formData.append('platform', newSocialPlatform);
    formData.append('url', newSocialUrl);
    formData.append('isVisible', 'true');
    submit(formData, { method: 'post' });
    
    setNewSocialPlatform('');
    setNewSocialUrl('');
  };

  const handleDeleteSocialLink = (id: string) => {
    const formData = new FormData();
    formData.append('intent', 'delete-social-link');
    formData.append('linkId', id);
    submit(formData, { method: 'post' });
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    const link = socialLinks.find(l => l.id === id);
    if (!link) return;

    const formData = new FormData();
    formData.append('intent', 'update-social-link');
    formData.append('linkId', id);
    formData.append('platform', link.platform);
    formData.append('url', link.url);
    formData.append('isVisible', (!isVisible).toString());
    submit(formData, { method: 'post' });
  };

  const socialPlatforms = [
    'tiktok', 'facebook', 'instagram', 'youtube', 'twitter', 
    'tokopedia', 'shopee', 'whatsapp', 'telegram', 'linkedin', 'github', 'website'
  ];

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
        <p className="text-gray-600 mt-2">Kelola profil dan pengaturan akun Anda</p>
      </div>

      {/* Simple Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          Profil
        </button>
        <button 
          onClick={() => setActiveTab('biolink')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'biolink' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Link className="w-4 h-4" />
          Biolink
        </button>
        <button 
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'social' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Social Media
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'security' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Keamanan
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Perbarui informasi dasar profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" id={profileForm.id} onSubmit={profileForm.onSubmit}>
              <input type="hidden" name="intent" value="update-profile" />
              <div className="space-y-4">
                <div>
                  <Label htmlFor={profileFields.name.id}>Nama Lengkap</Label>
                  <Input
                    id={profileFields.name.id}
                    name={profileFields.name.name}
                    defaultValue={profileFields.name.initialValue}
                  />
                  {profileFields.name.errors && (
                    <p className="text-sm text-red-600 mt-1">{profileFields.name.errors}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor={profileFields.email.id}>Email</Label>
                  <Input
                    id={profileFields.email.id}
                    name={profileFields.email.name}
                    type="email"
                    defaultValue={profileFields.email.initialValue}
                  />
                  {profileFields.email.errors && (
                    <p className="text-sm text-red-600 mt-1">{profileFields.email.errors}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={profileFields.avatarUrl.id}>URL Avatar</Label>
                  <Input
                    id={profileFields.avatarUrl.id}
                    name={profileFields.avatarUrl.name}
                    type="url"
                    defaultValue={profileFields.avatarUrl.initialValue}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {profileFields.avatarUrl.errors && (
                    <p className="text-sm text-red-600 mt-1">{profileFields.avatarUrl.errors}</p>
                  )}
                </div>

                <Button type="submit">Simpan Perubahan</Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Biolink Tab */}
      {activeTab === 'biolink' && (
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Biolink</CardTitle>
            <CardDescription>Kustomisasi halaman biolink Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" id={biolinkForm.id} onSubmit={biolinkForm.onSubmit}>
              <input type="hidden" name="intent" value="update-biolink" />
              <div className="space-y-4">
                <div>
                  <Label htmlFor={biolinkFields.username.id}>Username</Label>
                  <Input
                    id={biolinkFields.username.id}
                    name={biolinkFields.username.name}
                    defaultValue={biolinkFields.username.initialValue}
                    placeholder="username_anda"
                  />
                  {biolinkFields.username.errors && (
                    <p className="text-sm text-red-600 mt-1">{biolinkFields.username.errors}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    URL Anda: santrionline.com/{biolinkFields.username.initialValue || 'username_anda'}
                  </p>
                </div>

                <div>
                  <Label htmlFor={biolinkFields.bio.id}>Bio</Label>
                  <Textarea
                    id={biolinkFields.bio.id}
                    name={biolinkFields.bio.name}
                    defaultValue={biolinkFields.bio.initialValue}
                    placeholder="Ceritakan tentang diri Anda..."
                    rows={3}
                  />
                  {biolinkFields.bio.errors && (
                    <p className="text-sm text-red-600 mt-1">{biolinkFields.bio.errors}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={biolinkFields.theme.id}>Tema</Label>
                  <Select name={biolinkFields.theme.name} defaultValue={biolinkFields.theme.initialValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="colorful">Colorful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id={biolinkFields.isPublic.id}
                    name={biolinkFields.isPublic.name}
                    defaultChecked={Boolean(biolinkFields.isPublic.initialValue)}
                  />
                  <Label htmlFor={biolinkFields.isPublic.id}>Tampilkan sebagai publik</Label>
                </div>

                <Button type="submit">Simpan Pengaturan Biolink</Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Social Media</CardTitle>
              <CardDescription>Tambahkan link sosial media Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>URL</Label>
                  <Input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <Button onClick={handleAddSocialLink} disabled={!newSocialPlatform || !newSocialUrl}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Sosial Media Anda</CardTitle>
              <CardDescription>Kelola link yang sudah ditambahkan</CardDescription>
            </CardHeader>
            <CardContent>
              {socialLinks.length > 0 ? (
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{link.platform}</span>
                          <Badge variant={link.isVisible ? "default" : "secondary"}>
                            {link.isVisible ? "Terlihat" : "Tersembunyi"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleVisibility(link.id, link.isVisible ?? true)}
                        >
                          {link.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSocialLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Belum ada link sosial media</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Keamanan Akun</CardTitle>
            <CardDescription>Kelola pengaturan keamanan akun Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Ganti Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Password Saat Ini</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label>Konfirmasi Password Baru</Label>
                    <Input type="password" />
                  </div>
                  <Button>Ganti Password</Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Pengaturan Privasi</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Status Profil</h4>
                    <p className="text-sm text-gray-600">Kontrol siapa yang bisa melihat profil Anda</p>
                  </div>
                  <Badge variant={user.isPublic ? "default" : "secondary"}>
                    {user.isPublic ? "Publik" : "Privat"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}