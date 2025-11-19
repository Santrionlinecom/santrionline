import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
import { registerUser } from '~/services/santri-auth.server';
import { getSessionUser } from '~/utils/santri-session.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getSessionUser(request, context);
  if (user) return redirect('/so');
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !email || !password) {
    return json({ error: 'Lengkapi semua data' }, { status: 400 });
  }

  try {
    const { cookie } = await registerUser(context, { name, email, password });
    return redirect('/so', { headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Gagal mendaftar' }, { status: 400 });
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="rounded-3xl bg-white p-6 text-blue-900 shadow-xl">
      <h2 className="text-xl font-semibold">Daftar</h2>
      <p className="text-sm text-blue-700">Buat akun baru untuk SantriOnline.</p>

      {actionData?.error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{actionData.error}</p>}

      <Form method="post" className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-blue-800">Nama</label>
          <input required name="name" className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-blue-800">Email</label>
          <input required type="email" name="email" className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-blue-800">Password</label>
          <input
            required
            type="password"
            name="password"
            minLength={6}
            className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
        </div>
        <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">
          Daftar
        </button>
      </Form>
    </div>
  );
}
