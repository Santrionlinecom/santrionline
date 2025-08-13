import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import {
  ArrowLeft,
  Award,
  Download,
  CheckCircle,
  Clock,
  BookOpen,
  TrendingUp,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { createCertificateGenerator, type SantriData } from '~/utils/certificate-generator';
// Server-only modules imported dynamically inside loader/action to avoid bundling
import {
  certificate,
  user_hafalan_quran,
  quran_surah,
  user_progres_diniyah,
  diniyah_pelajaran,
  diniyah_kitab,
  hafalan_evaluasi,
} from '~/db/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export const meta: MetaFunction = () => {
  return [
    { title: 'Status Sertifikat - Santri Online' },
    {
      name: 'description',
      content: 'Lihat status sertifikat dan progress hafalan Anda.',
    },
  ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);
  const AYAT_PER_JUZ_APPROX = 6236 / 30;

  // Hafalan progress
  type HafRow = {
    surahId: number;
    completedAyah: number;
    totalAyah: number | null;
    name: string | null;
  };
  let hafalanRows: HafRow[] = [];
  try {
    hafalanRows = await db
      .select({
        surahId: user_hafalan_quran.surahId,
        completedAyah: user_hafalan_quran.completedAyah,
        totalAyah: quran_surah.totalAyah,
        name: quran_surah.name,
      })
      .from(user_hafalan_quran)
      .leftJoin(quran_surah, eq(user_hafalan_quran.surahId, quran_surah.id))
      .where(eq(user_hafalan_quran.userId, userId));
  } catch (error) {
    console.error('Failed to fetch hafalan rows:', error);
  }
  const totalCompletedAyat = hafalanRows.reduce((s, r) => s + r.completedAyah, 0);
  const totalJuz = Math.floor(totalCompletedAyat / AYAT_PER_JUZ_APPROX);
  const achievements = hafalanRows
    .filter((r) => r.totalAyah && r.completedAyah >= r.totalAyah)
    .map((r) => ({
      type: 'Hafalan' as const,
      target: r.name || `Surah ${r.surahId}`,
      completedDate: new Date().toISOString().slice(0, 10),
      score: 90, // placeholder
    }));

  // Diniyah progres
  let kitabCompleted: string[] = [];
  try {
    const diniyahRows = await db
      .select({
        status: user_progres_diniyah.status,
        kitabName: diniyah_kitab.name,
      })
      .from(user_progres_diniyah)
      .leftJoin(diniyah_pelajaran, eq(user_progres_diniyah.pelajaranId, diniyah_pelajaran.id))
      .leftJoin(diniyah_kitab, eq(diniyah_pelajaran.kitabId, diniyah_kitab.id))
      .where(eq(user_progres_diniyah.userId, userId));
    kitabCompleted = [
      ...new Set(
        diniyahRows
          .filter((r) => r.status === 'completed')
          .map((r) => r.kitabName)
          .filter(Boolean) as string[],
      ),
    ];
  } catch (error) {
    console.error('Failed to fetch diniyah rows:', error);
  }

  // Ambil evaluasi skor (ambil rata-rata skor hafalan_evaluasi jika ada)
  let totalScore = 0;
  try {
    const evalRows = await db
      .select({ score: hafalan_evaluasi.score })
      .from(hafalan_evaluasi)
      .where(eq(hafalan_evaluasi.userId, userId));
    if (evalRows.length) {
      totalScore = Math.round(evalRows.reduce((s, r) => s + (r.score || 0), 0) / evalRows.length);
    } else {
      totalScore = achievements.length
        ? Math.round(achievements.reduce((s, a) => s + a.score, 0) / achievements.length)
        : 0;
    }
  } catch (error) {
    console.error('Failed to fetch evaluation rows:', error);
  }

  // Latest certificate
  let latestCert: typeof certificate.$inferSelect | null = null;
  try {
    const certRows = await db.select().from(certificate).where(eq(certificate.userId, userId));

    // Safely convert unknown date-like field to epoch milliseconds
    const toEpoch = (d: unknown): number => {
      if (d instanceof Date) return d.getTime();
      if (typeof d === 'string') {
        const t = Date.parse(d);
        return Number.isNaN(t) ? 0 : t;
      }
      return 0;
    };

    latestCert = certRows.sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt))[0] ?? null;
  } catch (error) {
    console.error('Failed to fetch latest certificate:', error);
  }
  const santriData: SantriData = {
    name: 'Ahmad Fauzi',
    nisn: userId.slice(0, 10),
    totalJuz,
    completedBooks: kitabCompleted,
    achievements,
    totalScore,
    isApprovedByAdmin: latestCert?.status === 'approved',
    ...(latestCert?.status === 'approved'
      ? {
          certificateId: latestCert.certificateCode,
          approvedDate: latestCert.approvedAt
            ? new Date(latestCert.approvedAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          approvedBy: latestCert.approvedBy || 'Admin',
        }
      : {}),
    verificationUrl:
      latestCert?.status === 'approved'
        ? `${new URL(request.url).origin}/verify/sertifikat/${latestCert.certificateCode}`
        : undefined,
  };

  const nextMilestones = [
    { target: 1, label: '1 Juz', color: 'bg-green-500' },
    { target: 5, label: '5 Juz', color: 'bg-blue-500' },
    { target: 10, label: '10 Juz', color: 'bg-purple-500' },
    { target: 15, label: '15 Juz', color: 'bg-indigo-500' },
    { target: 20, label: '20 Juz', color: 'bg-pink-500' },
    { target: 30, label: 'Hafidz/Hafidzah', color: 'bg-amber-500' },
  ];
  const nextMilestone = nextMilestones.find((m) => m.target > santriData.totalJuz);
  const progressToNext = nextMilestone ? (santriData.totalJuz / nextMilestone.target) * 100 : 100;

  return json({
    santriData,
    nextMilestone,
    progressToNext,
    canRequestCertificate: santriData.totalJuz >= 1 && santriData.totalScore >= 80,
    certificateStatus: latestCert?.status || null,
    certificateMessage: latestCert?.status === 'rejected' ? latestCert.rejectReason : null,
  });
}

// Action sederhana untuk permintaan sertifikat (mock; nanti hubungkan DB)
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if (intent === 'requestCertificate') {
    const { requireUserId } = await import('~/lib/session.server');
    const { getDb } = await import('~/db/drizzle.server');
    const userId = await requireUserId(request, context);
    const db = getDb(context);
    const existing = await db.select().from(certificate).where(eq(certificate.userId, userId));
    if (existing.some((c) => c.status === 'pending')) {
      return json({ status: 'ok', message: 'Pengajuan sebelumnya masih pending.' });
    }
    if (existing.some((c) => c.status === 'approved')) {
      return json({ status: 'ok', message: 'Anda sudah memiliki sertifikat disetujui.' });
    }
    // Snapshot progres
    const progresHafalan = await db
      .select({
        completedAyah: user_hafalan_quran.completedAyah,
        totalAyah: quran_surah.totalAyah,
        surahId: user_hafalan_quran.surahId,
        name: quran_surah.name,
      })
      .from(user_hafalan_quran)
      .leftJoin(quran_surah, eq(user_hafalan_quran.surahId, quran_surah.id))
      .where(eq(user_hafalan_quran.userId, userId));
    const totalCompletedAyat = progresHafalan.reduce((s, r) => s + r.completedAyah, 0);
    const AYAT_PER_JUZ_APPROX = 6236 / 30;
    const totalJuz = Math.floor(totalCompletedAyat / AYAT_PER_JUZ_APPROX);
    const achievements = progresHafalan
      .filter((r) => r.totalAyah && r.completedAyah >= r.totalAyah)
      .map((r) => ({
        type: 'Hafalan',
        target: r.name || `Surah ${r.surahId}`,
        completedDate: new Date().toISOString().slice(0, 10),
        score: 90,
      }));
    const diniyahRows = await db
      .select({
        status: user_progres_diniyah.status,
        kitabName: diniyah_kitab.name,
      })
      .from(user_progres_diniyah)
      .leftJoin(diniyah_pelajaran, eq(user_progres_diniyah.pelajaranId, diniyah_pelajaran.id))
      .leftJoin(diniyah_kitab, eq(diniyah_pelajaran.kitabId, diniyah_kitab.id))
      .where(eq(user_progres_diniyah.userId, userId));
    const completedBooks = [
      ...new Set(
        diniyahRows
          .filter((r) => r.status === 'completed')
          .map((r) => r.kitabName)
          .filter(Boolean) as string[],
      ),
    ];
    // Hitung totalScore dari hafalan_evaluasi (snapshot) atau fallback ke achievements nilai placeholder
    let totalScore = 0;
    try {
      const evalRows = await db
        .select({ score: hafalan_evaluasi.score })
        .from(hafalan_evaluasi)
        .where(eq(hafalan_evaluasi.userId, userId));
      if (evalRows.length) {
        totalScore = Math.round(evalRows.reduce((s, r) => s + (r.score || 0), 0) / evalRows.length);
      } else {
        totalScore = achievements.length
          ? Math.round(achievements.reduce((s, a) => s + a.score, 0) / achievements.length)
          : 0;
      }
    } catch (error) {
      console.error('Failed to calculate total score for certificate request:', error);
    }
    const code = `STO-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await db.insert(certificate).values({
      id: nanoid(),
      userId,
      certificateCode: code,
      totalJuz,
      totalScore,
      achievementsJson: JSON.stringify(achievements),
      completedBooksJson: JSON.stringify(completedBooks),
      status: 'pending',
      createdAt: new Date(),
    });
    return json({ status: 'ok', message: 'Permintaan sertifikat disimpan (pending).' });
  }
  return json({ status: 'ignored' });
}

export default function DashboardSertifikat() {
  const {
    santriData,
    nextMilestone,
    progressToNext,
    canRequestCertificate,
    certificateStatus,
    certificateMessage,
  } = useLoaderData<typeof loader>();
  const requestFetcher = useFetcher<{ status: string; message?: string }>();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownloadCertificate = async () => {
    if (!santriData.isApprovedByAdmin) {
      alert('Sertifikat belum disetujui oleh admin. Silakan hubungi pengurus.');
      return;
    }

    try {
      setIsGenerating(true);
      const generator = createCertificateGenerator(santriData);
      await generator.downloadPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh sertifikat. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isRequesting = requestFetcher.state !== 'idle';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Status Sertifikat</h1>
            <p className="text-muted-foreground">
              Pantau progress hafalan dan status sertifikat Anda
            </p>
          </div>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil & Status Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Informasi Pribadi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{santriData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NISN:</span>
                    <span className="font-medium">{santriData.nisn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Hafalan:</span>
                    <Badge className="bg-blue-500">{santriData.totalJuz} Juz</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nilai Rata-rata:</span>
                    <Badge className="bg-green-500">{santriData.totalScore}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Status Sertifikat</h3>
                <div className="space-y-4">
                  {santriData.isApprovedByAdmin ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Sertifikat Disetujui</span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Sertifikat ID: {santriData.certificateId}
                      </p>
                      <p className="text-sm text-green-700 mb-3">
                        Disetujui oleh: {santriData.approvedBy}
                      </p>
                      <p className="text-sm text-green-700 mb-4">
                        Tanggal: {santriData.approvedDate}
                      </p>
                      <Button
                        onClick={handleDownloadCertificate}
                        className="w-full"
                        size="sm"
                        disabled={isGenerating}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Membuat PDF...' : 'Download Sertifikat & Raport'}
                      </Button>
                    </div>
                  ) : certificateStatus === 'pending' ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          Pengajuan Sedang Ditinjau
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Permintaan sertifikat Anda masih dalam status pending. Mohon menunggu
                        persetujuan admin.
                      </p>
                    </div>
                  ) : certificateStatus === 'rejected' ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Pengajuan Ditolak</span>
                      </div>
                      {certificateMessage && (
                        <p className="text-sm text-red-700 mb-2">Alasan: {certificateMessage}</p>
                      )}
                      <p className="text-xs text-red-600">
                        Perbaiki kekurangan lalu ajukan ulang (fitur ajukan ulang belum tersedia).
                      </p>
                    </div>
                  ) : canRequestCertificate ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">
                          Memenuhi Syarat Sertifikat
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-4">
                        Anda sudah memenuhi syarat untuk mengajukan sertifikat hafalan.
                      </p>
                      <requestFetcher.Form method="post" className="w-full">
                        <input type="hidden" name="intent" value="requestCertificate" />
                        <Button
                          type="submit"
                          variant="outline"
                          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          size="sm"
                          disabled={isRequesting}
                        >
                          <Award className="w-4 h-4 mr-2" />
                          {isRequesting ? 'Mengajukan...' : 'Ajukan Sertifikat'}
                        </Button>
                        {requestFetcher.data?.status === 'ok' && (
                          <p className="text-xs text-green-600 mt-2">
                            {requestFetcher.data.message}
                          </p>
                        )}
                      </requestFetcher.Form>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Belum Memenuhi Syarat</span>
                      </div>
                      <p className="text-sm text-red-700">
                        Minimal hafalan 1 juz dengan nilai rata-rata 80 untuk mengajukan sertifikat.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progress Menuju {nextMilestone.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current: {santriData.totalJuz} Juz</span>
                  <span>Target: {nextMilestone.target} Juz</span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">
                  {progressToNext.toFixed(1)}% menuju milestone berikutnya
                </p>
                <p className="text-sm text-center">
                  Sisa: <strong>{nextMilestone.target - santriData.totalJuz} Juz</strong> lagi untuk
                  mencapai level {nextMilestone.label}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Riwayat Pencapaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {santriData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        achievement.type === 'Hafalan' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {achievement.type === 'Hafalan' ? 'H' : 'K'}
                    </div>
                    <div>
                      <h4 className="font-semibold">{achievement.target}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{achievement.score}/100</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(achievement.completedDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Books */}
        <Card>
          <CardHeader>
            <CardTitle>Kitab & Pembelajaran yang Diselesaikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {santriData.completedBooks.map((book, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{book}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
