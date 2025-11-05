import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
// server-only imports in loader
import { dompet_santri, user_hafalan_quran, quran_surah, karya, type AppRole } from '~/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { log } from '~/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import {
  Wallet,
  BookCheck,
  TrendingUp,
  Star,
  Award,
  Target,
  BookOpen,
  // Heart, (unused)
  ShoppingBag,
  PlusCircle,
  ArrowRight,
  Activity,
  Trophy,
  Zap,
  // Eye (unused)
} from 'lucide-react';

type UserFromContext = {
  user: {
    id: string;
    name: string;
    email: string;
    role: AppRole;
  };
};

type WalletInfo = { dincoinBalance: number; dircoinBalance: number } | null;
type HafalanSummary = {
  totalSurahs: number;
  completedSurahs: number;
  totalProgress: number;
  totalAyahs: number;
} | null;
type KaryaSummary = { id: string | number; title: string; price: number; createdAt: Date | string };

function extractError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e && 'message' in e) {
    const msg = (e as { message?: unknown }).message;
    return typeof msg === 'string' ? msg : String(msg);
  }
  return String(e);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUser } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const { id: userId } = await requireUser(request, context);
  const db = getDb(context);
  const errors: Array<{ step: string; error: string }> = [];

  // Wallet
  let wallet: WalletInfo = null;
  try {
    const walletResult = await db.query.dompet_santri.findFirst({
      where: eq(dompet_santri.userId, userId),
      columns: { dincoinBalance: true, dircoinBalance: true },
    });
    wallet = walletResult ?? null;
  } catch (e: unknown) {
    const msg = extractError(e);
    errors.push({ step: 'wallet', error: msg });
    log.error?.('dashboard.index.wallet_error', { userId, error: msg });
  }

  // Hafalan summary
  let hafalanData: HafalanSummary = null;
  try {
    const hafalanSummary = await db
      .select({
        totalSurahs: sql<number>`count(*)`,
        completedSurahs: sql<number>`count(case when ${user_hafalan_quran.completedAyah} = ${quran_surah.totalAyah} then 1 end)`,
        totalProgress: sql<number>`sum(${user_hafalan_quran.completedAyah})`,
        totalAyahs: sql<number>`sum(${quran_surah.totalAyah})`,
      })
      .from(user_hafalan_quran)
      .leftJoin(quran_surah, eq(user_hafalan_quran.surahId, quran_surah.id))
      .where(eq(user_hafalan_quran.userId, userId));
    hafalanData = (hafalanSummary && hafalanSummary[0]) || null;
  } catch (e: unknown) {
    const msg = extractError(e);
    errors.push({ step: 'hafalan', error: msg });
    log.error?.('dashboard.index.hafalan_error', { userId, error: msg });
  }

  // Recent karya
  let recentKarya: KaryaSummary[] = [];
  try {
    recentKarya = await db
      .select({ id: karya.id, title: karya.title, price: karya.price, createdAt: karya.createdAt })
      .from(karya)
      .where(eq(karya.authorId, userId))
      .orderBy(desc(karya.createdAt))
      .limit(3);
  } catch (e: unknown) {
    const msg = extractError(e);
    errors.push({ step: 'karya', error: msg });
    log.error?.('dashboard.index.karya_error', { userId, error: msg });
  }

  // Calculate percentage based on completed surahs out of 114 total surahs in Quran
  const surahProgressPercentage = hafalanData?.completedSurahs
    ? Math.round((hafalanData.completedSurahs / 114) * 100)
    : 0;

  return json({
    wallet: {
      dincoin: wallet?.dincoinBalance ?? 0,
      dircoin: wallet?.dircoinBalance ?? 0,
    },
    hafalan: {
      completedSurahs: hafalanData?.completedSurahs ?? 0,
      totalSurahs: 114, // Total surahs in Quran
      progressPercentage: surahProgressPercentage, // Use surah-based percentage
      totalProgress: hafalanData?.totalProgress ?? 0,
      totalAyahs: hafalanData?.totalAyahs ?? 0,
    },
    recentKarya,
    partialErrors: errors.length ? errors : undefined,
  });
}

export default function DashboardIndexPage() {
  const { wallet, hafalan, recentKarya } = useLoaderData<typeof loader>();
  // context user currently unused; retain hook call if future personalization needed
  useOutletContext<UserFromContext>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const quickActions = [
    {
      title: 'Lanjutkan Hafalan',
      description: 'Tambah progress hafalan Al-Quran',
      icon: BookOpen,
      href: '/dashboard/hafalan',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upload Karya',
      description: 'Bagikan karya kreatif Anda',
      icon: PlusCircle,
      href: '/dashboard/karyaku',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Eksplor Marketplace',
      description: 'Temukan karya islami terbaru',
      icon: ShoppingBag,
      href: '/marketplace',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Top Up Dompet',
      description: 'Isi saldo DinCoin/DirCoin',
      icon: Wallet,
      href: '/dashboard/dompet',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const achievements = [
    {
      title: 'First Surah',
      description: 'Selesaikan hafalan surat pertama',
      icon: Award,
      unlocked: hafalan.completedSurahs > 0,
      progress: Math.min(hafalan.completedSurahs, 1),
    },
    {
      title: 'Marketplace Contributor',
      description: 'Upload karya pertama Anda ke marketplace',
      icon: ShoppingBag,
      unlocked: recentKarya.length > 0,
      progress: Math.min(recentKarya.length, 1),
    },
    {
      title: 'Creative Soul',
      description: 'Upload 3 karya ke marketplace',
      icon: Star,
      unlocked: recentKarya.length >= 3,
      progress: Math.min(recentKarya.length / 3, 1),
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Dompet</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {wallet.dincoin.toLocaleString()}{' '}
                <span className="text-xs text-muted-foreground">DIN</span>
              </div>
              <p className="text-xs text-muted-foreground">
                + {wallet.dircoin.toLocaleString()} DIR
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                <Link to="/dashboard/dompet">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Kelola Dompet
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progres Hafalan</CardTitle>
              <BookCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{hafalan.completedSurahs}/114</div>
              <p className="text-xs text-muted-foreground mb-2">Surat Selesai Dihafal</p>
              <Progress value={hafalan.progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {hafalan.progressPercentage}% completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Karya Aktif</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{recentKarya.length}</div>
              <p className="text-xs text-muted-foreground">Karya di Marketplace</p>
              <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                <Link to="/dashboard/karyaku">
                  <PlusCircle className="w-3 h-3 mr-1" />
                  Upload Karya
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kontribusi Marketplace</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{recentKarya.length}</div>
              <p className="text-xs text-muted-foreground">Karya yang diunggah</p>
              <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                <Link to="/dashboard/karyaku">
                  <PlusCircle className="w-3 h-3 mr-1" />
                  Kelola Karya
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Akses cepat ke fitur yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Fitur komunitas telah dinonaktifkan. Fokuskan kontribusi Anda melalui marketplace
                  karya.
                </p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <Link to="/marketplace">Lihat Marketplace</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <achievement.icon
                      className={`w-5 h-5 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <Progress value={achievement.progress * 100} className="h-1 mt-1" />
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Works & Learning Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Works */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Karya Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentKarya.length > 0 ? (
                recentKarya.map((karya) => (
                  <div
                    key={karya.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{karya.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {karya.price.toLocaleString()} DIN
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs">
                      published
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <PlusCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Belum ada karya yang diupload</p>
                  <Button size="sm" variant="outline" className="mt-2" asChild>
                    <Link to="/dashboard/karyaku">Upload Karya Pertama</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Learning Progress */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Progress Hafalan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {hafalan.progressPercentage}%
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {hafalan.completedSurahs} dari 114 surat selesai
                </p>
                <Progress value={hafalan.progressPercentage} className="h-3 mb-4" />
                <Button size="sm" variant="outline" asChild>
                  <Link to="/dashboard/hafalan">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Lanjutkan Hafalan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Progress Detail */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progress Pembelajaran
            </CardTitle>
            <CardDescription>Ringkasan detail kemajuan hafalan Al-Quran Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{hafalan.totalProgress}</div>
                <p className="text-sm text-muted-foreground">Ayat Dihafal</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <BookCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{hafalan.completedSurahs}</div>
                <p className="text-sm text-muted-foreground">Surat Selesai</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">
                  {hafalan.progressPercentage}%
                </div>
                <p className="text-sm text-muted-foreground">Progress Total</p>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link to="/dashboard/hafalan">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lanjutkan Hafalan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
