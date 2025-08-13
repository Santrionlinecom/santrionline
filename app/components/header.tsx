import { Link, useLocation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { UserProfileDropdown } from "~/components/user-profile-dropdown";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/cn";
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Info,
  GraduationCap,
  MessageCircle,
  Award,
  Menu
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    dincoin?: number;
    dircoin?: number;
    role?: string;
  } | null;
}

const navigationItems = [
  {
    title: "Belajar",
    items: [
      {
        title: "Hafalan Al-Quran",
        href: "/dashboard/hafalan",
        description: "Sistem tracking hafalan Al-Quran yang terstruktur",
        icon: BookOpen
      },
      {
        title: "Progres Akademik",
        href: "/dashboard/admin/akademik",
        description: "Pantau perkembangan akademik Anda",
        icon: GraduationCap
      },
      {
        title: "Sertifikat & Ijazah",
        href: "/dashboard/sertifikat",
        description: "Kelola sertifikat dan ijazah digital",
        icon: Award
      }
    ]
  },
  {
    title: "Ilmu Syariah",
    items: [
      {
  title: "Biografi Ulama",
  href: "/biografi-ulama",
  description: "Biografi ulama 4 madzhab & tokoh tasawuf / thariqah",
        icon: Users
      },
      {
        title: "Kitab Mu'tabarah",
        href: "/kitab",
        description: "Koleksi kitab-kitab dari ulama salaf",
        icon: BookOpen
      }
    ]
  },
  {
    title: "Komunitas",
    items: [
      {
        title: "Forum Diskusi",
        href: "/komunitas",
        description: "Bergabung dalam diskusi dengan sesama santri",
        icon: MessageCircle
      },
      {
        title: "Grup Belajar",
        href: "/komunitas/grup",
        description: "Temukan atau buat grup belajar",
        icon: Users
      }
    ]
  },
  {
    title: "Karya Santri",
    items: [
      {
        title: "Sharing Karya",
        href: "/marketplace",
        description: "Berbagi dan apresiasi karya islami dari santri",
        icon: ShoppingCart
      },
      {
        title: "Karyaku",
        href: "/dashboard/karyaku",
        description: "Kelola karya yang Anda bagikan",
        icon: BookOpen
      }
    ]
  }
];

export function Header({ user }: HeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://files.santrionline.com/logo%20santrionline.com.png" 
            alt="Santri Online"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="h-10">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={subItem.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                location.pathname === subItem.href && "bg-accent"
                              )}
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                <subItem.icon className="w-4 h-4" />
                                {subItem.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              
              {/* Simple Links */}
              <NavigationMenuItem>
                <Link 
                  to="/tentang"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    location.pathname === "/tentang" && "bg-accent"
                  )}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Tentang
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center space-x-4">
          {/* Auth Buttons for non-logged users */}
          {!user && (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/masuk">Masuk</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/daftar">Daftar</Link>
              </Button>
            </div>
          )}

          {/* Dashboard Button and Profile for logged users */}
          {user && (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
              <UserProfileDropdown user={user} />
            </div>
          )}

          {/* Mobile Menu Button for non-logged users */}
          {!user && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}

          {/* Mobile Profile for logged users */}
          {user && (
            <div className="md:hidden">
              <UserProfileDropdown user={user} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {item.title}
                </h3>
                <div className="space-y-1 pl-4">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      to={subItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                        location.pathname === subItem.href && "bg-accent"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{subItem.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {subItem.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Link
                to="/tentang"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  location.pathname === "/tentang" && "bg-accent"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="w-4 h-4" />
                Tentang Kami
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/masuk" onClick={() => setIsMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/daftar" onClick={() => setIsMobileMenuOpen(false)}>
                    Daftar
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Dashboard Button for logged users */}
            {user && (
              <div className="pt-4 border-t">
                <Button className="w-full" asChild>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}