import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";

async function getDashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  const data = await getDashboard();
  return (
    <div className="space-y-4">
      <header className="gradient-bg rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide">SantriOnline</p>
        <h1 className="text-2xl font-bold">Dashboard Iuran & Hafalan</h1>
        <p className="text-blue-100 text-sm">Pantau progres komunitas secara real time.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard title="Total Anggota" value={data?.memberCount ?? 0} icon="👥" />
        <MetricCard title="Total Terkumpul" value={`Rp ${(data?.totalCollected ?? 0).toLocaleString("id-ID")}`} icon="💰" />
        <MetricCard title="Sudah Lunas" value={data?.paidCount ?? 0} icon="✅" />
        <MetricCard title="Terlambat" value={data?.lateCount ?? 0} icon="⚠️" />
      </div>

      <ProgressBar label="Target Bulan Ini" value={data?.paidCount ?? 0} max={(data?.memberCount ?? 1) || 1} />
    </div>
  );
}
