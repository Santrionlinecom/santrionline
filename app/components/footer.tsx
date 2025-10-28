import { Link } from '@remix-run/react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    platform: [
      { name: 'Tentang Kami', href: '/tentang' },
      { name: 'Biografi Ulama', href: '/biografi-ulama' },
      { name: 'Manhaj Aswaja', href: '/manhaj' },
      { name: "Kitab Mu'tabarah", href: '/kitab' },
    ],
    program: [
      { name: 'Kajian Online', href: '/kajian' },
      { name: 'Newsletter', href: '/newsletter' },
      { name: 'Marketplace', href: '/marketplace' },
    ],
    belajar: [
      { name: 'Hafalan Al-Quran', href: '/dashboard/hafalan' },
      { name: 'Ilmu Diniyah', href: '/dashboard/diniyah' },
      { name: 'Ijazah Digital', href: '/sertifikat' },
      { name: 'Panduan Belajar', href: '/panduan' },
    ],
    bantuan: [
      { name: 'Pusat Bantuan', href: '/bantuan' },
      { name: 'Panduan Pengguna', href: '/panduan' },
      { name: 'Tutorial', href: '/tutorial' },
      { name: 'Dukungan Teknis', href: '/support' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/santrionline' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/santrionline' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/santrionline' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/santrionline' },
  ];

  return (
    <footer className="bg-muted/30 border-t hidden md:block">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://files.santrionline.com/logo%20santrionline.com.png"
                alt="Santri Online"
                className="h-8 w-auto"
              />
            </Link>

            <p className="text-muted-foreground max-w-sm">
              Platform edukasi Islam berdasarkan pemahaman Ahli Sunnah wal Jamaah 4 Madzhab.
              Bergabunglah dengan ribuan santri beraqidah Aswaja di seluruh Indonesia.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>websantrionline@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>087854545274</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Program Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Program</h3>
            <ul className="space-y-2">
              {footerLinks.program.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Belajar</h3>
            <ul className="space-y-2">
              {footerLinks.belajar.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Bantuan</h3>
            <ul className="space-y-2">
              {footerLinks.bantuan.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
              <span>© 2025 Santri Online. Semua hak dilindungi.</span>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <span className="hidden md:inline">•</span>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
                <span>•</span>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
                <span>•</span>
                <Link to="/kontak" className="hover:text-primary transition-colors">
                  Kontak
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Ikuti kami:</span>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Made with Love */}
        <div className="py-4 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <span>Dibuat dengan </span>
            <Heart className="w-4 h-4 inline-block text-red-500 mx-1" />
            <span> untuk kemajuan umat Islam berdasarkan manhaj Ahli Sunnah wal Jamaah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
