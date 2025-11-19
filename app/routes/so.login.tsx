import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { loginUser } from '~/services/santri-auth.server';
import { getSessionUser } from '~/utils/santri-session.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getSessionUser(request, context);
  if (user) return redirect('/so');
  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').toLowerCase();
  const password = String(formData.get('password') || '');
  const redirectTo = String(formData.get('redirectTo') || '/so');

  try {
    const { cookie } = await loginUser(context, { email, password });
    return redirect(redirectTo, { headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Gagal login' }, { status: 400 });
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [params] = useSearchParams();
  const redirectTo = params.get('redirectTo') ?? '/so';

  return (
    <div className="rounded-3xl bg-white p-6 text-blue-900 shadow-xl">
      <h2 className="text-xl font-semibold">Login</h2>
      <p className="text-sm text-blue-700">Masuk dengan email dan password.</p>

      {actionData?.error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{actionData.error}</p>}

      <Form method="post" className="mt-4 space-y-3">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label className="text-sm text-blue-800">Email</label>
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-blue-800">Password</label>
          <input
            required
            name="password"
            type="password"
            className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
        </div>
        <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">
          Login
        </button>
      </Form>

      <div className="mt-4 text-sm">
        <a href="/so/auth/google" className="flex w-full justify-center rounded-2xl bg-white px-4 py-2 text-blue-900 shadow">
          Login dengan Google
        </a>
      </div>
    </div>
  );
}
