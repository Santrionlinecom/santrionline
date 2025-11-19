import { json, redirect } from '@remix-run/cloudflare';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getSantriDb, members } from '~/db/santri-app.server';
import { requireRole } from '~/utils/santri-session.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  await requireRole(request, context, ['ADMIN']);
  const db = getSantriDb(context);
  const list = await db.select().from(members).orderBy(members.createdAt);
  return json({ members: list });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireRole(request, context, ['ADMIN']);
  const db = getSantriDb(context);
  const formData = await request.formData();
  const intent = String(formData.get('intent'));

  if (intent === 'create') {
    const name = String(formData.get('name') || '');
    const phoneNumber = String(formData.get('phoneNumber') || '');
    await db.insert(members).values({ id: nanoid(), name, phoneNumber, statusAktif: 1 });
    return redirect('/so/anggota');
  }

  if (intent === 'update') {
    const id = String(formData.get('id'));
    const name = String(formData.get('name') || '');
    const phoneNumber = String(formData.get('phoneNumber') || '');
    const statusAktif = formData.get('statusAktif') === 'on' ? 1 : 0;
    await db
      .update(members)
      .set({ name, phoneNumber, statusAktif })
      .where(eq(members.id, id));
    return redirect('/so/anggota');
  }

  if (intent === 'delete') {
    const id = String(formData.get('id'));
    await db.delete(members).where(eq(members.id, id));
    return redirect('/so/anggota');
  }

  return json({ error: 'Intent tidak dikenal' }, { status: 400 });
}

export default function AnggotaPage() {
  const { members } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h2 className="text-lg font-semibold">Tambah Anggota</h2>
        {actionData?.error && <p className="mt-2 rounded-xl bg-red-50 p-2 text-sm text-red-700">{actionData.error}</p>}
        <Form method="post" className="mt-3 grid gap-3 md:grid-cols-3">
          <input type="hidden" name="intent" value="create" />
          <input name="name" required placeholder="Nama" className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2" />
          <input
            name="phoneNumber"
            placeholder="No. WhatsApp"
            className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2"
          />
          <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white shadow">Simpan</button>
        </Form>
      </div>

      <div className="rounded-3xl bg-white p-5 text-blue-900 shadow-xl">
        <h3 className="text-lg font-semibold">Daftar Anggota</h3>
        <div className="mt-3 space-y-3">
          {members.map((member) => (
            <details key={member.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <summary className="flex cursor-pointer items-center justify-between">
                <span>
                  <span className="font-semibold">{member.name}</span>
                  <span className="ml-2 text-sm text-blue-700">{member.phoneNumber || 'Tanpa nomor'}</span>
                </span>
                <span className={`rounded-full px-3 py-1 text-xs ${member.statusAktif ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                  {member.statusAktif ? 'Aktif' : 'Nonaktif'}
                </span>
              </summary>

              <Form method="post" className="mt-3 grid gap-2 md:grid-cols-4">
                <input type="hidden" name="intent" value="update" />
                <input type="hidden" name="id" value={member.id} />
                <input name="name" defaultValue={member.name} className="rounded-2xl border border-blue-100 bg-white px-3 py-2" />
                <input
                  name="phoneNumber"
                  defaultValue={member.phoneNumber || ''}
                  className="rounded-2xl border border-blue-100 bg-white px-3 py-2"
                />
                <label className="flex items-center gap-2 text-sm text-blue-800">
                  <input type="checkbox" name="statusAktif" defaultChecked={!!member.statusAktif} /> Aktif
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-2xl bg-blue-600 px-3 py-2 text-white">Update</button>
                  <button
                    name="intent"
                    value="delete"
                    className="flex-1 rounded-2xl bg-red-500 px-3 py-2 text-white"
                    formNoValidate
                  >
                    Hapus
                  </button>
                </div>
              </Form>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
