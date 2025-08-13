import * as React from 'react';
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, Link, useFetcher, useRevalidator } from '@remix-run/react';
// Server-only modules moved to dynamic imports within loader/action
import { certificate, user } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Eye,
  Download,
  X,
} from 'lucide-react';

type Achievement = {
  target?: string;
  score?: number | string;
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Sertifikat - Santri Online' },
    {
      name: 'description',
      content: 'Panel admin untuk menyetujui dan mengelola sertifikat santri.',
    },
  ];
};

// Helper sementara untuk ambil ID admin (TODO: integrasi session real)
function getAdminId() {
  return 'admin-mock-1';
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);
  // Ambil semua sertifikat (bisa di-paginate nanti)
  const rows = await db
    .select({
      id: certificate.id,
      userId: certificate.userId,
      status: certificate.status,
      totalJuz: certificate.totalJuz,
      totalScore: certificate.totalScore,
      achievementsJson: certificate.achievementsJson,
      completedBooksJson: certificate.completedBooksJson,
      createdAt: certificate.createdAt,
      approvedAt: certificate.approvedAt,
      approvedBy: certificate.approvedBy,
      rejectReason: certificate.rejectReason,
      certificateCode: certificate.certificateCode,
      userName: user.name,
    })
    .from(certificate)
    .leftJoin(user, eq(certificate.userId, user.id));

  const mapped = rows.map((r) => {
    let achievements: Achievement[] = [];
    let completedBooks: string[] = [];
    try {
      if (r.achievementsJson) achievements = JSON.parse(r.achievementsJson);
    } catch {
      /* ignore JSON parse errors */
    }
    try {
      if (r.completedBooksJson) completedBooks = JSON.parse(r.completedBooksJson);
    } catch {
      /* ignore JSON parse errors */
    }
    return {
      id: r.id,
      status: r.status,
      certificateCode: r.certificateCode,
      santri: {
        name: r.userName || 'Tidak diketahui',
        nisn: r.userId.slice(0, 10),
        totalJuz: r.totalJuz,
        totalScore: r.totalScore,
        achievements,
        completedBooks,
        submittedDate: new Date(r.createdAt).toISOString().slice(0, 10),
        verificationUrl:
          r.certificateCode && r.status === 'approved'
            ? `/verify/sertifikat/${r.certificateCode}`
            : undefined,
      },
      approvedDate: r.approvedAt ? new Date(r.approvedAt).toISOString().slice(0, 10) : undefined,
      approvedBy: r.approvedBy || undefined,
      rejectReason: r.rejectReason || undefined,
    };
  });

  const pendingCertificates = mapped.filter((c) => c.status === 'pending');
  const approvedCertificates = mapped.filter((c) => c.status === 'approved');

  return json({
    pendingCertificates,
    approvedCertificates,
    stats: {
      totalPending: pendingCertificates.length,
      totalApproved: approvedCertificates.length,
      totalThisMonth: mapped.filter(
        (c) => new Date(c.santri.submittedDate).getMonth() === new Date().getMonth(),
      ).length,
    },
  });
}

// Action: approve / reject sertifikat (mock). Nanti ganti dengan operasi DB / Drizzle.
export async function action({ request, context }: ActionFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  await requireAdminUserId(request, context);
  const formData = await request.formData();
  const intent = formData.get('intent');
  const certId = formData.get('certificateId')?.toString();
  if (!certId)
    return json({ status: 'error', message: 'certificateId diperlukan' }, { status: 400 });
  const db = getDb(context);

  // Pastikan sertifikat ada dan masih pending saat operasi
  const existing = await db.select().from(certificate).where(eq(certificate.id, certId));
  if (!existing.length)
    return json({ status: 'error', message: 'Sertifikat tidak ditemukan' }, { status: 404 });
  const row = existing[0];

  if (intent === 'approve') {
    if (row.status !== 'pending')
      return json({ status: 'error', message: 'Status tidak valid' }, { status: 400 });
    await db
      .update(certificate)
      .set({ status: 'approved', approvedBy: getAdminId(), approvedAt: new Date() })
      .where(eq(certificate.id, certId));
    return json({ status: 'ok' });
  }
  if (intent === 'reject') {
    if (row.status !== 'pending')
      return json({ status: 'error', message: 'Status tidak valid' }, { status: 400 });
    const reason = formData.get('reason')?.toString() || 'Tidak ada alasan';
    await db
      .update(certificate)
      .set({ status: 'rejected', rejectReason: reason, approvedAt: new Date() })
      .where(eq(certificate.id, certId));
    return json({ status: 'ok' });
  }
  return json({ status: 'ignored' });
}

export default function AdminSertifikat() {
  const { pendingCertificates, approvedCertificates, stats } = useLoaderData<typeof loader>();
  const approveFetcher = useFetcher();
  const rejectFetcher = useFetcher();
  const revalidator = useRevalidator();

  const submitApprove = (id: string) => {
    if (approveFetcher.state !== 'idle') return;
    approveFetcher.submit({ intent: 'approve', certificateId: id }, { method: 'post' });
  };

  const submitReject = (id: string) => {
    if (rejectFetcher.state !== 'idle') return;
    const reason = window.prompt('Alasan penolakan (opsional):', 'Belum memenuhi standar');
    rejectFetcher.submit(
      { intent: 'reject', certificateId: id, reason: reason || '' },
      { method: 'post' },
    );
  };

  React.useEffect(() => {
    const d = approveFetcher.data as { status?: string };
    if (approveFetcher.state === 'idle' && d?.status === 'ok') revalidator.revalidate();
  }, [approveFetcher.state, approveFetcher.data, revalidator]);
  React.useEffect(() => {
    const d = rejectFetcher.data as { status?: string };
    if (rejectFetcher.state === 'idle' && d?.status === 'ok') revalidator.revalidate();
  }, [rejectFetcher.state, rejectFetcher.data, revalidator]);

  const CertificateCard = ({
    certificate,
  }: {
    certificate: {
      id: string;
      status: string;
      certificateCode: string | null;
      santri: {
        name: string;
        nisn: string;
        totalJuz: number;
        totalScore: number;
        achievements: Achievement[];
        completedBooks: string[];
        submittedDate: string;
      };
      approvedDate?: string;
      rejectReason?: string;
    };
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg">{certificate.santri.name}</CardTitle>
              <p className="text-sm text-muted-foreground">NISN: {certificate.santri.nisn}</p>
            </div>
          </div>
          <Badge variant={certificate.status === 'pending' ? 'secondary' : 'default'}>
            {certificate.status === 'pending' ? (
              <>
                <Clock className="w-3 h-3 mr-1" />
                Menunggu
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Disetujui
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Total Juz</p>
            <p className="font-bold text-blue-600">{certificate.santri.totalJuz}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Nilai</p>
            <p className="font-bold text-green-600">{certificate.santri.totalScore}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">Kitab</p>
            <p className="font-bold text-purple-600">{certificate.santri.completedBooks.length}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-sm">Pencapaian Terbaru:</h4>
          {certificate.santri.achievements.slice(-2).map((achievement, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
            >
              <span>{achievement.target ?? 'Tidak ada target'}</span>
              <Badge variant="outline">{String(achievement.score ?? 0)}/100</Badge>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Diajukan: {new Date(certificate.santri.submittedDate).toLocaleDateString('id-ID')}
        </p>

        {certificate.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              disabled={approveFetcher.state !== 'idle'}
              onClick={() => submitApprove(certificate.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {approveFetcher.state !== 'idle' ? 'Memproses...' : 'Setujui'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={rejectFetcher.state !== 'idle'}
              onClick={() => submitReject(certificate.id)}
            >
              <X className="w-4 h-4 mr-1" />
              {rejectFetcher.state !== 'idle' ? 'Memproses...' : 'Tolak'}
            </Button>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              Lihat Detail
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
        {certificate.status === 'rejected' && certificate.rejectReason && (
          <p className="mt-3 text-xs text-red-600">Alasan: {certificate.rejectReason}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Sertifikat</h1>
              <p className="text-muted-foreground">
                Kelola persetujuan sertifikat dan raport santri
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu Persetujuan</p>
                  <p className="text-2xl font-bold">{stats.totalPending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sudah Disetujui</p>
                  <p className="text-2xl font-bold">{stats.totalApproved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bulan Ini</p>
                  <p className="text-2xl font-bold">{stats.totalThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Certificates */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Menunggu Persetujuan ({stats.totalPending})</h2>
          {pendingCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Semua Terverifikasi!</h3>
                <p className="text-muted-foreground">
                  Tidak ada sertifikat yang menunggu persetujuan saat ini.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Approved Certificates */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Sudah Disetujui ({stats.totalApproved})</h2>
          {approvedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedCertificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Sertifikat</h3>
                <p className="text-muted-foreground">Belum ada sertifikat yang disetujui.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
