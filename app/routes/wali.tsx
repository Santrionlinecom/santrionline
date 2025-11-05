import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/lib/session.server';
import { canViewSantriProgress } from '~/lib/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canViewSantriProgress(user.role)) {
    return json({ error: 'Portal wali hanya untuk wali santri atau pengelola' }, { status: 403 });
  }
  return json({ role: user.role });
}

export default function WaliPortalPage() {
  const data = useLoaderData<typeof loader>();

  if ('error' in data) {
    return (
      <div className="container mx-auto max-w-4xl py-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portal Wali Santri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{data.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { role } = data;

  return (
    <div className="container mx-auto max-w-4xl py-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portal Wali Santri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Halaman ini menampilkan ringkasan progres hafalan, riwayat ujian, dan kehadiran anak
            Anda. Gunakan menu Tahfidz untuk melihat grafik mingguan dan hubungi pengurus jika
            membutuhkan akses tambahan.
          </p>
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <div className="font-semibold">Akses terverifikasi</div>
            <AlertDescription>
              Anda masuk sebagai{' '}
              <span className="font-semibold text-primary">{role.replace('_', ' ')}</span>. Silakan
              gunakan menu dashboard untuk melihat detail progres hafalan dan laporan lainnya.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
