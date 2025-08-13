// File: app/components/mobile-nav.tsx

import { Link, useLocation } from '@remix-run/react';
import {
  Home,
  BookOpen,
  User,
  Users,
  Shield,
  GraduationCap,
  Coins,
  MessageCircle,
  ShoppingCart,
  Info,
} from 'lucide-react';
import { cn } from '~/lib/utils';

// Daftar item navigasi mobile yang mengikuti header
const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/dashboard/hafalan', label: 'Hafalan', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ShoppingCart },
  { href: '/komunitas', label: 'Komunitas', icon: MessageCircle },
  { href: '/dashboard', label: 'Dashboard', icon: User, isSpecial: true },
];

interface MobileNavProps {
  user: {
    role: string;
    dincoin?: number;
    dircoin?: number;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const { pathname } = useLocation();

  if (!user) {
    return (
      // Mobile nav untuk user yang belum login - sebagai footer replacement
      <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur-sm z-50 md:hidden shadow-lg mobile-nav-footer">
        <nav className="flex h-16 items-center justify-around px-2 bg-background">
          {[
            { href: '/', label: 'Beranda', icon: Home },
            { href: '/kitab', label: 'Kitab', icon: BookOpen },
            { href: '/biografi-ulama', label: 'Ulama', icon: Users },
            { href: '/tentang', label: 'Tentang', icon: Info },
            { href: '/daftar', label: 'Daftar', icon: User, isSpecial: true },
          ].map((item) => {
            const isActive = pathname === item.href;

            if (item.isSpecial) {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex h-12 w-16 flex-col items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground shadow-lg transform hover:scale-105 transition-transform"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-bold">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200 text-foreground rounded-md',
                  isActive
                    ? 'text-primary font-semibold bg-primary/10 scale-105'
                    : 'text-foreground/70 hover:text-primary hover:bg-muted/50',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </footer>
    );
  }

  return (
    // Mobile nav untuk user yang sudah login - sebagai footer replacement
    <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur-sm z-50 md:hidden shadow-lg mobile-nav-footer">
      {/* Coin Display - sebagai footer header */}
      <div className="flex items-center justify-center gap-4 px-4 py-2 bg-muted/30 border-b">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
            <Coins className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-foreground">{user.dincoin || 0} DinCoin</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
            <Coins className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-foreground">{user.dircoin || 0} DirCoin</span>
        </div>
      </div>

      {/* Main Navigation - sebagai footer navigation */}
      <nav className="flex h-16 items-center justify-around px-2 bg-background">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          // Item spesial (Dashboard) - lebih prominent seperti footer brand
          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex h-12 w-16 flex-col items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground shadow-lg transform hover:scale-105 transition-transform"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-bold">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200 text-foreground rounded-md',
                isActive
                  ? 'text-primary font-semibold bg-primary/10 scale-105'
                  : 'text-foreground/70 hover:text-primary hover:bg-muted/50',
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin menu jika user adalah admin - sebagai footer extra section */}
      {user.role === 'admin' && (
        <nav className="flex h-14 items-center justify-around border-t bg-muted/20 px-2">
          {[
            { to: '/dashboard/admin/pengguna', icon: Shield, label: 'Pengguna' },
            { to: '/dashboard/admin/akademik', icon: GraduationCap, label: 'Akademik' },
          ].map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 transition-colors text-foreground rounded-md',
                  isActive
                    ? 'text-primary font-semibold bg-primary/10'
                    : 'text-foreground/70 hover:text-primary',
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </footer>
  );
}
