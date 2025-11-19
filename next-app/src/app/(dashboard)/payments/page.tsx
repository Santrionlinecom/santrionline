'use client';

import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  month: number;
  year: number;
  status: string;
  member?: { name: string };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({ memberId: "", amount: 50000, month: 1, year: new Date().getFullYear(), status: "LUNAS" });

  async function load() {
    const res = await fetch("/api/payments");
    if (res.ok) setPayments(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount), month: Number(form.month), year: Number(form.year) })
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="gradient-bg rounded-3xl p-4 text-white">
        <h2 className="text-xl font-semibold">Pembayaran Iuran</h2>
        <p className="text-sm text-blue-100">Catat pembayaran dan statusnya.</p>
      </div>

      <form onSubmit={submit} className="card p-4 space-y-2">
        <input
          className="w-full rounded-lg border p-2"
          placeholder="ID Anggota"
          value={form.memberId}
          onChange={(e) => setForm({ ...form, memberId: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="w-full rounded-lg border p-2"
            placeholder="Bulan"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
          />
          <input
            type="number"
            className="w-full rounded-lg border p-2"
            placeholder="Tahun"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          />
        </div>
        <input
          type="number"
          className="w-full rounded-lg border p-2"
          placeholder="Nominal"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        />
        <select
          className="w-full rounded-lg border p-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="LUNAS">Lunas</option>
          <option value="BELUM">Belum</option>
          <option value="TERLAMBAT">Terlambat</option>
        </select>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Catat Pembayaran</button>
      </form>

      <div className="space-y-2">
        {payments.map((p) => (
          <div key={p.id} className="card p-3 flex justify-between">
            <div>
              <p className="font-semibold text-blue-700">{p.member?.name ?? p.id}</p>
              <p className="text-xs text-slate-500">{p.month}/{p.year}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Rp {p.amount.toLocaleString("id-ID")}</p>
              <p className="text-xs text-slate-500">{p.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
