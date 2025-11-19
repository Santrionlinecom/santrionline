import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  getSantriDb,
  hafalanSessions,
  surahs,
  type Role,
} from '~/db/santri-app.server';
import { requireUser } from '~/utils/santri-session.server';

const seedSurahs = [
  { namaSurat: 'Al-Fatihah', juz: 1, jumlahAyat: 7, nomorUrutGlobal: 1 },
  { namaSurat: 'Al-Baqarah', juz: 1, jumlahAyat: 286, nomorUrutGlobal: 2 },
  { namaSurat: 'Al-Imran', juz: 3, jumlahAyat: 200, nomorUrutGlobal: 3 },
  { namaSurat: 'An-Nisa', juz: 4, jumlahAyat: 176, nomorUrutGlobal: 4 },
  { namaSurat: 'Al-Maidah', juz: 6, jumlahAyat: 120, nomorUrutGlobal: 5 },
];

async function ensureSurahs(context: LoaderFunctionArgs['context']) {
  const db = getSantriDb(context);
  const existing = await db.query.surahs.findMany({ limit: 5 });
  if (existing.length > 0) return existing;
  await db.insert(surahs).values(seedSurahs);
  return db.query.surahs.findMany();
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  const db = getSantriDb(context);
  const surahList = await ensureSurahs(context);

  const riwayat = await db
    .select({ session: hafalanSessions, surah: surahs })
    .from(hafalanSessions)
    .leftJoin(surahs, eq(hafalanSessions.surahId, surahs.id))
    .where(eq(hafalanSessions.santriId, user.id));

  const pending = user.role === 'SANTRI'
    ? []
    : await db
        .select({ session: hafalanSessions, surah: surahs })
        .from(hafalanSessions)
        .leftJoin(surahs, eq(hafalanSessions.surahId, surahs.id))
        .where(eq(hafalanSessions.status, 'PENDING'));

  return json({ user, surahList, riwayat, pending });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const user = await requireUser(request, context);
  const formData = await request.formData();
  const intent = String(formData.get('intent'));
  const db = getSantriDb(context);

  if (intent === 'create') {
    const tanggal = String(formData.get('tanggal'));
    const surahId = Number(formData.get('surahId'));
    const ayatMulai = Number(formData.get('ayatMulai'));
    const ayatSelesai = Number(formData.get('ayatSelesai'));
    const catatan = String(formData.get('catatan') || '');
    await db.insert(hafalanSessions).values({
      id: nanoid(),
      santriId: user.id,
      tanggal,
      surahId,
      ayatMulai,
      ayatSelesai,
      status: 'PENDING',
      catatan,
    });
    return redirect('/so/hafalan');
  }

  if (intent === 'approve' || intent === 'reject') {
    const allowed: Role[] = ['USTADZ', 'ADMIN'];
    if (!allowed.includes(user.role)) {
      throw redirect('/so');
    }
    const id = String(formData.get('id'));
    const catatan = String(formData.get('catatan') || '');
    await db
      .update(hafalanSessions)
      .set({
        status: intent === 'approve' ? 'APPROVED' : 'REJECTED',
        ustadzId: user.id,
        catatan,
      })
      .where(eq(hafalanSessions.id, id));
    return redirect('/so/hafalan');
  }

  return json({ error: 'Intent tidak dikenali' }, { status: 400 });
}

export default function HafalanPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const isSantri = data.user.role === 'SANTRI';

  return (
    <div className="space-y-4">
      {isSantri && (
        <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
          <h2 className="text-lg font-semibold">Kirim Hafalan</h2>
          {actionData?.error && <p className="mt-2 rounded-xl bg-red-50 p-2 text-sm text-red-700">{actionData.error}</p>}
          <Form method="post" className="mt-3 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="intent" value="create" />
            <input
              type="date"
              name="tanggal"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
            />
            <select name="surahId" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2">
              {data.surahList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.namaSurat} (Juz {s.juz})
                </option>
              ))}
            </select>
            <input name="ayatMulai" type="number" placeholder="Ayat mulai" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <input name="ayatSelesai" type="number" placeholder="Ayat selesai" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <input name="catatan" placeholder="Catatan (opsional)" className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
            <button className="md:col-span-2 rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">Kirim untuk disetujui</button>
          </Form>
        </div>
      )}

      {!isSantri && (
        <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
          <h3 className="text-lg font-semibold">Persetujuan Hafalan</h3>
          <div className="mt-3 space-y-2">
            {data.pending.map(({ session, surah }) => (
              <div key={session.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                <p className="font-semibold">{surah?.namaSurat} · {session.ayatMulai}-{session.ayatSelesai}</p>
                <p className="text-sm text-blue-700">{session.tanggal}</p>
                <Form method="post" className="mt-2 flex flex-col gap-2 md:flex-row">
                  <input type="hidden" name="id" value={session.id} />
                  <input name="catatan" placeholder="Catatan" className="flex-1 rounded-2xl border border-blue-100 bg-white px-3 py-2" />
                  <button name="intent" value="approve" className="rounded-2xl bg-green-600 px-3 py-2 text-white shadow">
                    Approve
                  </button>
                  <button name="intent" value="reject" className="rounded-2xl bg-red-500 px-3 py-2 text-white shadow">
                    Reject
                  </button>
                </Form>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h3 className="text-lg font-semibold">Riwayat Hafalan</h3>
        <div className="mt-3 space-y-2">
          {data.riwayat.map(({ session, surah }) => (
            <div key={session.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{surah?.namaSurat} · {session.ayatMulai}-{session.ayatSelesai}</p>
                  <p className="text-sm text-blue-700">{session.tanggal}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    session.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              {session.catatan && <p className="mt-1 text-sm text-blue-800">{session.catatan}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
