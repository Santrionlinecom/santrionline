import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getSantriDb, payments, members, appSettings } from '~/db/santri-app.server';
import { requireRole } from '~/utils/santri-session.server';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

const bulanIndex = [
  'januari',
  'februari',
  'maret',
  'april',
  'mei',
  'juni',
  'juli',
  'agustus',
  'september',
  'oktober',
  'november',
  'desember',
];

function getMonthIndex(bulan: string) {
  const idx = bulanIndex.indexOf(bulan.toLowerCase());
  return idx >= 0 ? idx : new Date().getUTCMonth();
}

function resolveStatus(
  tanggalBayar: string | null,
  settings: { tanggalJatuhTempo: number; masaTenggangHari: number },
  bulan: string,
  tahun: number,
) {
  if (tanggalBayar) return 'LUNAS';
  const bulanIdx = getMonthIndex(bulan);
  const jatuhTempo = new Date(Date.UTC(tahun, bulanIdx, settings.tanggalJatuhTempo));
  const batas = new Date(jatuhTempo);
  batas.setUTCDate(jatuhTempo.getUTCDate() + settings.masaTenggangHari);
  return new Date() > batas ? 'TERLAMBAT' : 'BELUM';
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
  await requireRole(request, context, ['ADMIN']);
  const db = getSantriDb(context);
  const url = new URL(request.url);
  const bulan = url.searchParams.get('bulan') || new Date().toLocaleString('id-ID', { month: 'long' });
  const tahun = Number(url.searchParams.get('tahun') || new Date().getFullYear());
  const metode = url.searchParams.get('metode');
  const memberId = url.searchParams.get('memberId');

  const settings = await ensureSettings(context);
  const memberList = await db.select().from(members).orderBy(members.name);

  const whereClauses = [eq(payments.bulan, bulan), eq(payments.tahun, tahun)];
  if (metode) whereClauses.push(eq(payments.metode, metode));
  if (memberId) whereClauses.push(eq(payments.memberId, memberId));

  const list = await db
    .select({ payment: payments, member: members })
    .from(payments)
    .leftJoin(members, eq(payments.memberId, members.id))
    .where(whereClauses.length > 1 ? and(...whereClauses) : whereClauses[0]);

  const formatted = list.map(({ payment, member }) => ({
    ...payment,
    memberName: member?.name ?? 'Tanpa nama',
    status: resolveStatus(payment.tanggalBayar, settings, bulan, tahun),
  }));

  const totalBulan = formatted.reduce((sum, p) => sum + (p.nominal ?? 0), 0);

  return json({ bulan, tahun, metode, memberId, settings, payments: formatted, members: memberList, totalBulan });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireRole(request, context, ['ADMIN']);
  const formData = await request.formData();
  const memberId = String(formData.get('memberId'));
  const bulan = String(formData.get('bulan'));
  const tahun = Number(formData.get('tahun'));
  const nominal = Number(formData.get('nominal'));
  const metode = String(formData.get('metode')) as 'cash' | 'transfer';
  const catatan = String(formData.get('catatan') || '');
  const tanggalBayar = formData.get('tanggalBayar') ? String(formData.get('tanggalBayar')) : null;

  await getSantriDb(context).insert(payments).values({
    id: nanoid(),
    memberId,
    bulan,
    tahun,
    nominal,
    metode,
    catatan,
    tanggalBayar,
  });

  return redirect('/so/bayar');
}

export default function BayarPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h2 className="text-lg font-semibold">Input Pembayaran</h2>
        <Form method="post" className="mt-3 grid gap-3 md:grid-cols-3">
          <select name="memberId" required className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
            <option value="">Pilih anggota</option>
            {data.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input name="bulan" defaultValue={data.bulan} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <input
              name="tahun"
              type="number"
              defaultValue={data.tahun}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
            />
          </div>
          <input
            name="tanggalBayar"
            type="date"
            className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
          <input
            name="nominal"
            type="number"
            defaultValue={data.settings.nominalIuranPerBulan}
            className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
          <select name="metode" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
            <option value="cash">Cash</option>
            <option value="transfer">Transfer</option>
          </select>
          <input name="catatan" placeholder="Catatan" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
          <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow md:col-span-3">Simpan Pembayaran</button>
        </Form>
      </div>

      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Pembayaran bulan {data.bulan}</h3>
            <p className="text-sm text-blue-700">Total terkumpul {formatCurrency(data.totalBulan)}</p>
          </div>
          <Form method="get" className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <input type="text" name="bulan" defaultValue={data.bulan} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <input
              type="number"
              name="tahun"
              defaultValue={data.tahun}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
            />
            <select name="metode" defaultValue={data.metode ?? ''} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
              <option value="">Semua metode</option>
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
            </select>
            <select name="memberId" defaultValue={data.memberId ?? ''} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
              <option value="">Semua anggota</option>
              {data.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow md:col-span-4">Filter</button>
          </Form>
        </div>

        <div className="mt-4 space-y-2">
          {data.payments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.memberName}</p>
                  <p className="text-sm text-blue-700">
                    {item.bulan} {item.tahun} · {item.metode} · {formatCurrency(item.nominal)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    item.status === 'LUNAS'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'TERLAMBAT'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              {item.catatan && <p className="mt-1 text-sm text-blue-800">{item.catatan}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
