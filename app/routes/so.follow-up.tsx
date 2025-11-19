import { json } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { getSantriDb, members, payments, appSettings } from '~/db/santri-app.server';
import { requireRole } from '~/utils/santri-session.server';
import { sendWhatsappBatch } from '~/services/whatsapp.server';

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
  payment: { tanggalBayar: string | null } | undefined,
  settings: { tanggalJatuhTempo: number; masaTenggangHari: number },
  bulan: string,
  tahun: number,
) {
  if (payment?.tanggalBayar) return 'LUNAS';
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
  const bulan = new URL(request.url).searchParams.get('bulan') || new Date().toLocaleString('id-ID', { month: 'long' });
  const tahun = Number(new URL(request.url).searchParams.get('tahun') || new Date().getFullYear());
  const db = getSantriDb(context);
  const settings = await ensureSettings(context);
  const memberList = await db.select().from(members).where(eq(members.statusAktif, 1));
  const paymentList = await db.select().from(payments).where(eq(payments.bulan, bulan));
  const paymentMap = new Map(paymentList.map((p) => [`${p.memberId}-${p.tahun}`, p] as const));

  const statuses = memberList.map((member) => {
    const payment = paymentMap.get(`${member.id}-${tahun}`);
    const status = resolveStatus(payment, settings, bulan, tahun);
    return {
      member,
      status,
    };
  });

  const targets = statuses.filter((s) => s.status !== 'LUNAS');

  return json({ bulan, tahun, targets, settings });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireRole(request, context, ['ADMIN']);
  const formData = await request.formData();
  const bulan = String(formData.get('bulan'));
  const tahun = Number(formData.get('tahun'));
  const contextSettings = await ensureSettings(context);
  const db = getSantriDb(context);
  const memberList = await db.select().from(members).where(eq(members.statusAktif, 1));
  const paymentList = await db.select().from(payments).where(eq(payments.bulan, bulan));
  const paymentMap = new Map(paymentList.map((p) => [`${p.memberId}-${p.tahun}`, p] as const));

  const messages = memberList
    .map((member) => {
      const payment = paymentMap.get(`${member.id}-${tahun}`);
      const status = resolveStatus(payment, contextSettings, bulan, tahun);
      if (status === 'LUNAS' || !member.phoneNumber) return null;
      return {
        to: member.phoneNumber,
        message: `Assalamu'alaikum ${member.name}.
Ini pengingat iuran bulan ${bulan} ${tahun} sebesar Rp ${contextSettings.nominalIuranPerBulan}.
Status saat ini: ${status}.
Mohon segera melakukan pembayaran. Terima kasih. 🙏`,
      };
    })
    .filter(Boolean) as { to: string; message: string }[];

  const result = await sendWhatsappBatch(context, messages);
  return json({ success: true, ...result });
}

export default function FollowUpPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h2 className="text-lg font-semibold">Follow Up WhatsApp</h2>
        <p className="text-sm text-blue-700">Kirim pengingat ke anggota yang belum bayar atau terlambat.</p>
        <Form method="post" className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex gap-2">
            <input name="bulan" defaultValue={data.bulan} className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <input
              name="tahun"
              type="number"
              defaultValue={data.tahun}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
            />
          </div>
          <button className="rounded-2xl bg-green-600 px-4 py-2 text-white shadow">Kirim Pengingat</button>
        </Form>
        {actionData?.success && (
          <p className="mt-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
            Pesan terkirim: {actionData.success} · Gagal: {actionData.failed}
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h3 className="text-lg font-semibold">Target bulan {data.bulan}</h3>
        <div className="mt-3 space-y-2">
          {data.targets.map((target) => (
            <div key={target.member.id} className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <div>
                <p className="font-semibold">{target.member.name}</p>
                <p className="text-sm text-blue-700">{target.member.phoneNumber || 'Tanpa nomor'}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  target.status === 'TERLAMBAT'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {target.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
