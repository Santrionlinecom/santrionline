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
    { title: "Aqidatul Awam - Kitab Mu'tabarah Santri Online" },
    {
      name: "description",
      content: "Pelajari kitab Aqidatul Awam secara online dengan penjelasan lengkap 20 sifat wajib Allah, sifat Rasul, dan dasar-dasar aqidah Ahli Sunnah wal Jamaah.",
    },
    {
      name: "keywords",
      content: "aqidatul awam, 20 sifat allah, aqidah aswaja, syaikh ahmad zaini dahlan, kitab aqidah"
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
    </CardContent>
  </Card>
);

export default function AqidatulAwam() {
  const [currentTab, setCurrentTab] = useState("overview");
  
  const kitabData = {
    id: 1,
    name: "Aqidatul Awam",
    subtitle: "Kitab Dasar Aqidah Ahlussunnah wal Jama'ah",
    author: "Syaikh Ahmad Zaini Dahlan",
    category: "Aqidah",
    description: "Kitab dasar aqidah Ahlussunnah wal Jama'ah yang mengajarkan sifat-sifat wajib, mustahil, dan jaiz bagi Allah dan Rasul-Nya. Sangat cocok untuk pemula yang ingin memahami dasar-dasar akidah Islam.",
    totalLessons: 20,
    completedLessons: 8,
    progress: 40,
    duration: "2-3 bulan",
    difficulty: "Pemula",
    students: 1250,
    rating: 4.9,
    reviews: 356,
    features: [
      "20 Sifat Wajib Allah SWT",
      "4 Sifat Mustahil bagi Allah",
      "Sifat-sifat Rasul",
      "Rukun Iman yang Enam",
      "Dalil Al-Quran & Hadits",
      "Terjemahan & Penjelasan",
      "Hafalan dengan Nada",
      "Latihan Soal"
    ],
    objectives: [
      "Memahami dan menghafalkan 20 sifat wajib Allah SWT",
      "Mengetahui sifat-sifat mustahil bagi Allah",
      "Memahami sifat-sifat wajib, mustahil, dan jaiz bagi Rasul",
      "Menguasai dasar-dasar aqidah Ahlussunnah wal Jama'ah",
      "Mampu menjelaskan dalil-dalil aqidah dari Al-Quran dan Hadits"
    ]
  };
  
  const lessons = [
    {
      number: 1,
      title: "Pengenalan Kitab Aqidatul Awam",
      description: "Sejarah, tujuan, dan sistematika pembelajaran kitab Aqidatul Awam",
      duration: 15,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 2,
      title: "20 Sifat Wajib Allah - Bagian 1",
      description: "Wujud, Qidam, Baqa, Mukhalafatu lil Hawadits, Qiyamu binafsihi",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 3,
      title: "20 Sifat Wajib Allah - Bagian 2", 
      description: "Wahdaniyyah, Qudrah, Iradah, Ilmu, Hayah",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 4,
      title: "20 Sifat Wajib Allah - Bagian 3",
      description: "Sam'u, Bashar, Kalam, Qadiran, Muridan",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 5,
      title: "20 Sifat Wajib Allah - Bagian 4",
      description: "Aliman, Hayyan, Sami'an, Bashiran, Mutakalliman",
      duration: 25,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 6,
      title: "Hafalan 20 Sifat dengan Nada",
      description: "Praktik hafalan 20 sifat wajib Allah dengan nada tradisional",
      duration: 30,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 7,
      title: "Dalil-dalil 20 Sifat dari Al-Quran",
      description: "Ayat-ayat Al-Quran yang menunjukkan sifat-sifat Allah",
      duration: 35,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 8,
      title: "4 Sifat Mustahil bagi Allah",
      description: "Adam, Huduts, Fana, Mumasilatu lil Hawadits",
      duration: 20,
      isCompleted: true,
      isUnlocked: true
    },
    {
      number: 9,
      title: "Sifat Jaiz bagi Allah",
      description: "Fi'lu kulli mumkinin aw tarkuhu - penjelasan lengkap",
      duration: 20,
      isCompleted: false,
      isUnlocked: true
    },
    {
      number: 10,
      title: "4 Sifat Wajib bagi Rasul",
      description: "Shidqu, Amanah, Tabligh, Fathanah",
      duration: 25,
      isCompleted: false,
      isUnlocked: true
    },
    {
      number: 11,
      title: "4 Sifat Mustahil bagi Rasul",
      description: "Kizbu, Khiyanah, Kitman, Baladah",
      duration: 25,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 12,
      title: "Sifat Jaiz bagi Rasul",
      description: "A'radhu al-basyariyyah - sifat kemanusiaan Rasul",
      duration: 20,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 13,
      title: "Rukun Iman - Iman kepada Allah",
      description: "Pendalaman makna iman kepada Allah SWT",
      duration: 30,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 14,
      title: "Rukun Iman - Iman kepada Malaikat",
      description: "Nama-nama malaikat dan tugasnya",
      duration: 25,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 15,
      title: "Rukun Iman - Iman kepada Kitab",
      description: "Kitab-kitab Allah yang diturunkan kepada para Rasul",
      duration: 25,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 16,
      title: "Rukun Iman - Iman kepada Rasul",
      description: "25 Rasul yang wajib diketahui namanya",
      duration: 30,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 17,
      title: "Rukun Iman - Iman kepada Hari Akhir",
      description: "Peristiwa-peristiwa di akhirat dan tanda-tanda kiamat",
      duration: 35,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 18,
      title: "Rukun Iman - Iman kepada Qada dan Qadar",
      description: "Memahami takdir baik dan buruk dari Allah",
      duration: 30,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 19,
      title: "Evaluasi dan Latihan Soal",
      description: "Ujian pemahaman keseluruhan materi Aqidatul Awam",
      duration: 45,
      isCompleted: false,
      isUnlocked: false
    },
    {
      number: 20,
      title: "Implementasi dalam Kehidupan",
      description: "Cara mengamalkan aqidah dalam kehidupan sehari-hari",
      duration: 25,
      isCompleted: false,
      isUnlocked: false
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
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Progress Pembelajaran</span>
                  <span className="text-sm text-muted-foreground">
                    {kitabData.completedLessons}/{kitabData.totalLessons} pelajaran
                  </span>
                </div>
                <Progress value={kitabData.progress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Anda telah menyelesaikan {kitabData.progress}% dari kitab ini
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
                        <div className="text-muted-foreground">Pelajaran</div>
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
                      Lanjutkan Belajar
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
              <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
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
                  <h3 className="text-xl font-bold">Daftar Pelajaran</h3>
                  <span className="text-sm text-muted-foreground">
                    {lessons.filter(l => l.isCompleted).length} dari {lessons.length} selesai
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
                    title: "Materi Lengkap",
                    description: "20 pelajaran komprehensif dengan penjelasan detail"
                  },
                  {
                    icon: Play,
                    title: "Video Pembelajaran",
                    description: "Video berkualitas tinggi dengan audio jernih"
                  },
                  {
                    icon: Download,
                    title: "Materi Download",
                    description: "PDF dan audio dapat diunduh untuk belajar offline"
                  },
                  {
                    icon: Target,
                    title: "Latihan Soal",
                    description: "Kuis dan evaluasi untuk mengukur pemahaman"
                  },
                  {
                    icon: Award,
                    title: "Sertifikat",
                    description: "Sertifikat penyelesaian setelah lulus evaluasi"
                  },
                  {
                    icon: Users,
                    title: "Diskusi Grup",
                    description: "Forum diskusi dengan sesama santri dan ustadz"
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
