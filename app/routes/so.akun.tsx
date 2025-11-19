import { json } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/utils/santri-session.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await requireUser(request, context);
  return json({ user });
}

export default function AkunPage() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h2 className="text-lg font-semibold">Akun</h2>
        <p className="text-sm text-blue-700">Kelola sesi dan lihat role.</p>
        <div className="mt-3 space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Nama:</span> {user.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
        <Form method="post" action="/so/logout" className="mt-4">
          <button className="rounded-2xl bg-red-500 px-4 py-2 text-white shadow">Logout</button>
        </Form>
      </div>
    </div>
  );
}
