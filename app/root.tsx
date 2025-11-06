import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { log } from '~/lib/logger';
import { ensureWallet } from '~/lib/wallet.server';

// Import session functions
import { getUserId } from './lib/session.server';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { MobileNav } from './components/mobile-nav';

import './styles/reset.css';
import './styles/global.scss';
import './styles/performance.css';
import './tailwind.css';

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: 'https://files.santrionline.com/ICON%20SANTRI%20ONLINE%20COM%20kecil%20(1).png',
    type: 'image/png',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
];

// Loader untuk mengambil data user di level root
export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    const userId = await getUserId(request, context);
    if (!userId) {
      return json({ user: null });
    }

    // Import database and schema
    const { getDb } = await import('~/db/drizzle.server');
    const { user: userTable } = await import('~/db/schema');
    const { eq } = await import('drizzle-orm');

    const db = getDb(context);

    // Fetch user data using drizzle query API
    const userData = await db.query.user.findFirst({ where: eq(userTable.id, userId) });
    if (!userData) return json({ user: null });

    // Ensure wallet exists using centralized utility
    const { wallet: walletData } = await ensureWallet(db, userId);

    // Transform user data for the frontend
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl || undefined,
      role: userData.role || undefined,
      initials: userData.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      dincoin: walletData?.dincoinBalance ?? 0,
      dircoin: walletData?.dircoinBalance ?? 0,
    };

    return json({ user });
  } catch (error) {
    log.error('root-loader-error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return json({ user: null });
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Ambil data user dari loader
  const { user } = useLoaderData<typeof loader>(); // user sekarang bisa null

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Kirim data user sebagai props ke Header */}
      <Header user={user} />

      <main className="flex-1 main-content pb-20 md:pb-0">
        {/* Outlet sekarang hanya untuk konten halaman */}
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Kirim data user sebagai props ke MobileNav */}
      <MobileNav user={user} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = 'Terjadi kesalahan tak terduga';
  let status: number | undefined;
  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }
  log.error('boundary-error', { status, message });
  return (
    <html lang="id">
      <head>
        <Meta />
        <Links />
        <title>Error</title>
      </head>
      <body className="font-sans antialiased">
        <h1 className="text-xl font-bold p-4">Error</h1>
        <p className="p-4 text-red-600">{message}</p>
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  return <ErrorBoundary />;
}
