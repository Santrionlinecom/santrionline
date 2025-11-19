'use client';

import { useEffect, useState } from "react";
import { SURAH_LIST } from "@/lib/surah";

interface Session {
  id: string;
  surahId: number;
  startAyah: number;
  endAyah: number;
  status: string;
  note?: string;
}

export default function HafalanPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [surahId, setSurahId] = useState<number>(1);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(3);
  const [note, setNote] = useState("");

  async function load() {
    const res = await fetch("/api/hafalan/sessions");
    if (res.ok) setSessions(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/hafalan/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surahId, startAyah: start, endAyah: end, userId: "self", note })
    });
    setNote("");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="gradient-bg rounded-3xl p-4 text-white">
        <h2 className="text-xl font-semibold">Hafalan 30 Juz</h2>
        <p className="text-sm text-blue-100">Checklist harian & approval ustadz.</p>
      </div>

      <form onSubmit={submit} className="card p-4 space-y-2">
        <label className="text-sm font-semibold">Pilih surat</label>
        <select
          className="w-full rounded-lg border p-2"
          value={surahId}
          onChange={(e) => setSurahId(Number(e.target.value))}
        >
          {SURAH_LIST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.arabic})
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="rounded-lg border p-2"
            placeholder="Ayat mulai"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
          <input
            type="number"
            className="rounded-lg border p-2"
            placeholder="Ayat selesai"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          />
        </div>
        <textarea
          className="w-full rounded-lg border p-2"
          rows={2}
          placeholder="Catatan untuk ustadz"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Kirim untuk approval</button>
      </form>

      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} className="card p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-700">{SURAH_LIST.find((surah) => surah.id === s.surahId)?.name}</p>
              <p className="text-xs text-slate-500">
                Ayat {s.startAyah} - {s.endAyah}
              </p>
              {s.note ? <p className="text-xs text-slate-500">Catatan: {s.note}</p> : null}
            </div>
            <span className="text-sm font-semibold text-blue-600">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
