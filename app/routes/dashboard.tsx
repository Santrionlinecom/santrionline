import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { MobileNav } from '~/components/mobile-nav';
import { user as userSchema, type AppRole } from '~/db/schema';
import { eq } from 'drizzle-orm';
// server-only modules (session, db, wallet) imported dynamically in loader
import { Skeleton } from '~/components/ui/skeleton';
import { isAdminRole } from '~/lib/rbac';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUser, logout } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const { ensureWallet } = await import('~/lib/wallet.server');
  const { id: userId } = await requireUser(request, context);
  const db = getDb(context);
  const user = await db.query.user.findFirst({
    where: eq(userSchema.id, userId),
  });

  if (!user) {
    // if the user is not found, logout and redirect to login
    throw await logout(request, context);
  }

  // Ensure wallet exists (centralized)
  const { wallet } = await ensureWallet(db, userId);

  return json({
    user: {
      ...user,
      dincoin: wallet.dincoinBalance,
      dircoin: wallet.dircoinBalance,
    },
  });
}

import {
  Home,
  BookOpen,
  Wallet,
  Palette,
  Settings,
  Shield,
  GraduationCap,
  Link as LinkIcon,
  Target,
} from 'lucide-react';

// Memoized Navigation Component
type IconLike = ComponentType<{ className?: string }>;
interface NavItem {
  to: string;
  icon: IconLike;
  label: string;
}
const SidebarNav = memo(
  ({
    navLinks,
    adminLinks,
    userRole,
  }: {
    navLinks: NavItem[];
    adminLinks: NavItem[];
    userRole: AppRole;
  }) => (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
      {isAdminRole(userRole) && (
        <>
          <div className="my-2 border-t"></div>
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </>
      )}
    </nav>
  ),
);

SidebarNav.displayName = 'SidebarNav';

// Loading Skeleton for Dashboard
const DashboardSkeleton = memo(() => (
  <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="w-full flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border rounded-lg">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  const navLinks = useMemo(
    () => [
      { to: '/dashboard', icon: Home, label: 'Ringkasan' },
      { to: '/dashboard/hafalan', icon: BookOpen, label: 'Hafalan' },
      { to: '/dashboard/tahfidz', icon: Target, label: 'Tahfidz' },
      { to: '/dashboard/dompet', icon: Wallet, label: 'Dompet' },
      { to: '/dashboard/karyaku', icon: Palette, label: 'Karyaku' },
      { to: '/dashboard/biolink', icon: LinkIcon, label: 'Biolink Analytics' },
      { to: '/dashboard/pengaturan', icon: Settings, label: 'Pengaturan' },
    ],
    [],
  );

  const adminLinks = useMemo(
    () => [
      { to: '/dashboard/admin/pengguna', icon: Shield, label: 'Admin: Pengguna' },
      { to: '/dashboard/admin/akademik', icon: GraduationCap, label: 'Admin: Akademik' },
    ],
    [],
  );

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Proteksi jika user tidak ter-load (seharusnya tidak terjadi karena requireUserId)
  if (!user) {
    return (
      <div className="p-6 text-red-600">
        User tidak ditemukan dalam konteks. Silakan refresh atau login ulang.
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            {/* Logo removed from sidebar */}
          </div>
          <div className="flex-1">
            <SidebarNav navLinks={navLinks} adminLinks={adminLinks} userRole={user.role} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Assalamu'alaikum, {user.name}! 👋</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{currentDate}</p>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-20 md:pb-4">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav user={user} />
    </div>
  );
}
