import { json } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData, Link } from '@remix-run/react';
import { and, eq, sql } from 'drizzle-orm';
import { getSantriDb, payments, appSettings, hafalanSessions, members } from '~/db/santri-app.server';
import { getSessionUser } from '~/utils/santri-session.server';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

async function ensureSettings(context: LoaderFunctionArgs['context']) {
  const db = getSantriDb(context);
  const existing = await db.query.appSettings.findFirst();
  if (existing) return existing;
  await db.insert(appSettings).values({
    judulAplikasi: 'SantriOnline App',
    nominalIuranPerBulan: 150000,
    tanggalJatuhTempo: 10,
    masaTenggangHari: 5,
  });
  return (await db.query.appSettings.findFirst())!;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getSessionUser(request, context);
  const db = getSantriDb(context);
  const now = new Date();
  const bulan = now.toLocaleString('id-ID', { month: 'long' });
  const tahun = now.getFullYear();

  const settings = await ensureSettings(context);

  const [activeMembersRow] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.statusAktif, 1));
  const activeMembers = activeMembersRow?.count ?? 0;

  const monthPayments = await db
    .select()
    .from(payments)
    .where(and(eq(payments.bulan, bulan), eq(payments.tahun, tahun)));

  const totalTerkumpul = monthPayments.reduce((sum, p) => sum + (p.nominal ?? 0), 0);
  const target = activeMembers * settings.nominalIuranPerBulan;

  const lateCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(payments)
    .where(and(eq(payments.bulan, bulan), eq(payments.tahun, tahun), sql`tanggal_bayar is null`));

  const pendingHafalanRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(hafalanSessions)
    .where(eq(hafalanSessions.status, 'PENDING'));

  return json({
    user,
    bulan,
    tahun,
    settings,
    activeMembers,
    target,
    totalTerkumpul,
    terlambat: lateCount[0]?.count ?? 0,
    pendingHafalan: pendingHafalanRow[0]?.count ?? 0,
  });
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const role = data.user?.role ?? 'SANTRI';

  return (
    <div className="space-y-4">
      {!data.user ? (
        <div className="rounded-3xl bg-white text-blue-900 p-6 shadow-xl">
          <h2 className="text-xl font-semibold">Masuk untuk mulai</h2>
          <p className="text-sm text-blue-700">Gunakan login manual atau Google untuk mengelola iuran dan hafalan.</p>
          <div className="mt-4 flex gap-3">
            <Link to="/so/login" className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">
              Login
            </Link>
            <Link to="/so/register" className="rounded-2xl bg-blue-100 px-4 py-2 text-blue-900">
              Daftar
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white text-blue-900 p-5 shadow-xl">
            <p className="text-sm text-blue-500">Target bulan {data.bulan}</p>
            <h3 className="text-2xl font-semibold">{formatCurrency(data.target)}</h3>
            <p className="text-sm text-blue-600">{data.activeMembers} anggota aktif x {formatCurrency(data.settings.nominalIuranPerBulan)}</p>
            <div className="mt-4 rounded-2xl bg-blue-50 p-3">
              <p className="text-sm text-blue-600">Terkumpul</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(data.totalTerkumpul)}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white text-blue-900 p-5 shadow-xl">
            <p className="text-sm text-blue-500">Status iuran bulan {data.bulan}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-green-50 p-3">
                <p className="text-sm text-green-700">Terlambat</p>
                <p className="text-2xl font-bold text-green-900">{data.terlambat}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="text-sm text-amber-700">Hafalan Pending</p>
                <p className="text-2xl font-bold text-amber-900">{data.pendingHafalan}</p>
              </div>
            </div>
          </div>

          {role === 'SANTRI' ? (
            <div className="rounded-3xl bg-white text-blue-900 p-5 shadow-xl md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-500">Hafalan hari ini</p>
                  <h3 className="text-2xl font-semibold">Siap setor?</h3>
                </div>
                <Link to="/so/hafalan" className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">
                  Tambah Hafalan
                </Link>
              </div>
              <p className="mt-2 text-sm text-blue-700">Kirim setor hafalan dan pantau progres 30 juz.</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white text-blue-900 p-5 shadow-xl md:col-span-2">
              <p className="text-sm text-blue-500">Ringkasan tugas</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
                <StatusPill label="Follow Up" value={data.terlambat} href="/so/follow-up" />
                <StatusPill label="Bayar" value={data.totalTerkumpul / (data.settings.nominalIuranPerBulan || 1)} href="/so/bayar" />
                <StatusPill label="Anggota" value={data.activeMembers} href="/so/anggota" />
                <StatusPill label="Hafalan" value={data.pendingHafalan} href="/so/hafalan" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link to={href} className="flex flex-col rounded-2xl bg-blue-50 p-3 text-blue-900 shadow">
      <span className="text-sm text-blue-500">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </Link>
  );
}
