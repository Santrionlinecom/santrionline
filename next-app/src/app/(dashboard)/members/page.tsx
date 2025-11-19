'use client';

import { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "", role: "SANTRI" });

  async function load() {
    const res = await fetch("/api/members");
    if (res.ok) setMembers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", phone: "", address: "", role: "SANTRI" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="gradient-bg rounded-3xl p-4 text-white">
        <h2 className="text-xl font-semibold">Anggota</h2>
        <p className="text-sm text-blue-100">Tambah & kelola anggota iuran.</p>
      </div>

      <form onSubmit={submit} className="card p-4 space-y-2">
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Nama lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Nomor WA"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Alamat"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <select
          className="w-full rounded-lg border p-2"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="SANTRI">Santri</option>
          <option value="USTADZ">Ustadz</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Tambah Anggota</button>
      </form>

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="card p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-700">{m.name}</p>
              <p className="text-xs text-slate-500">{m.role}</p>
              {m.phone ? <p className="text-xs text-slate-500">WA: {m.phone}</p> : null}
            </div>
            <span className="text-sm text-slate-500">{m.address}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
