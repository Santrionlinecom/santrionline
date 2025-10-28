import type { MetaFunction } from '@remix-run/cloudflare';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import {
  Target,
  Eye,
  Users,
  BookOpen,
  Shield,
  Lightbulb,
  Globe,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Tentang Kami - Santri Online: Platform Ahli Sunnah wal Jamaah' },
    {
      name: 'description',
      content:
        'Mengenal lebih dekat Santri Online, platform edukasi Islam berdasarkan pemahaman Ahli Sunnah wal Jamaah 4 Madzhab. Visi, misi, dan tim di balik inovasi pendidikan Islam yang authentic.',
    },
    {
      name: 'keywords',
      content:
        'tentang santri online, ahli sunnah wal jamaah, 4 madzhab, founder, yogik pratama aprilian, visi misi, tim pengembang',
    },
  ];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export default function TentangPage() {
  const values = [
    {
      icon: Shield,
      title: 'Manhaj Aswaja',
      description:
        'Berpegang teguh pada pemahaman Ahli Sunnah wal Jamaah dengan mengikuti 4 madzhab fiqih yang mu&apos;tabarah',
      color: 'text-green-600',
    },
    {
      icon: BookOpen,
      title: 'Kitab Mu&apos;tabarah',
      description:
        'Semua materi pembelajaran bersumber dari kitab-kitab yang telah diakui dan diajarkan oleh ulama salaf',
      color: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Komunitas Berkualitas',
      description:
        'Membangun jaringan santri yang saling menguatkan dalam pembelajaran dan pengamalan ilmu agama',
      color: 'text-purple-600',
    },
    {
      icon: Lightbulb,
      title: 'Teknologi Halal',
      description:
        'Menggunakan teknologi modern untuk mempermudah akses ilmu agama dengan tetap menjaga nilai-nilai islami',
      color: 'text-yellow-600',
    },
  ];

  const features = [
    'Platform hafalan Al-Quran dengan metode ulama salaf',
    'Sistem pembelajaran kitab kuning dari 4 madzhab',
    'Biografi dan karya ulama Ahli Sunnah wal Jamaah',
    'Marketplace karya islami yang sesuai syariah',
    'Dompet digital dengan prinsip muamalah yang halal',
    'Ijazah digital dari ustadz bersanad',
    'Komunitas santri beraqidah Aswaja',
    'Bimbingan spiritual dengan manhaj yang shahih',
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Konsep Awal',
      description: 'Pengembangan konsep platform berdasarkan manhaj Ahli Sunnah wal Jamaah',
    },
    {
      year: '2024',
      title: 'Peluncuran Beta',
      description: 'Santri Online resmi diluncurkan dengan fitur dasar pembelajaran kitab',
    },
    {
      year: '2025',
      title: 'Fitur Biografi Ulama',
      description: 'Meluncurkan database lengkap biografi ulama 4 madzhab dan tasawuf',
    },
    {
      year: '2025',
      title: 'Ekspansi Nasional',
      description: 'Target 10,000 santri beraqidah Aswaja di seluruh Indonesia',
    },
  ];

  const teamMembers: Array<{
    name: string;
    role: string;
    description: string;
    image: string;
    speciality: string;
  }> = [
    {
      name: 'Yogik Pratama Aprilian',
      role: 'Founder & CEO',
      description:
        'Seorang teknolog muslim yang bercita-cita memajukan pendidikan Islam melalui teknologi. Dengan latar belakang teknologi informasi dan kecintaan pada ilmu agama, mengembangkan Santri Online berdasarkan manhaj Aswaja.',
      image: 'https://files.santrionline.com/yogik%20pratama.png',
      speciality: 'Tech & Vision',
    },
    {
      name: 'Tim Ahli Syariah',
      role: 'Content Reviewer',
      description:
        'Para ustadz dan akademisi yang memastikan setiap konten sesuai dengan manhaj Ahli Sunnah wal Jamaah dan mengacu pada kitab-kitab mu&apos;tabarah dari 4 madzhab.',
      image: '/avatar-ulama.jpg',
      speciality: 'Syariah Compliance',
    },
    {
      name: 'Tim Teknologi',
      role: 'Development Team',
      description:
        'Developer berpengalaman yang mengembangkan fitur-fitur platform dengan teknologi modern namun tetap memperhatikan nilai-nilai islami dalam setiap aspek pengembangan.',
      image: '/avatar-tech.jpg',
      speciality: 'Full Stack Development',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tentang{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Santri Online
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Platform edukasi Islam berdasarkan pemahaman Ahli Sunnah wal Jamaah 4 Madzhab yang
              menggabungkan warisan keilmuan ulama salaf dengan teknologi modern untuk menciptakan
              pengalaman belajar yang authentic dan transformatif.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Visi */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Visi Kami</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Menjadi platform edukasi Islam terdepan yang menyebarkan ilmu agama berdasarkan
                    manhaj Ahli Sunnah wal Jamaah 4 Madzhab dengan memanfaatkan teknologi modern
                    untuk mencerdaskan umat dan melestarikan warisan ulama salaf.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Misi */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-2 border-secondary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Misi Kami</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Menyediakan akses mudah terhadap kitab-kitab mu&apos;tabarah dari 4 madzhab
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Membangun jaringan santri beraqidah Ahli Sunnah wal Jamaah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mengintegrasikan teknologi dengan nilai-nilai islami yang shahih</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Melestarikan warisan keilmuan ulama salaf untuk generasi digital</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prinsip-prinsip yang menjadi fondasi dalam setiap langkah pengembangan platform
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <value.icon className={`w-12 h-12 mx-auto mb-4 ${value.color}`} />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Mengapa Memilih Santri Online?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Kami menyediakan solusi lengkap untuk kebutuhan pendidikan Islam berdasarkan manhaj
                Ahli Sunnah wal Jamaah dengan fitur-fitur yang telah dikurasi sesuai kitab-kitab
                mu&apos;tabarah.
              </p>

              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link to="/daftar">Bergabung Sekarang</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://files.santrionline.com/santri%20online%20bersalaman.png"
                  alt="Santri Online - Platform Edukasi Islam"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Floating stats */}
                <motion.div
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-sm">0</div>
                      <div className="text-xs text-muted-foreground">Santri Aktif</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-bold text-sm">0/5</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perjalanan Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Melihat kembali pencapaian dan rencana masa depan Santri Online
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {milestones.map((milestone, index) => (
              <motion.div key={index} className="flex gap-6 pb-8 last:pb-0" variants={itemVariants}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-background rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kenali tim profesional yang berdedikasi membangun platform terbaik untuk Anda
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 object-cover shadow-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full shadow-md">
                          {member.speciality}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-12 text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bergabunglah dengan Revolusi Pendidikan Islam Aswaja
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Jadilah bagian dari jaringan santri yang mempelajari dan mengamalkan ilmu agama
              berdasarkan manhaj Ahli Sunnah wal Jamaah
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4 h-auto">
                <Link to="/daftar">Mulai Perjalanan Anda</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 h-auto border-white/20 text-white hover:bg-white/10"
              >
                <Link to="/biografi-ulama">Biografi Ulama Aswaja</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
