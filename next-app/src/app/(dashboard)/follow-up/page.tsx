'use client';

import { useState } from "react";

export default function FollowUpPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Assalamualaikum, mohon konfirmasi pembayaran iuran bulan ini.");
  const [result, setResult] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message })
    });
    setResult(res.ok ? "Reminder terkirim" : "Gagal mengirim reminder");
  }

  return (
    <div className="space-y-4">
      <div className="gradient-bg rounded-3xl p-4 text-white">
        <h2 className="text-xl font-semibold">Follow Up WA</h2>
        <p className="text-sm text-blue-100">Kirim pesan otomatis ke anggota (MoonWA compatible).</p>
      </div>

      <form onSubmit={submit} className="card p-4 space-y-2">
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Nomor WA tujuan"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <textarea
          className="w-full rounded-lg border p-2"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Kirim Reminder</button>
        {result ? <p className="text-sm text-blue-700">{result}</p> : null}
      </form>
    </div>
  );
}
