import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { useLoaderData, Form, useNavigation, useSearchParams } from '@remix-run/react';
import { eq, and, sql, type SQL } from 'drizzle-orm';
import { user, dompet_santri } from '~/db/schema';
import { getDb } from '~/db/drizzle.server';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Search, Users as UsersIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'santri' | 'admin';
  createdAt: Date;
  dincoin?: number;
  dircoin?: number;
}

// Loader: list pengguna dengan pagination & pencarian
export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const q = (url.searchParams.get('q') || '').trim().toLowerCase();
  const perPage = 15;

  const conditions: SQL[] = [];
  if (q) {
    // simple OR name/email using LIKE both; emulate with AND of OR or custom SQL
    const pattern = `%${q}%`;
    conditions.push(
      sql`(lower(${user.name}) like ${pattern} OR lower(${user.email}) like ${pattern})`,
    );
  }

  const whereExpr = conditions.length ? and(...conditions) : undefined;
  // total count
  const countQuery = whereExpr
    ? await db
        .select({ c: sql<number>`count(*)` })
        .from(user)
        .where(whereExpr)
    : await db.select({ c: sql<number>`count(*)` }).from(user);
  const total = countQuery[0].c;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);

  const rows = (whereExpr
    ? await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          dincoin: dompet_santri.dincoinBalance,
          dircoin: dompet_santri.dircoinBalance,
        })
        .from(user)
        .leftJoin(dompet_santri, eq(dompet_santri.userId, user.id))
        .where(whereExpr)
        .orderBy(user.createdAt)
        .limit(perPage)
        .offset((currentPage - 1) * perPage)
    : await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          dincoin: dompet_santri.dincoinBalance,
          dircoin: dompet_santri.dircoinBalance,
        })
        .from(user)
        .leftJoin(dompet_santri, eq(dompet_santri.userId, user.id))
        .orderBy(user.createdAt)
        .limit(perPage)
        .offset((currentPage - 1) * perPage)) as unknown as UserRow[];

  return json({ users: rows, meta: { page: currentPage, total, totalPages, q } });
}

// Action: update role (promote/demote)
export async function action({ request, context }: ActionFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);
  const form = await request.formData();
  const intent = form.get('intent');
  const userId = form.get('userId');
  if (typeof userId !== 'string' || typeof intent !== 'string') {
    return json({ error: 'Data tidak valid' }, { status: 400 });
  }
  if (intent === 'promote') {
    await db.update(user).set({ role: 'admin' }).where(eq(user.id, userId));
  } else if (intent === 'demote') {
    await db.update(user).set({ role: 'santri' }).where(eq(user.id, userId));
  }
  return redirect('/dashboard/admin/pengguna');
}

export default function AdminPenggunaPage() {
  const { users, meta } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const busy = navigation.state !== 'idle';

  function updateSearch(key: string, val: string) {
    const sp = new URLSearchParams(searchParams);
    if (val) sp.set(key, val);
    else sp.delete(key);
    if (key !== 'page') sp.set('page', '1');
    setSearchParams(sp);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6 pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola dan monitor semua pengguna platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-medium">{meta.total}</span>
              <span>Total Pengguna</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama atau email pengguna..."
                  defaultValue={meta.q || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      updateSearch('q', (e.target as HTMLInputElement).value.trim());
                  }}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  Halaman {meta.page} dari {meta.totalPages}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table Section */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {users.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{u.name}</h3>
                            <Badge
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                u.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }`}
                            >
                              {u.role === 'admin' ? 'Admin' : 'Santri'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 truncate">{u.email}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              {u.dincoin ?? 0} DIN
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              {u.dircoin ?? 0} DIR
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Form method="post">
                            <input type="hidden" name="userId" value={u.id} />
                            {u.role === 'santri' ? (
                              <Button
                                name="intent"
                                value="promote"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                className="h-8 px-3 text-xs font-medium border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                Promote
                              </Button>
                            ) : (
                              <Button
                                name="intent"
                                value="demote"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                className="h-8 px-3 text-xs font-medium border-red-200 text-red-700 hover:bg-red-50"
                              >
                                Demote
                              </Button>
                            )}
                          </Form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Tidak ada pengguna ditemukan</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Saldo Digital
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {u.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {u.role === 'admin' ? 'Admin' : 'Santri'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              <span className="font-medium text-gray-900">{u.dincoin ?? 0}</span>
                              <span className="text-gray-500">DIN</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              <span className="font-medium text-gray-900">{u.dircoin ?? 0}</span>
                              <span className="text-gray-500">DIR</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Form method="post" className="inline-block">
                            <input type="hidden" name="userId" value={u.id} />
                            {u.role === 'santri' ? (
                              <Button
                                name="intent"
                                value="promote"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                className="h-8 px-4 text-xs font-medium border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                              >
                                Promote ke Admin
                              </Button>
                            ) : (
                              <Button
                                name="intent"
                                value="demote"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                className="h-8 px-4 text-xs font-medium border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                              >
                                Demote ke Santri
                              </Button>
                            )}
                          </Form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-12 text-center" colSpan={4}>
                        <div className="flex flex-col items-center">
                          <UsersIcon className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-sm">Tidak ada pengguna ditemukan</p>
                          {meta.q && (
                            <p className="text-gray-400 text-xs mt-2">
                              Coba ubah kata kunci pencarian Anda
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Section */}
        {meta.totalPages > 1 && (
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Menampilkan {users.length} dari {meta.total} pengguna
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1 || busy}
                    onClick={() => updateSearch('page', String(meta.page - 1))}
                    className="h-8 w-8 p-0 border-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                      const page = i + 1;
                      const isActive = page === meta.page;
                      return (
                        <Button
                          key={page}
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                          disabled={busy}
                          onClick={() => updateSearch('page', String(page))}
                          className={`h-8 w-8 p-0 text-xs ${
                            isActive ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    {meta.totalPages > 5 && (
                      <>
                        <span className="text-gray-400 px-1">...</span>
                        <Button
                          variant={meta.page === meta.totalPages ? 'default' : 'outline'}
                          size="sm"
                          disabled={busy}
                          onClick={() => updateSearch('page', String(meta.totalPages))}
                          className={`h-8 w-8 p-0 text-xs ${
                            meta.page === meta.totalPages
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {meta.totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages || busy}
                    onClick={() => updateSearch('page', String(meta.page + 1))}
                    className="h-8 w-8 p-0 border-gray-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
