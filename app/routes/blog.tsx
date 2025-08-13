import type { MetaFunction } from "@remix-run/cloudflare";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { ArrowLeft, BookOpen, Calendar, User, ArrowRight, Tag } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Blog - Santri Online" },
    {
      name: "description",
      content: "Baca artikel terbaru seputar edukasi Islam, teknologi, dan tips belajar di blog Santri Online.",
    },
  ];
};

export default function Blog() {
  const featuredArticle = {
    title: "Revolusi Digital dalam Pendidikan Islam: Menyeimbangkan Tradisi dan Inovasi",
    excerpt: "Bagaimana teknologi modern dapat memperkuat pembelajaran Islam tanpa menghilangkan nilai-nilai tradisional pesantren.",
    author: "Ustadz Dr. Ahmad Teknologi",
    date: "1 Agustus 2025",
    readTime: "8 menit",
    category: "Teknologi Islam",
    image: "/blog/featured-digital-revolution.jpg"
  };

  const articles = [
    {
      title: "5 Tips Efektif Menghafal Al-Quran dengan Teknologi",
      excerpt: "Manfaatkan aplikasi dan tools digital untuk mempercepat proses hafalan Al-Quran Anda.",
      author: "Ustadz Hafidz Muda",
      date: "28 Juli 2025",
      readTime: "5 menit",
      category: "Hafalan",
      image: "/blog/tips-hafalan.jpg"
    },
    {
      title: "Membangun Karakter Islami di Era Digital",
      excerpt: "Tantangan dan solusi dalam mendidik karakter islami generasi digital native.",
      author: "Dr. Aisyah Pendidik",
      date: "25 Juli 2025", 
      readTime: "7 menit",
      category: "Pendidikan",
      image: "/blog/karakter-islami.jpg"
    },
    {
      title: "Sukses Berjualan di Marketplace Karya Islami",
      excerpt: "Panduan lengkap untuk santri yang ingin mengembangkan bisnis karya islami online.",
      author: "Kang Entrepreneur",
      date: "22 Juli 2025",
      readTime: "6 menit", 
      category: "Bisnis",
      image: "/blog/marketplace-success.jpg"
    },
    {
      title: "Mengenal Lebih Dekat Fitur Biolink Santri",
      excerpt: "Cara membuat profil digital yang mencerminkan identitas keislaman Anda.",
      author: "Tim Santri Online",
      date: "20 Juli 2025",
      readTime: "4 menit",
      category: "Tutorial",
      image: "/blog/biolink-guide.jpg"
    },
    {
      title: "Komunitas Virtual vs Fisik: Mana yang Lebih Efektif?",
      excerpt: "Perbandingan kelebihan dan kekurangan pembelajaran dalam komunitas virtual dan fisik.",
      author: "Dr. Komunitas Expert",
      date: "18 Juli 2025",
      readTime: "9 menit",
      category: "Komunitas", 
      image: "/blog/virtual-vs-fisik.jpg"
    },
    {
      title: "Teknologi AI dalam Pembelajaran Al-Quran",
      excerpt: "Bagaimana artificial intelligence dapat membantu santri dalam mempelajari Al-Quran.",
      author: "Prof. AI Islamic",
      date: "15 Juli 2025",
      readTime: "10 menit",
      category: "Teknologi Islam",
      image: "/blog/ai-quran.jpg"
    }
  ];

  const categories = [
    "Semua", "Hafalan", "Teknologi Islam", "Pendidikan", "Komunitas", "Bisnis", "Tutorial"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blog Santri Online
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan insight, tips, dan inspirasi seputar edukasi Islam modern, teknologi, dan pengembangan diri
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <Card className="mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary" />
            </div>
            <div className="p-6 lg:p-8">
              <div className="mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {featuredArticle.category}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">{featuredArticle.title}</h2>
              <p className="text-muted-foreground mb-4">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {featuredArticle.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {featuredArticle.date}
                </div>
                <span>{featuredArticle.readTime} baca</span>
              </div>
              <Button asChild>
                <Link to="/blog/featured-article">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-blue-600/5 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              
              <CardHeader className="pb-3">
                <div className="mb-2">
                  <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                    {article.category}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">{article.excerpt}</p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">{article.readTime} baca</span>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/blog/article-${index + 1}`}>
                      Baca
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mb-12">
          <Button variant="outline" size="lg">
            Muat Artikel Lainnya
          </Button>
        </div>

        {/* Community Engagement */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">� Bergabung dengan Komunitas</h2>
            <p className="mb-6 opacity-90 max-w-md mx-auto">
              Bergabunglah dengan ribuan santri lainnya untuk berbagi ilmu dan pengalaman pembelajaran Islam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="secondary" asChild>
                <Link to="/daftar">Daftar Sekarang</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link to="/komunitas">Lihat Komunitas</Link>
              </Button>
            </div>
            <p className="text-xs opacity-70 mt-4">
              Platform pembelajaran Islam gratis untuk semua santri
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
