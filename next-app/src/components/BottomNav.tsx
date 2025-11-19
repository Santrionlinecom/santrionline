'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/members", label: "Anggota", icon: "👥" },
  { href: "/payments", label: "Bayar", icon: "💳" },
  { href: "/follow-up", label: "Follow Up", icon: "📲" },
  { href: "/hafalan", label: "Hafalan", icon: "📖" },
  { href: "/account", label: "Akun", icon: "⚙️" }
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={active ? "text-blue-600" : undefined}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
