import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Award, 
  Wallet, 
  Palette,
  Star,
  Clock,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Santri Online: Platform Edukasi Islam Modern" },
    {
      name: "description",
      content:
        "Bergabunglah dengan Santri Online, platform edukasi Islam modern yang menyediakan berbagai kursus, komunitas, dan sumber daya untuk memperdalam pengetahuan agama Anda.",
    },
  ];
};

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Hafalan Al-Quran",
      description: "Sistem tracking hafalan yang membantu Anda menghafal Al-Quran dengan mudah dan terstruktur.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Komunitas Santri",
      description: "Bergabung dengan komunitas santri dari seluruh Indonesia untuk berbagi ilmu dan pengalaman.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Award,
      title: "Sertifikat Digital",
      description: "Dapatkan ijazah dan sertifikat digital untuk pencapaian akademik Anda.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Wallet,
      title: "Dompet Digital",
      description: "Kelola DinCoin dan DirCoin untuk transaksi di dalam platform.",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Palette,
      title: "Marketplace Karya",
      description: "Jual dan beli karya islami seperti kaligrafi, nasyid, dan tulisan.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Pantau perkembangan belajar Anda dengan dashboard yang interaktif.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { icon: Users, label: "Santri Aktif", value: "0", color: "text-blue-600" },
    { icon: BookOpen, label: "Hafalan Selesai", value: "0", color: "text-green-600" },
    { icon: Award, label: "Sertifikat Terbit", value: "0", color: "text-purple-600" },
    { icon: Heart, label: "Kolaborasi", value: "0", color: "text-red-600" }
  ];

  const menuItems = [
    { href: "/", label: "Beranda" },
    { href: "/kursus", label: "Kursus" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" }
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Header with Navigation */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Santri Online
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-600 hover:text-primary transition-colors font-medium text-sm xl:text-base"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link to="/masuk">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <Link to="/daftar">Daftar</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 border-t bg-white/95 backdrop-blur-sm fade-in">
              <nav className="flex flex-col space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-gray-600 hover:text-primary transition-colors font-medium py-2 px-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                  <Button asChild variant="ghost" size="sm" className="justify-start">
                    <Link to="/masuk" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
                  </Button>
                  <Button asChild size="sm" className="justify-start">
                    <Link to="/daftar" onClick={() => setIsMenuOpen(false)}>Daftar</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto fade-in">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Platform Edukasi Islam Modern
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block">Bergabung dengan</span>
              <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Santri Online
              </span>
            </h1>
            
            <p className="mx-auto mt-4 sm:mt-6 max-w-xs sm:max-w-md lg:max-w-2xl text-sm sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Platform edukasi Islam terdepan yang menggabungkan teknologi modern dengan nilai-nilai islami. 
              Tingkatkan hafalan, bergabung dengan komunitas, dan raih prestasi akademik Anda.
            </p>
            
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto">
                <Link to="/daftar">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Mulai Gratis Sekarang
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto">
                <Link to="/tentang">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Pelajari Lebih Lanjut
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-xs sm:text-sm text-muted-foreground">100% Halal</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm text-muted-foreground">24/7 Support</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                <span className="text-xs sm:text-sm text-muted-foreground">Rating 4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm slide-up"
              >
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 ${stat.color}`} />
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 fade-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Fitur Unggulan Platform Kami
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md sm:max-w-xl lg:max-w-2xl mx-auto">
              Temukan berbagai fitur canggih yang dirancang khusus untuk mendukung perjalanan belajar Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white fade-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Siap Memulai Perjalanan Belajar?
            </h2>
            <p className="text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto">
              Bergabunglah dengan ribuan santri lainnya dan rasakan pengalaman belajar yang tak terlupakan
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto w-full sm:w-auto">
                <Link to="/daftar">
                  Daftar Sekarang - Gratis!
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                <Link to="/masuk">
                  Sudah Punya Akun?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
