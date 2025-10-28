import type { MetaFunction } from '@remix-run/cloudflare';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Link } from '@remix-run/react';
import {
  BookOpen,
  Play,
  Download,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Video,
  FileText,
  Headphones,
  Smartphone,
  Zap,
  Target,
  Star,
  TrendingUp,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Panduan & Tutorial - Santri Online' },
    {
      name: 'description',
      content:
        'Pelajari cara menggunakan semua fitur Santri Online dengan panduan lengkap dan tutorial step-by-step.',
    },
  ];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function PanduanPage() {
  const quickStartGuides = [
    {
      title: 'Memulai dengan Santri Online',
      description: 'Panduan lengkap untuk pengguna baru',
      duration: '15 menit',
      difficulty: 'Pemula',
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      steps: 6,
      href: '/panduan/memulai',
    },
    {
      title: 'Mengatur Profil & Akun',
      description: 'Personalisasi akun Anda',
      duration: '10 menit',
      difficulty: 'Pemula',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      steps: 4,
      href: '/panduan/profil',
    },
    {
      title: 'Sistem Hafalan Al-Quran',
      description: 'Cara menggunakan fitur tracking hafalan',
      duration: '20 menit',
      difficulty: 'Menengah',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      steps: 8,
      href: '/panduan/hafalan',
    },
    {
      title: 'Menjual di Marketplace',
      description: 'Upload dan jual karya Anda',
      duration: '25 menit',
      difficulty: 'Menengah',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      steps: 10,
      href: '/panduan/marketplace',
    },
  ];

  const categories = [
    {
      title: 'Fitur Utama',
      description: 'Pelajari semua fitur inti platform',
      icon: Star,
      color: 'text-yellow-600',
      guides: [
        {
          title: 'Dashboard Overview',
          description: 'Mengenal interface dashboard',
          type: 'Video',
          duration: '8 menit',
          href: '/panduan/dashboard',
        },
        {
          title: 'Sistem Hafalan Al-Quran',
          description: 'Tracking progress hafalan',
          type: 'Tutorial',
          duration: '15 menit',
          href: '/panduan/hafalan-detail',
        },
        {
          title: 'Dashboard Santri',
          description: 'Optimalkan penggunaan dashboard utama',
          type: 'Panduan',
          duration: '12 menit',
          href: '/panduan/dashboard',
        },
        {
          title: 'Dompet Digital',
          description: 'Kelola DinCoin dan DirCoin',
          type: 'Tutorial',
          duration: '18 menit',
          href: '/panduan/dompet',
        },
      ],
    },
    {
      title: 'Marketplace',
      description: 'Panduan lengkap marketplace',
      icon: Award,
      color: 'text-green-600',
      guides: [
        {
          title: 'Cara Upload Karya',
          description: 'Step-by-step upload produk',
          type: 'Video',
          duration: '10 menit',
          href: '/panduan/upload-karya',
        },
        {
          title: 'Optimasi Listing',
          description: 'Tips agar karya laris',
          type: 'Panduan',
          duration: '15 menit',
          href: '/panduan/optimasi-listing',
        },
        {
          title: 'Mengelola Pesanan',
          description: 'Handle order dari pembeli',
          type: 'Tutorial',
          duration: '12 menit',
          href: '/panduan/kelola-pesanan',
        },
        {
          title: 'Withdrawal & Pembayaran',
          description: 'Cara tarik hasil penjualan',
          type: 'Panduan',
          duration: '8 menit',
          href: '/panduan/withdrawal',
        },
      ],
    },
    {
      title: 'Tips & Trik',
      description: 'Maksimalkan penggunaan platform',
      icon: Zap,
      color: 'text-purple-600',
      guides: [
        {
          title: 'Metode Hafalan Efektif',
          description: 'Teknik menghafal Al-Quran',
          type: 'Artikel',
          duration: '20 menit',
          href: '/panduan/metode-hafalan',
        },
        {
          title: 'Networking di Komunitas',
          description: 'Membangun jaringan santri',
          type: 'Panduan',
          duration: '10 menit',
          href: '/panduan/networking',
        },
        {
          title: 'Content Creation Tips',
          description: 'Membuat karya yang menarik',
          type: 'Video',
          duration: '25 menit',
          href: '/panduan/content-creation',
        },
        {
          title: 'Personal Branding',
          description: 'Membangun brand sebagai santri',
          type: 'Artikel',
          duration: '15 menit',
          href: '/panduan/personal-branding',
        },
      ],
    },
    {
      title: 'Troubleshooting',
      description: 'Solusi masalah umum',
      icon: Target,
      color: 'text-red-600',
      guides: [
        {
          title: 'Masalah Login & Akun',
          description: 'Fix issue akses akun',
          type: 'FAQ',
          duration: '5 menit',
          href: '/panduan/troubleshoot-login',
        },
        {
          title: 'Error Upload Karya',
          description: 'Solusi gagal upload',
          type: 'Tutorial',
          duration: '8 menit',
          href: '/panduan/troubleshoot-upload',
        },
        {
          title: 'Masalah Pembayaran',
          description: 'Issue transaksi & dompet',
          type: 'Panduan',
          duration: '10 menit',
          href: '/panduan/troubleshoot-payment',
        },
        {
          title: 'Performance Issues',
          description: 'Mengatasi loading lambat',
          type: 'FAQ',
          duration: '7 menit',
          href: '/panduan/troubleshoot-performance',
        },
      ],
    },
  ];

  const resources = [
    {
      title: 'Panduan PDF Lengkap',
      description: 'Download panduan offline dalam format PDF',
      icon: FileText,
      size: '15 MB',
      format: 'PDF',
      downloads: '12,450',
      href: '/downloads/panduan-lengkap.pdf',
    },
    {
      title: 'Video Tutorial Series',
      description: 'Playlist tutorial komprehensif di YouTube',
      icon: Video,
      size: '2.5 jam',
      format: 'Video',
      downloads: '8,920',
      href: 'https://youtube.com/playlist/santrionline',
    },
    {
      title: 'Audio Guide',
      description: 'Panduan dalam format audio untuk mendengarkan',
      icon: Headphones,
      size: '45 menit',
      format: 'MP3',
      downloads: '5,678',
      href: '/downloads/audio-guide.mp3',
    },
    {
      title: 'Mobile App Guide',
      description: 'Panduan khusus untuk pengguna mobile',
      icon: Smartphone,
      size: '8 MB',
      format: 'PDF',
      downloads: '9,234',
      href: '/downloads/mobile-guide.pdf',
    },
  ];

  const stats = [
    { label: 'Total Panduan', value: '50+', icon: BookOpen },
    { label: 'Video Tutorial', value: '25', icon: Video },
    { label: 'Waktu Belajar', value: '8 jam', icon: Clock },
    { label: 'User Rating', value: '4.9/5', icon: Star },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary/10 via-blue-50 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Panduan &{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Tutorial
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Pelajari cara memaksimalkan penggunaan Santri Online dengan panduan lengkap dan
              tutorial interaktif
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Start Guides */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Start Guides</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mulai perjalanan Anda dengan panduan step-by-step yang mudah diikuti
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartGuides.map((guide, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={guide.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 ${guide.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <guide.icon className={`w-6 h-6 ${guide.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Durasi</span>
                          <span className="font-medium">{guide.duration}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Level</span>
                          <Badge variant="outline" className="text-xs">
                            {guide.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Steps</span>
                          <span className="font-medium">{guide.steps} langkah</span>
                        </div>
                      </div>

                      <Button size="sm" className="w-full group-hover:bg-primary/90">
                        Mulai Belajar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Learning Categories */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kategori Pembelajaran</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jelajahi panduan berdasarkan kategori untuk pembelajaran yang lebih terarah
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {categories.map((category, categoryIndex) => (
              <motion.div key={categoryIndex} variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl">{category.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {category.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.guides.map((guide, guideIndex) => (
                        <Link
                          key={guideIndex}
                          to={guide.href}
                          className="block p-4 rounded-lg hover:bg-accent/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                                {guide.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {guide.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {guide.duration}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {guide.type}
                                </Badge>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Resources & Downloads */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Resources & Downloads</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download materi pembelajaran untuk akses offline dan referensi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <resource.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size/Duration</span>
                        <span className="font-medium">{resource.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format</span>
                        <Badge variant="outline" className="text-xs">
                          {resource.format}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Downloads</span>
                        <span className="font-medium text-green-600">{resource.downloads}</span>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Learning Path */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-100 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Learning Path yang Direkomendasikan</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ikuti jalur pembelajaran yang terstruktur untuk memaksimalkan penggunaan platform
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold">Pemula</h4>
                  <p className="text-sm text-muted-foreground">
                    Mulai dengan setup akun, navigasi dasar, dan fitur utama platform
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold">Menengah</h4>
                  <p className="text-sm text-muted-foreground">
                    Eksplorasi marketplace, komunitas, dan fitur collaboration
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold">Lanjutan</h4>
                  <p className="text-sm text-muted-foreground">
                    Master advanced features, automation, dan best practices
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Mulai Learning Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Need Help */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Masih Butuh Bantuan?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jika panduan ini belum menjawab pertanyaan Anda, jangan ragu untuk menghubungi tim
                support kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/kontak">
                    <Users className="w-5 h-5 mr-2" />
                    Hubungi Support
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/faq">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Lihat FAQ
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
