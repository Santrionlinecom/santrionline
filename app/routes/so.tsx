import { json } from '@remix-run/cloudflare';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { getSessionUser } from '~/utils/santri-session.server';
import tailwindUrl from '~/tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindUrl }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = await getSessionUser(request, context);
  return json({ user });
}

const navItems = [
  { to: '/so', label: 'Home' },
  { to: '/so/anggota', label: 'Anggota' },
  { to: '/so/bayar', label: 'Bayar' },
  { to: '/so/follow-up', label: 'Follow Up' },
  { to: '/so/hafalan', label: 'Hafalan' },
  { to: '/so/akun', label: 'Akun' },
];

export default function SantriLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white">
      <div className="mx-auto flex max-w-5xl flex-col px-4 pb-24 pt-6">
        <header className="mb-6 flex items-center justify-between rounded-3xl bg-white/10 p-4 shadow-lg backdrop-blur">
          <div>
            <p className="text-sm text-blue-100">SantriOnline App</p>
            <h1 className="text-xl font-semibold">{user ? `Halo, ${user.name}` : 'Selamat Datang'}</h1>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide text-blue-50">
            {user ? user.role : 'Tamu'}
          </div>
        </header>

        <main className="flex-1 space-y-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-blue-950/90 backdrop-blur">
        <ul className="mx-auto grid max-w-4xl grid-cols-6 gap-2 px-3 py-2 text-xs font-medium">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex flex-col items-center rounded-2xl px-2 py-2 transition ${
                    active ? 'bg-white text-blue-900 shadow' : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
