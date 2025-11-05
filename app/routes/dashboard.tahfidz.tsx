import { useMemo } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getDb } from '~/db/drizzle.server';
import { requireUser } from '~/lib/session.server';
import { canViewSantriProgress } from '~/lib/rbac';
import { getSantriWeeklyProgress, listSetoran } from '~/services/tahfidz.server';
import { santri } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  if (!canViewSantriProgress(user.role) && user.role !== 'santri') {
    return json({ error: 'Tidak memiliki akses ke modul tahfidz' }, { status: 403 });
  }
  const url = new URL(request.url);
  let santriId = url.searchParams.get('santriId');
  const db = getDb(context);
  if (!santriId && user.role === 'santri') {
    const rows = await db.select().from(santri).where(eq(santri.userId, user.id)).limit(1);
    santriId = rows[0]?.id;
  }
  if (!santriId) {
    return json({ error: 'Pilih santri terlebih dahulu' }, { status: 400 });
  }
  const weeks = Number(url.searchParams.get('weeks') ?? 6);
  const weekly = await getSantriWeeklyProgress(db, santriId, weeks);
  const recent = await listSetoran(db, { santriId, status: 'validated', limit: 10 });
  return json({ weekly, recent, santriId });
}

export default function DashboardTahfidzPage() {
  const data = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();
  const isError = 'error' in data;
  const weeklyData = isError ? [] : data.weekly;

  const chartData = useMemo(
    () =>
      weeklyData.map((row) => ({
        week: row.week,
        totalSetoran: Number(row.totalSetoran ?? 0),
        totalAyat: Number(row.totalAyat ?? 0),
      })),
    [weeklyData],
  );

  if (isError) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Modul Tahfidz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{data.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recent = data.recent;

  const handleWeeksChange = (value: string) => {
    params.set('weeks', value);
    setParams(params);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Progres Tahfidz</h1>
        <p className="text-muted-foreground">
          Pantau riwayat setoran dan progres mingguan santri untuk memastikan target hafalan
          tercapai.
        </p>
      </div>

      <Tabs defaultValue="mingguan" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="mingguan">Grafik Mingguan</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Setoran</TabsTrigger>
        </TabsList>
        <TabsContent value="mingguan" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Setoran per Minggu</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rentang Minggu:</span>
                <select
                  className="rounded-md border bg-background px-2 py-1"
                  defaultValue={params.get('weeks') ?? '6'}
                  onChange={(event) => handleWeeksChange(event.target.value)}
                >
                  {[4, 6, 8, 12].map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {chartData.length ? (
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="setoran" orientation="left" width={40} />
                    <YAxis yAxisId="ayat" orientation="right" width={40} />
                    <Tooltip />
                    <Line
                      yAxisId="setoran"
                      type="monotone"
                      dataKey="totalSetoran"
                      stroke="#0f172a"
                      name="Jumlah Setoran"
                    />
                    <Line
                      yAxisId="ayat"
                      type="monotone"
                      dataKey="totalAyat"
                      stroke="#2563eb"
                      name="Total Ayat"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada data setoran yang tervalidasi.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Mingguan</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {chartData.length ? (
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalAyat" fill="#22c55e" name="Jumlah Ayat" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada data untuk ditampilkan.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="riwayat">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Setoran Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recent.length ? (
                recent.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-md border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.jenis.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        Juz {item.juz ?? '-'} • {item.surat ?? '—'} ({item.ayatFrom ?? '-'} -{' '}
                        {item.ayatTo ?? '-'})
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <Badge variant={item.status === 'validated' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.tanggal ? format(item.tanggal, 'dd MMM yyyy') : '-'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada setoran tervalidasi.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
