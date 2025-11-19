'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AccountPage() {
  const [reg, setReg] = useState({ name: "", email: "", password: "", role: "SANTRI" });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reg)
    });
    setMessage(res.ok ? "Registrasi berhasil, silakan login" : "Registrasi gagal");
  }

  async function loginCred(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", { ...login, redirect: true });
  }

  return (
    <div className="space-y-4">
      <div className="gradient-bg rounded-3xl p-4 text-white">
        <h2 className="text-xl font-semibold">Akun</h2>
        <p className="text-sm text-blue-100">Login Google atau email & password.</p>
      </div>

      <button
        onClick={() => signIn("google")}
        className="w-full bg-white text-blue-700 border border-blue-200 rounded-lg py-2 font-semibold shadow"
      >
        Login dengan Google
      </button>

      <form onSubmit={loginCred} className="card p-4 space-y-2">
        <p className="font-semibold text-blue-700">Login manual</p>
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Email"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Password"
          type="password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Login</button>
      </form>

      <form onSubmit={register} className="card p-4 space-y-2">
        <p className="font-semibold text-blue-700">Registrasi</p>
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Nama lengkap"
          value={reg.name}
          onChange={(e) => setReg({ ...reg, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Email"
          value={reg.email}
          onChange={(e) => setReg({ ...reg, email: e.target.value })}
        />
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Password"
          type="password"
          value={reg.password}
          onChange={(e) => setReg({ ...reg, password: e.target.value })}
        />
        <select
          className="w-full rounded-lg border p-2"
          value={reg.role}
          onChange={(e) => setReg({ ...reg, role: e.target.value })}
        >
          <option value="SANTRI">Santri</option>
          <option value="USTADZ">Ustadz</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">Daftar</button>
      </form>

      {message ? <p className="text-sm text-blue-700">{message}</p> : null}
    </div>
  );
}
