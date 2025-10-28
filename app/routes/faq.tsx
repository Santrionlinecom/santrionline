import type { MetaFunction } from '@remix-run/cloudflare';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Link } from '@remix-run/react';
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
  Wallet,
  Shield,
  Download,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'FAQ & Bantuan - Santri Online' },
    {
      name: 'description',
      content:
        'Temukan jawaban untuk pertanyaan yang sering diajukan dan dapatkan bantuan untuk menggunakan platform Santri Online.',
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

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const quickLinks = [
    {
      title: 'Panduan Memulai',
      description: 'Pelajari cara menggunakan platform untuk pertama kali',
      icon: BookOpen,
      href: '/panduan',
      color: 'text-blue-600',
    },
    {
      title: 'Marketplace Karya',
      description: 'Eksplor karya islami dari para santri',
      icon: ShoppingBag,
      href: '/marketplace',
      color: 'text-green-600',
    },
    {
      title: 'Hubungi Support',
      description: 'Dapatkan bantuan dari tim customer service',
      icon: MessageCircle,
      href: '/kontak',
      color: 'text-purple-600',
    },
    {
      title: 'Download Panduan',
      description: 'Unduh panduan lengkap dalam format PDF',
      icon: Download,
      href: '/downloads',
      color: 'text-orange-600',
    },
  ];

  const faqCategories = [
    {
      title: 'Akun & Profil',
      faqs: [
        {
          question: 'Bagaimana cara mendaftar akun di Santri Online?',
          answer:
            "Anda dapat mendaftar dengan mengklik tombol 'Daftar' di halaman utama, kemudian mengisi formulir dengan email, nama lengkap, dan password. Setelah itu, verifikasi email Anda untuk mengaktifkan akun.",
        },
        {
          question: 'Apakah pendaftaran akun gratis?',
          answer:
            'Ya, pendaftaran akun di Santri Online sepenuhnya gratis. Anda dapat mengakses sebagian besar fitur tanpa biaya. Beberapa fitur premium mungkin memerlukan upgrade akun.',
        },
        {
          question: 'Bagaimana cara mengubah informasi profil?',
          answer:
            "Masuk ke akun Anda, klik menu 'Pengaturan' di dashboard, lalu pilih 'Edit Profil'. Anda dapat mengubah nama, foto profil, bio, dan informasi lainnya.",
        },
        {
          question: 'Lupa password, bagaimana cara reset?',
          answer:
            "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan kami akan mengirimkan link reset password ke email tersebut.",
        },
      ],
    },
    {
      title: 'Hafalan Al-Quran',
      faqs: [
        {
          question: 'Bagaimana sistem tracking hafalan bekerja?',
          answer:
            'Sistem tracking hafalan memungkinkan Anda mencatat progress hafalan per ayat dan surah. Anda dapat menandai ayat yang sudah dihafal, menambahkan catatan, dan melihat statistik progress Anda.',
        },
        {
          question: 'Apakah ada target hafalan yang harus dicapai?',
          answer:
            'Tidak ada target yang wajib. Anda dapat mengatur target pribadi sesuai kemampuan. Platform menyediakan saran target berdasarkan tingkat kemampuan Anda.',
        },
        {
          question: 'Bisakah saya mendengarkan murottal untuk membantu hafalan?',
          answer:
            'Ya, kami menyediakan audio murottal dari berbagai qori terkenal yang dapat digunakan untuk membantu proses hafalan Anda.',
        },
      ],
    },
    {
      title: 'Dompet Digital & Transaksi',
      faqs: [
        {
          question: 'Apa itu DinCoin dan DirCoin?',
          answer:
            'DinCoin dan DirCoin adalah mata uang digital platform yang digunakan untuk bertransaksi di marketplace. DinCoin untuk pembelian umum, DirCoin untuk reward dan hadiah.',
        },
        {
          question: 'Bagaimana cara top up saldo dompet?',
          answer:
            "Anda dapat top up melalui transfer bank, e-wallet, atau kartu kredit. Masuk ke menu 'Dompet' dan pilih metode pembayaran yang diinginkan.",
        },
        {
          question: 'Apakah ada biaya transaksi?',
          answer:
            "Biaya transaksi minimal untuk menjaga keamanan sistem. Detail biaya dapat dilihat di halaman 'Biaya & Tarif' di pengaturan dompet.",
        },
        {
          question: 'Bagaimana cara withdraw saldo?',
          answer:
            'Withdrawal dapat dilakukan melalui transfer bank setelah verifikasi identitas. Minimal withdrawal adalah 50.000 DinCoin dengan proses 1-3 hari kerja.',
        },
      ],
    },
    {
      title: 'Marketplace & Karya',
      faqs: [
        {
          question: 'Jenis karya apa saja yang bisa dijual?',
          answer:
            'Anda dapat menjual kaligrafi digital, nasyid, e-book islami, template presentasi, video edukasi, dan karya kreatif islami lainnya.',
        },
        {
          question: 'Berapa komisi yang dikenakan untuk penjualan?',
          answer:
            'Platform mengenakan komisi 10% dari setiap penjualan untuk biaya operasional dan maintenance platform.',
        },
        {
          question: 'Bagaimana cara upload karya untuk dijual?',
          answer:
            "Masuk ke menu 'Karyaku', klik 'Upload Karya Baru', isi informasi karya, upload file, dan tentukan harga. Karya akan direview sebelum dipublikasi.",
        },
        {
          question: 'Berapa lama proses review karya?',
          answer:
            'Proses review umumnya memakan waktu 1-3 hari kerja. Kami akan mengirim notifikasi jika karya sudah disetujui atau perlu revisi.',
        },
      ],
    },
    {
      title: 'Komunitas & Forum',
      faqs: [
        {
          question: 'Bagaimana aturan posting di forum komunitas?',
          answer:
            'Pastikan konten sesuai dengan nilai-nilai Islam, tidak mengandung SARA, spam, atau konten tidak pantas. Gunakan bahasa yang sopan dan saling menghormati.',
        },
        {
          question: 'Bisakah saya membuat grup diskusi pribadi?',
          answer:
            "Ya, Anda dapat membuat grup diskusi dengan mengundang anggota tertentu. Fitur ini tersedia di menu 'Komunitas' > 'Buat Grup'.",
        },
        {
          question: 'Bagaimana cara melaporkan konten yang tidak pantas?',
          answer:
            'Klik ikon report di setiap postingan atau komentar yang tidak pantas. Tim moderator akan meninjau laporan dalam 24 jam.',
        },
      ],
    },
    {
      title: 'Teknis & Troubleshooting',
      faqs: [
        {
          question: 'Platform tidak bisa diakses, apa yang harus dilakukan?',
          answer:
            'Coba refresh halaman, clear cache browser, atau gunakan browser lain. Jika masih bermasalah, hubungi support kami.',
        },
        {
          question: 'Apakah ada aplikasi mobile?',
          answer:
            'Saat ini kami menyediakan web app yang responsive. Aplikasi mobile native sedang dalam tahap pengembangan.',
        },
        {
          question: 'Bagaimana cara backup data hafalan saya?',
          answer:
            "Data hafalan tersimpan otomatis di cloud. Anda juga dapat export data melalui menu 'Pengaturan' > 'Export Data'.",
        },
        {
          question: 'Resolusi minimum yang didukung?',
          answer:
            'Platform optimal di resolusi 1024x768 ke atas. Untuk mobile, mendukung semua ukuran layar modern.',
        },
      ],
    },
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'support@santrionline.com',
      detail: 'Response dalam 24 jam',
      icon: Mail,
      color: 'text-blue-600',
    },
    {
      title: 'WhatsApp',
      description: '+62 812-3456-7890',
      detail: 'Senin-Jumat 09:00-17:00',
      icon: Phone,
      color: 'text-green-600',
    },
    {
      title: 'Live Chat',
      description: 'Chat dengan support',
      detail: 'Online 24/7',
      icon: MessageCircle,
      color: 'text-purple-600',
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0);

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
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pusat{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Bantuan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari pertanyaan atau kata kunci..."
                className="pl-12 pr-4 py-3 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">Bantuan Cepat</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={link.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <link.icon
                        className={`w-12 h-12 mx-auto mb-4 ${link.color} group-hover:scale-110 transition-transform`}
                      />
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold">Pertanyaan yang Sering Diajukan</h2>

              {searchQuery && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan hasil untuk: <strong>&quot;{searchQuery}&quot;</strong>
                  </p>
                </div>
              )}

              {(searchQuery ? filteredFAQs : faqCategories).map((category, categoryIndex) => (
                <motion.div key={categoryIndex} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        const isOpen = openFAQ === globalIndex;

                        return (
                          <div
                            key={faqIndex}
                            className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                          >
                            <button
                              onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                              className="w-full text-left flex items-center justify-between py-2 group"
                            >
                              <span className="font-medium group-hover:text-primary transition-colors pr-4">
                                {faq.question}
                              </span>
                              {isOpen ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              )}
                            </button>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 text-muted-foreground leading-relaxed"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {searchQuery && filteredFAQs.length === 0 && (
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Tidak ada hasil ditemukan</h3>
                      <p className="text-muted-foreground mb-6">
                        Coba gunakan kata kunci yang berbeda atau hubungi support kami
                      </p>
                      <Button onClick={() => setSearchQuery('')}>Hapus Pencarian</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Masih Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <option.icon className={`w-5 h-5 mt-0.5 ${option.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.title}</div>
                        <div className="text-sm text-primary">{option.description}</div>
                        <div className="text-xs text-muted-foreground">{option.detail}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span className="font-medium">09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu</span>
                    <span className="font-medium">09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span className="text-muted-foreground">Tutup</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Live Chat</span>
                    <span className="font-medium text-green-600">24/7</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Resources */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Populer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    to="/panduan/memulai"
                    className="block p-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium text-sm">Panduan Memulai</div>
                    <div className="text-xs text-muted-foreground">
                      Langkah pertama menggunakan platform
                    </div>
                  </Link>
                  <Link
                    to="/panduan/hafalan"
                    className="block p-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium text-sm">Tips Menghafal Al-Quran</div>
                    <div className="text-xs text-muted-foreground">
                      Metode efektif untuk hafalan
                    </div>
                  </Link>
                  <Link
                    to="/panduan/marketplace"
                    className="block p-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium text-sm">Jual Karya di Marketplace</div>
                    <div className="text-xs text-muted-foreground">
                      Cara upload dan menjual karya
                    </div>
                  </Link>
                  <Link
                    to="/panduan/dashboard"
                    className="block p-2 rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium text-sm">Optimalkan Dashboard</div>
                    <div className="text-xs text-muted-foreground">Pelajari fitur inti platform</div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.section
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-blue-100 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Tidak menemukan jawaban yang Anda cari?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami kapan
                saja.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat dengan Support
                </Button>
                <Button size="lg" variant="outline">
                  <Mail className="w-5 h-5 mr-2" />
                  Kirim Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
