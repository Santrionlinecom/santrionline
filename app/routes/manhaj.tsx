import { type MetaFunction } from '@remix-run/cloudflare';
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  MapPin,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Lightbulb,
  Target,
  BookMarked,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Manhaj Salaf - Pemahaman Ahli Sunnah wal Jamaah | Santri Online' },
    {
      name: 'description',
      content:
        'Pelajari manhaj salaf yang dianut oleh Ahli Sunnah wal Jamaah 4 madzhab. Memahami sejarah, tokoh, dan implementasi manhaj salaf dalam pembelajaran Islam yang benar.',
    },
    {
      name: 'keywords',
      content:
        'manhaj salaf, ahli sunnah wal jamaah, 4 madzhab, ulama salaf, pemahaman islam, aqidah salaf, fiqih salaf',
    },
  ];
};

export default function ManhajSalaf() {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Timeline data for Manhaj Salaf history
  const timelineData = [
    {
      period: 'Generasi Pertama (Sahabat)',
      years: '632 - 661 M',
      title: 'Periode Khulafaur Rasyidin',
      description: 'Masa keemasan Islam di bawah kepemimpinan 4 khalifah yang mendapat ridha Allah',
      key_figures: [
        'Abu Bakar as-Siddiq',
        'Umar ibn Khattab',
        'Utsman ibn Affan',
        'Ali ibn Abi Thalib',
      ],
      characteristics: [
        'Pemahaman langsung dari Rasulullah ﷺ',
        'Praktik Islam yang murni',
        "Tidak ada bid'ah dan penyimpangan",
        'Persatuan umat yang kuat',
      ],
      icon: '👑',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      period: "Generasi Kedua (Tabi'in)",
      years: '661 - 750 M',
      title: "Masa Tabi'in dan Tabi'ut Tabi'in",
      description: 'Generasi yang belajar langsung dari para sahabat dan meneruskan ajaran murni',
      key_figures: ['Imam Abu Hanifah', 'Imam Malik', 'Hasan al-Basri', "Sa'id ibn Musayyab"],
      characteristics: [
        'Menerima ilmu dari para sahabat',
        'Kodifikasi hadits dan fiqih',
        'Pembentukan madzhab-madzhab',
        'Pemurnian aqidah dari pengaruh asing',
      ],
      icon: '📚',
      color: 'from-green-400 to-emerald-500',
    },
    {
      period: "Generasi Ketiga (Atba'ut Tabi'in)",
      years: '750 - 850 M',
      title: 'Penyempurnaan Madzhab Empat',
      description: 'Masa penyempurnaan metodologi dan sistematisasi ilmu-ilmu Islam',
      key_figures: ["Imam Syafi'i", 'Imam Ahmad', 'Imam Bukhari', 'Imam Muslim'],
      characteristics: [
        'Penyempurnaan 4 madzhab fiqih',
        'Kodifikasi hadits shahih',
        'Sistematisasi ushul fiqih',
        'Pemurnian aqidah Ahlussunnah',
      ],
      icon: '⚖️',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      period: 'Era Penyebaran',
      years: '850 - 1200 M',
      title: 'Penyebaran dan Pengembangan',
      description: 'Masa penyebaran manhaj salaf ke seluruh dunia Islam dan pengembangan ilmu',
      key_figures: ['Imam al-Ghazali', 'Ibn Taimiyah', 'Imam an-Nawawi', 'Al-Qurtubi'],
      characteristics: [
        'Penyebaran ke seluruh dunia Islam',
        'Pengembangan tasawuf yang benar',
        'Penguatan metodologi',
        "Pemurnian dari bid'ah",
      ],
      icon: '🌍',
      color: 'from-purple-400 to-pink-500',
    },
  ];

  // Core principles of Manhaj Salaf
  const corePrinciples = [
    {
      title: 'Al-Quran dan As-Sunnah',
      description: 'Berpegang teguh pada Al-Quran dan Sunnah Rasulullah ﷺ sebagai sumber utama',
      icon: BookOpen,
      color: 'bg-green-500',
      details: [
        'Al-Quran sebagai pedoman utama',
        'Sunnah sebagai penjelas Al-Quran',
        'Tidak menambah atau mengurangi',
        'Mengikuti pemahaman salaf',
      ],
    },
    {
      title: "Ijma' Ulama Salaf",
      description: 'Mengikuti kesepakatan ulama salaf dalam memahami nash-nash syariat',
      icon: Users,
      color: 'bg-blue-500',
      details: [
        "Ijma' sahabat sebagai hujjah",
        'Pendapat mayoritas ulama salaf',
        'Tidak menyimpang dari kesepakatan',
        "Menghormati perbedaan yang mu'tabar",
      ],
    },
    {
      title: 'Qiyas yang Shahih',
      description: 'Menggunakan analogi yang benar sesuai dengan kaidah yang ditetapkan salaf',
      icon: Target,
      color: 'bg-orange-500',
      details: [
        'Qiyas berdasarkan nash yang jelas',
        'Mengikuti kaidah ushul fiqih',
        'Tidak bertentangan dengan nash',
        'Sesuai dengan maqashid syariah',
      ],
    },
    {
      title: "Menghindari Bid'ah",
      description: "Menjauhi segala bentuk bid'ah dan khurafat yang tidak ada asalnya dalam Islam",
      icon: CheckCircle,
      color: 'bg-red-500',
      details: [
        'Berpegang pada sunnah Rasul ﷺ',
        "Menolak bid'ah dalam aqidah",
        "Menolak bid'ah dalam ibadah",
        'Kembali kepada pemahaman salaf',
      ],
    },
  ];

  // Implementation in Santri Online platform
  const platformImplementation = [
    {
      feature: "Kurikulum Berbasis Kitab Mu'tabar",
      description: 'Menggunakan kitab-kitab yang diakui oleh ulama Ahlussunnah',
      examples: ['Aqidatul Awam', 'Safinatun Najah', 'Hadits Arbain Nawawi', 'Bidayatul Hidayah'],
      icon: BookMarked,
      link: '/kitab',
    },
    {
      feature: 'Biografi Ulama Salaf',
      description: 'Mempelajari riwayat hidup dan pemikiran ulama-ulama besar',
      examples: ['4 Imam Madzhab', 'Ulama Hadits', 'Ulama Aqidah', 'Ulama Tasawuf'],
      icon: Star,
      link: '/biografi-ulama',
    },
    {
      feature: 'Metode Pembelajaran Bertingkat',
      description: 'Sistem pembelajaran yang mengikuti metodologi pesantren salaf',
      examples: [
        'Mulai dari dasar',
        'Bertahap dan sistematis',
        'Dibimbing ustadz',
        'Evaluasi berkala',
      ],
      icon: Clock,
      link: '/dashboard',
    },
    {
      feature: 'Komunitas Santri Aswaja',
      description: 'Membangun komunitas yang berpegang pada manhaj salaf',
      examples: ['Diskusi ilmiah', 'Saling mengingatkan', 'Berbagi ilmu', 'Silaturrahmi'],
      icon: Heart,
      link: '/komunitas',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/images/islamic-pattern.svg')",
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat',
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Lightbulb className="w-5 h-5" />
              <span className="text-sm font-medium">Manhaj yang Lurus</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Manhaj <span className="text-yellow-300">Salaf</span>
            </h1>

            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Memahami dan mengikuti jalan yang ditempuh oleh para <strong>Salafus Shalih</strong>
              dalam memahami dan mengamalkan ajaran Islam
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kitab">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Mulai Belajar
                </Button>
              </Link>
              <Link to="/biografi-ulama">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Biografi Ulama
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Definition Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Apa itu Manhaj Salaf?</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-white to-green-50 border-green-200">
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Manhaj Salaf</strong> adalah jalan atau metode yang ditempuh oleh para
                  <strong> Salafus Shalih</strong> (generasi terdahulu yang shalih) dalam memahami,
                  mengamalkan, dan menyebarkan ajaran Islam sesuai dengan Al-Quran dan As-Sunnah.
                </p>

                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">Hadits Rasulullah ﷺ:</h3>
                  <blockquote className="text-gray-700 italic text-center border-l-4 border-green-500 pl-4">
                    &quot;خَيْرُ النَّاسِ قَرْنِي ثُمَّ الَّذِينَ يَلُونَهُمْ ثُمَّ الَّذِينَ
                    يَلُونَهُمْ&quot;
                  </blockquote>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    "Sebaik-baik manusia adalah generasiku, kemudian generasi sesudahnya, kemudian
                    generasi sesudahnya lagi." (HR. Bukhari & Muslim)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sejarah Perkembangan Manhaj Salaf
          </h2>

          <div className="space-y-8">
            {timelineData.map((period, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeTimeline === index ? 'ring-2 ring-green-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveTimeline(activeTimeline === index ? -1 : index)}
                >
                  <CardHeader className={`bg-gradient-to-r ${period.color} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{period.icon}</div>
                        <div>
                          <CardTitle className="text-xl">{period.title}</CardTitle>
                          <p className="opacity-90">{period.years}</p>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-6 h-6 transition-transform duration-300 ${
                          activeTimeline === index ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{period.description}</p>

                    {activeTimeline === index && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Tokoh Utama:</h4>
                          <div className="flex flex-wrap gap-2">
                            {period.key_figures.map((figure, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {figure}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Karakteristik:</h4>
                          <ul className="grid sm:grid-cols-2 gap-2">
                            {period.characteristics.map((char, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{char}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Core Principles */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Prinsip Dasar Manhaj Salaf
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {corePrinciples.map((principle, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${principle.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <principle.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{principle.description}</p>
                  <ul className="space-y-2">
                    {principle.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Implementation in Platform */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Implementasi di Platform Santri Online
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Bagaimana kami menerapkan manhaj salaf dalam sistem pembelajaran digital
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {platformImplementation.map((impl, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <impl.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{impl.feature}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{impl.description}</p>
                  <div className="space-y-2 mb-4">
                    {impl.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{example}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={impl.link}>
                    <Button className="w-full group-hover:bg-green-600 transition-colors">
                      Jelajahi
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Mulai Perjalanan Anda</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan santri yang belajar dengan manhaj salaf di platform
                Santri Online
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/daftar">
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
                  >
                    Daftar Sekarang
                  </Button>
                </Link>
                <Link to="/kitab">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8"
                  >
                    Jelajahi Kitab
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
