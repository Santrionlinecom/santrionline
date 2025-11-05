import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
// NOTE: server-only modules dynamically imported within loader/action
import {
  user as userSchema,
  dompet_santri,
  user_hafalan_quran,
  quran_surah,
  type AppRole,
} from '~/db/schema';
import { eq, sql } from 'drizzle-orm';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import {
  User,
  BookOpen,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  TrendingUp,
  Star,
  Wallet,
} from 'lucide-react';
import { isAdminRole } from '~/lib/rbac';

export const meta: MetaFunction = () => {
  return [
    { title: 'Profil Saya - Santri Online' },
    { name: 'description', content: 'Kelola profil dan informasi pribadi Anda di Santri Online' },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);

  // Get user data
  const userData = await db.query.user.findFirst({
    where: eq(userSchema.id, userId),
  });

  if (!userData) {
    throw new Error('User not found');
  }

  // Get wallet data
  const wallet = await db.query.dompet_santri.findFirst({
    where: eq(dompet_santri.userId, userId),
  });

  // Get hafalan statistics
  const hafalanStats = await db
    .select({
      totalSurahs: sql<number>`count(*)`,
      completedSurahs: sql<number>`count(case when ${user_hafalan_quran.completedAyah} = ${quran_surah.totalAyah} then 1 end)`,
      totalAyahs: sql<number>`sum(${user_hafalan_quran.completedAyah})`,
    })
    .from(user_hafalan_quran)
    .leftJoin(quran_surah, eq(user_hafalan_quran.surahId, quran_surah.id))
    .where(eq(user_hafalan_quran.userId, userId));

  const hafalanData = hafalanStats[0];

  return json({
    user: userData,
    wallet: {
      dincoin: wallet?.dincoinBalance ?? 0,
      dircoin: wallet?.dircoinBalance ?? 0,
    },
    hafalan: {
      completedSurahs: hafalanData?.completedSurahs ?? 0,
      totalSurahs: 114, // Total surahs in Quran
      totalAyahs: hafalanData?.totalAyahs ?? 0,
    },
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'updateProfile') {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const address = formData.get('address')?.toString();
    const bio = formData.get('bio')?.toString();
    const dateOfBirth = formData.get('dateOfBirth')?.toString();
    const education = formData.get('education')?.toString();
    const institution = formData.get('institution')?.toString();

    if (!name || !email) {
      return json(
        {
          success: false,
          error: 'Nama dan email wajib diisi',
        },
        { status: 400 },
      );
    }

    try {
      await db
        .update(userSchema)
        .set({
          name,
          email,
          phone: phone || null,
          address: address || null,
          bio: bio || null,
          dateOfBirth: dateOfBirth || null,
          education: education || null,
          institution: institution || null,
          updatedAt: new Date(),
        })
        .where(eq(userSchema.id, userId));

      return json({
        success: true,
        message: 'Profil berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return json(
        {
          success: false,
          error: 'Gagal memperbarui profil',
        },
        { status: 500 },
      );
    }
  }

  return json({ success: false, error: 'Invalid intent' }, { status: 400 });
}

export default function ProfilPage() {
  const { user, wallet, hafalan } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);

  const isSubmitting = navigation.state === 'submitting';

  // Calculate profile completion percentage
  const profileFields = [
    user.name,
    user.email,
    user.phone,
    user.address,
    user.bio,
    user.dateOfBirth,
    user.education,
    user.institution,
    user.avatarUrl,
  ];
  const completedFields = profileFields.filter((field) => field && field.trim() !== '').length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  // User level calculation based on hafalan progress
  const getUserLevel = () => {
    if (hafalan.completedSurahs >= 30)
      return { level: 'Hafidz/Hafidzah', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (hafalan.completedSurahs >= 10)
      return { level: 'Mutqin', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    if (hafalan.completedSurahs >= 5)
      return { level: 'Muntaliq', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (hafalan.completedSurahs >= 1)
      return { level: 'Mubtadi', color: 'text-green-600', bgColor: 'bg-green-50' };
    return { level: 'Pemula', color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  const userLevel = getUserLevel();

  const role = (user.role ?? 'santri') as AppRole;
  const roleLabel: Record<AppRole, string> = {
    pengasuh: 'Pengasuh',
    pengurus: 'Pengurus',
    asatidz: 'Asatidz',
    wali_kelas: 'Wali Kelas',
    wali_santri: 'Wali Santri',
    santri: 'Santri',
    calon_santri: 'Calon Santri',
    admin_tech: 'Admin Tech',
    admin: 'Admin',
  };
  const roleBadgeClass = isAdminRole(role)
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : role === 'asatidz'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : role === 'pengurus' || role === 'pengasuh'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : role === 'wali_kelas' || role === 'wali_santri'
          ? 'bg-purple-100 text-purple-800 border-purple-200'
          : 'bg-gray-100 text-gray-700 border-gray-200';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="container mx-auto max-w-6xl px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Profil Saya</h1>
            <p className="text-muted-foreground">
              Kelola informasi pribadi dan pantau progress pembelajaran Anda
            </p>
          </div>
          <Button
            variant={isEditing ? 'outline' : 'default'}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Batal Edit
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit Profil
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{user.email}</p>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${userLevel.bgColor} ${userLevel.color} mb-4`}
                  >
                    {userLevel.level}
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Profil Lengkap</span>
                      <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5" />
                  Statistik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Surat Dihafal</p>
                      <p className="text-xs text-muted-foreground">
                        Total ayat: {hafalan.totalAyahs}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{hafalan.completedSurahs}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Progress Hafalan</p>
                      <p className="text-xs text-muted-foreground">Ayat tercatat</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-green-600">{hafalan.totalAyahs}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Total Koin</p>
                      <p className="text-xs text-muted-foreground">DIN + DIR</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">
                    {(wallet.dincoin + wallet.dircoin).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Info */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Info Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={`text-xs ${roleBadgeClass}`}>{roleLabel[role]}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bergabung</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Terakhir Update</span>
                  <span className="text-sm font-medium">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString('id-ID')
                      : 'Belum pernah'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Pribadi
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? 'Edit informasi profil Anda. Pastikan data yang dimasukkan akurat.'
                    : 'Informasi pribadi dan kontak Anda di Santri Online.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-6">
                  <input type="hidden" name="intent" value="updateProfile" />

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Data Dasar
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            required
                            placeholder="Masukkan nama lengkap"
                          />
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {user.name || 'Belum diisi'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            required
                            placeholder="nama@email.com"
                          />
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">{user.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            defaultValue={user.phone || ''}
                            placeholder="08xxxxxxxxxx"
                          />
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {user.phone || 'Belum diisi'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            defaultValue={user.dateOfBirth || ''}
                          />
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {user.dateOfBirth
                              ? new Date(user.dateOfBirth).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Belum diisi'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          name="address"
                          defaultValue={user.address || ''}
                          placeholder="Alamat lengkap tempat tinggal"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md min-h-[60px]">
                          {user.address || 'Belum diisi'}
                        </p>
                      )}
                    </div>
                  </div>

                  <hr className="border-border" />
                  {/* Educational Background */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Latar Belakang Pendidikan
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="education">Tingkat Pendidikan</Label>
                        {isEditing ? (
                          <Select name="education" defaultValue={user.education || ''}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat pendidikan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SD">SD/MI</SelectItem>
                              <SelectItem value="SMP">SMP/MTs</SelectItem>
                              <SelectItem value="SMA">SMA/MA</SelectItem>
                              <SelectItem value="D3">Diploma 3</SelectItem>
                              <SelectItem value="S1">Sarjana (S1)</SelectItem>
                              <SelectItem value="S2">Magister (S2)</SelectItem>
                              <SelectItem value="S3">Doktor (S3)</SelectItem>
                              <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {user.education || 'Belum diisi'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institusi/Sekolah</Label>
                        {isEditing ? (
                          <Input
                            id="institution"
                            name="institution"
                            defaultValue={user.institution || ''}
                            placeholder="Nama sekolah/universitas"
                          />
                        ) : (
                          <p className="text-sm bg-muted p-3 rounded-md">
                            {user.institution || 'Belum diisi'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Bio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Tentang Saya
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio/Deskripsi Diri</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          name="bio"
                          defaultValue={user.bio || ''}
                          placeholder="Ceritakan sedikit tentang diri Anda, tujuan belajar, atau hal menarik lainnya..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-3 rounded-md min-h-[80px]">
                          {user.bio || 'Belum ada deskripsi'}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
