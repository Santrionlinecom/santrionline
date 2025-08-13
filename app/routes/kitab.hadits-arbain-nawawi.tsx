import React, { useState } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  BookOpen,
  Clock,
  User,
  Star,
  Play,
  Download,
  Heart,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Target,
  Award,
  Users,
  Calendar
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Hadits Arbain Nawawi - Kitab Mu'tabarah Santri Online" },
    {
      name: "description",
      content: "Pelajari 40 hadits pilihan Imam Nawawi secara online. Setiap hadits dijelaskan dengan terjemahan, makna, hikmah, dan aplikasi dalam kehidupan sehari-hari.",
    },
    {
      name: "keywords",
      content: "hadits arbain nawawi, 40 hadits, imam nawawi, hadits shahih, terjemahan hadits"
    }
  ];
};

const LessonCard = ({ lesson, isUnlocked }: { lesson: any; isUnlocked: boolean }) => (
  <Card className={`border transition-all duration-300 ${isUnlocked ? 'hover:shadow-md cursor-pointer' : 'opacity-60'}`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            lesson.isCompleted ? 'bg-green-100 text-green-600' : 
            isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            {lesson.isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <span className="text-sm font-bold">{lesson.number}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm">{lesson.title}</h4>
            <p className="text-xs text-muted-foreground">{lesson.duration} menit</p>
          </div>
        </div>
        {isUnlocked && (
          <Button size="sm" variant={lesson.isCompleted ? "outline" : "default"}>
            <Play className="w-4 h-4 mr-1" />
            {lesson.isCompleted ? "Ulangi" : "Mulai"}
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
      {lesson.haditsText && (
        <div className="mt-2 p-2 bg-muted/20 rounded text-xs">
          <p className="font-arabic text-right mb-1">{lesson.haditsText}</p>
          <p className="text-muted-foreground italic">{lesson.meaning}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function HaditsArbainNawawi() {
  const [currentTab, setCurrentTab] = useState("overview");
  
  const kitabData = {
    id: 4,
    name: "Hadits Arbain Nawawi",
    subtitle: "40 Hadits Pilihan Imam Nawawi",
    author: "Imam Yahya bin Syaraf An-Nawawi",
    category: "Hadits",
    description: "Kumpulan 40 hadits pilihan Imam Nawawi yang mencakup dasar-dasar ajaran Islam. Setiap hadits dijelaskan dengan terjemahan, makna, dan hikmahnya secara lengkap, serta aplikasi dalam kehidupan sehari-hari.",
    totalLessons: 40,
    completedLessons: 40,
    progress: 100,
    duration: "3-4 bulan",
    difficulty: "Pemula",
    students: 2100,
    rating: 4.9,
    reviews: 456,
    features: [
      "40 Hadits Shahih",
      "Terjemahan Lengkap",
      "Penjelasan Makna",
      "Hikmah & Faedah",
      "Aplikasi Kehidupan",
      "Sanad Hadits",
      "Audio Murotal",
      "Latihan Hafalan"
    ],
    objectives: [
      "Memahami dan menghafalkan 40 hadits pilihan Imam Nawawi",
      "Mengetahui terjemahan dan makna setiap hadits",
      "Memahami hikmah dan faedah dari setiap hadits",
      "Mampu mengaplikasikan hadits dalam kehidupan sehari-hari",
      "Mengenal sanad dan kualitas setiap hadits"
    ]
  };
  
  const lessons = [
    {
      number: 1,
      title: "Hadits 1: Innama al-A'malu bin-Niyyat",
      description: "Hadits tentang niat - Sesungguhnya segala amalan tergantung niatnya",
      duration: 20,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
      meaning: "Sesungguhnya segala amalan tergantung niatnya"
    },
    {
      number: 2,
      title: "Hadits 2: Rukun Islam",
      description: "Hadits tentang lima rukun Islam yang wajib diketahui setiap muslim",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ",
      meaning: "Islam dibangun atas lima perkara"
    },
    {
      number: 3,
      title: "Hadits 3: Rukun Iman",
      description: "Hadits tentang enam rukun iman yang harus diyakini setiap muslim",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ",
      meaning: "Hendaklah engkau beriman kepada Allah, malaikat-Nya..."
    },
    {
      number: 4,
      title: "Hadits 4: Tahapan Penciptaan Manusia",
      description: "Hadits tentang proses penciptaan manusia dalam rahim ibu",
      duration: 30,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ",
      meaning: "Sesungguhnya salah seorang dari kalian dikumpulkan penciptaannya..."
    },
    {
      number: 5,
      title: "Hadits 5: Bid'ah dan Penolakan Amalan",
      description: "Hadits tentang penolakan amalan yang tidak ada dasarnya dalam agama",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "مَنْ أَحْدَثَ فِي أَمْرِنَا",
      meaning: "Barangsiapa yang mengada-ada dalam perkara kami..."
    },
    {
      number: 6,
      title: "Hadits 6: Halal dan Haram",
      description: "Hadits tentang perkara halal yang jelas dan haram yang jelas",
      duration: 30,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "إِنَّ الْحَلَالَ بَيِّنٌ",
      meaning: "Sesungguhnya yang halal itu jelas..."
    },
    {
      number: 7,
      title: "Hadits 7: Agama adalah Nasihat",
      description: "Hadits tentang esensi agama adalah memberikan nasihat yang baik",
      duration: 20,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "الدِّينُ النَّصِيحَةُ",
      meaning: "Agama adalah nasihat"
    },
    {
      number: 8,
      title: "Hadits 8: Larangan Menyakiti Muslim",
      description: "Hadits tentang larangan menyakiti sesama muslim dengan lisan dan tangan",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ",
      meaning: "Muslim adalah orang yang muslimin lain selamat dari lisan dan tangannya"
    },
    {
      number: 9,
      title: "Hadits 9: Mengamalkan yang Diperintahkan",
      description: "Hadits tentang perintah mengamalkan yang diperintahkan dan menjauhi larangan",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ",
      meaning: "Apa yang aku larang maka jauhilah..."
    },
    {
      number: 10,
      title: "Hadits 10: Rizki yang Baik",
      description: "Hadits tentang Allah menerima sedekah dari rizki yang halal dan baik",
      duration: 25,
      isCompleted: true,
      isUnlocked: true,
      haditsText: "إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا",
      meaning: "Sesungguhnya Allah itu baik, tidak menerima kecuali yang baik"
    },
    {
      number: 11,
      title: "Hadits 11: Meninggalkan yang Syubhat",
      description: "Hadits tentang meninggalkan perkara yang meragukan untuk menjaga agama",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 12,
      title: "Hadits 12: Kebaikan Islam Seseorang",
      description: "Hadits tentang tanda kebaikan Islam seseorang adalah meninggalkan yang tidak berguna",
      duration: 20,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 13,
      title: "Hadits 13: Cinta kepada Saudara",
      description: "Hadits tentang tidak sempurna iman seseorang sampai mencintai saudaranya",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 14,
      title: "Hadits 14: Haram Darah Muslim",
      description: "Hadits tentang haramnya darah, harta, dan kehormatan sesama muslim",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 15,
      title: "Hadits 15: Beriman kepada Allah dan Hari Akhir",
      description: "Hadits tentang adab berkata baik atau diam bagi yang beriman",
      duration: 20,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 16,
      title: "Hadits 16: Jangan Marah",
      description: "Hadits tentang nasihat Rasulullah agar tidak marah",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 17,
      title: "Hadits 17: Berbuat Baik pada Semua",
      description: "Hadits tentang Allah mewajibkan berbuat baik dalam segala hal",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 18,
      title: "Hadits 18: Takwa dan Akhlaq Baik",
      description: "Hadits tentang takwa kepada Allah dan berakhlaq baik kepada manusia",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 19,
      title: "Hadits 19: Bertakwa dan Yakin kepada Takdir",
      description: "Hadits tentang takwa kepada Allah dan yakin bahwa yang menimpa tidak akan meleset",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 20,
      title: "Hadits 20: Malu Sebagian dari Iman",
      description: "Hadits tentang malu adalah sebagian dari iman",
      duration: 20,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 21,
      title: "Hadits 21: Istiqamah",
      description: "Hadits tentang berkata 'Aku beriman kepada Allah' kemudian istiqamah",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 22,
      title: "Hadits 22: Jalan Menuju Surga",
      description: "Hadits tentang amalan-amalan yang mengantarkan ke surga",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 23,
      title: "Hadits 23: Kesucian dan Wudhu",
      description: "Hadits tentang kesucian adalah setengah dari iman",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 24,
      title: "Hadits 24: Larangan Zulm",
      description: "Hadits tentang Allah mengharamkan kezaliman atas diri-Nya",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 25,
      title: "Hadits 25: Setiap Ruas Sedekah",
      description: "Hadits tentang setiap ruas tulang manusia ada sedekahnya setiap hari",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 26,
      title: "Hadits 26: Kebaikan pada Semua Makhluk",
      description: "Hadits tentang kebaikan pada setiap makhluk hidup mendapat pahala",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 27,
      title: "Hadits 27: Kebajikan dan Dosa",
      description: "Hadits tentang definisi kebajikan dan dosa menurut hati nurani",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 28,
      title: "Hadits 28: Sunnah dan Bid'ah",
      description: "Hadits tentang mengikuti sunnah dan menjauhi bid'ah",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 29,
      title: "Hadits 29: Jalan Menuju Surga",
      description: "Hadits tentang orang yang Allah kehendaki kebaikannya",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 30,
      title: "Hadits 30: Hudud Allah",
      description: "Hadits tentang batasan-batasan Allah yang halal dan haram",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 31,
      title: "Hadits 31: Zuhud di Dunia",
      description: "Hadits tentang zuhud terhadap dunia agar dicintai Allah",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 32,
      title: "Hadits 32: Tidak Boleh Mudarat",
      description: "Hadits tentang tidak boleh membahayakan dan membalas bahaya",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 33,
      title: "Hadits 33: Beban Pembuktian",
      description: "Hadits tentang pembuktian atas yang menuduh dan sumpah atas yang mengingkari",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 34,
      title: "Hadits 34: Mengingkari Kemungkaran",
      description: "Hadits tentang mengubah kemungkaran dengan tangan, lisan, atau hati",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 35,
      title: "Hadits 35: Tidak Saling Iri",
      description: "Hadits tentang larangan saling iri, saling memutus, dan saling membelakangi",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 36,
      title: "Hadits 36: Melepaskan Kesusahan Muslim",
      description: "Hadits tentang Allah melepaskan kesusahan orang yang melepaskan kesusahan muslim",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 37,
      title: "Hadits 37: Kebaikan Allah",
      description: "Hadits tentang Allah menulis kebaikan dan keburukan kemudian menjelaskannya",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 38,
      title: "Hadits 38: Cinta Allah kepada Hamba",
      description: "Hadits tentang Allah berkata 'Aku sebagaimana prasangka hamba-Ku kepada-Ku'",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 39,
      title: "Hadits 39: Maaf Allah kepada Umat",
      description: "Hadits tentang Allah memaafkan umat ini dari kesalahan, lupa, dan keterpaksaan",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 40,
      title: "Hadits 40: Zuhud di Dunia",
      description: "Hadits penutup tentang zuhud terhadap dunia dan mengutamakan akhirat",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Button variant="ghost" asChild>
              <Link to="/kitab">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Kitab
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-2">{kitabData.category}</Badge>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {kitabData.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">{kitabData.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {kitabData.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {kitabData.rating} ({kitabData.reviews} ulasan)
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{kitabData.description}</p>
              
              {/* Progress */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Pembelajaran Selesai</span>
                </div>
                <Progress value={100} className="h-2 mb-2 bg-green-100" />
                <p className="text-sm text-green-700">
                  Selamat! Anda telah menyelesaikan semua 40 hadits dalam kitab ini
                </p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Informasi Kitab</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{kitabData.totalLessons}</div>
                        <div className="text-muted-foreground">Hadits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{kitabData.duration}</div>
                        <div className="text-muted-foreground">Durasi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{kitabData.difficulty}</div>
                        <div className="text-muted-foreground">Tingkat</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{kitabData.students}+</div>
                        <div className="text-muted-foreground">Santri</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Mulai Belajar
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Favorit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Bagikan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-96">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Hadits</TabsTrigger>
              <TabsTrigger value="features">Fitur</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Tujuan Pembelajaran</h3>
                  <div className="space-y-3">
                    {kitabData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Yang Akan Anda Pelajari</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {kitabData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Daftar 40 Hadits</h3>
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Semua hadits tersedia
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {lessons.map((lesson) => (
                    <LessonCard 
                      key={lesson.number} 
                      lesson={lesson} 
                      isUnlocked={lesson.isUnlocked}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: BookOpen,
                    title: "40 Hadits Shahih",
                    description: "Koleksi hadits pilihan berkualitas shahih dari Imam Nawawi"
                  },
                  {
                    icon: Play,
                    title: "Audio Murotal",
                    description: "Mendengarkan hadits dengan suara merdu dan pelafalan yang benar"
                  },
                  {
                    icon: Download,
                    title: "Materi Download",
                    description: "PDF teks Arab, terjemahan, dan audio dapat diunduh"
                  },
                  {
                    icon: Target,
                    title: "Aplikasi Praktis",
                    description: "Contoh penerapan hadits dalam kehidupan sehari-hari"
                  },
                  {
                    icon: Award,
                    title: "Sertifikat Hafalan",
                    description: "Sertifikat setelah berhasil menghafalkan 40 hadits"
                  },
                  {
                    icon: Users,
                    title: "Diskusi Makna",
                    description: "Forum diskusi pemahaman dan hikmah setiap hadits"
                  }
                ].map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ulasan Santri</h3>
                <p className="text-muted-foreground mb-4">
                  Fitur ulasan akan segera tersedia untuk memberikan feedback dan pengalaman pembelajaran
                </p>
                <Badge variant="secondary">Segera Hadir</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
