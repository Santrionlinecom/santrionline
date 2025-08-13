import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getDb } from "~/db/drizzle.server";
import { certificate, user } from "~/db/schema";
import { eq } from "drizzle-orm";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || data.status !== 'found') return [{ title: 'Verifikasi Sertifikat' }];
  return [
    { title: `Verifikasi Sertifikat ${(data as any).certificate.certificateCode}` },
    { name: 'description', content: `Verifikasi keaslian sertifikat milik ${(data as any).certificate.userName}.` }
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const code = params.code;
  if (!code) return json({ status: 'error', message: 'Kode sertifikat diperlukan' }, { status: 400 });
  const db = getDb(context);
  const rows = await db.select({
    id: certificate.id,
    userId: certificate.userId,
    certificateCode: certificate.certificateCode,
    status: certificate.status,
    totalJuz: certificate.totalJuz,
    totalScore: certificate.totalScore,
    approvedAt: certificate.approvedAt,
    approvedBy: certificate.approvedBy,
    userName: user.name,
  }).from(certificate).leftJoin(user, eq(certificate.userId, user.id)).where(eq(certificate.certificateCode, code));
  if (!rows.length) return json({ status: 'not_found' }, { status: 404 });
  const row = rows[0];
  if (row.status !== 'approved') return json({ status: 'unapproved' }, { status: 200 });
  return json({ status: 'found', certificate: row });
}

export default function VerifyCertificate() {
  const data = useLoaderData<typeof loader>();
  if (data.status === 'not_found') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600 font-semibold">Sertifikat tidak ditemukan.</p></div>;
  }
  if (data.status === 'unapproved') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-yellow-600 font-semibold">Sertifikat belum disetujui.</p></div>;
  }
  if (data.status !== 'found') return null;
  const c = (data as any).certificate;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center">Verifikasi Sertifikat</h1>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Kode</span><span className="font-mono font-semibold">{c.certificateCode}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Nama Santri</span><span className="font-semibold">{c.userName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total Juz</span><span>{c.totalJuz}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Nilai Rata-rata</span><span>{c.totalScore}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-semibold">Disetujui</span></div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal Disetujui</span>
            <span>{c.approvedAt ? new Date(c.approvedAt as any).toLocaleDateString('id-ID') : '-'}</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-center text-gray-500">Halaman ini membuktikan keaslian sertifikat Santri Online.</p>
      </div>
    </div>
  );
}
