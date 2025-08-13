import type { MetaFunction } from "@remix-run/cloudflare";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Link } from "@remix-run/react";
import { ArrowLeft, Link as LinkIcon, QrCode, Palette, Globe, BarChart3, Users, Zap, Star, Heart, CheckCircle } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Biolink - Santri Online" },
    {
      name: "description",
      content: "Buat biolink islami yang menawan untuk menghubungkan semua platform digital Anda dalam satu link yang mudah diingat.",
    },
  ];
};

export default function Biolink() {
  const biolinkFeatures = [
    {
      icon: LinkIcon,
      title: "Link Unlimited",
      description: "Tambahkan sebanyak mungkin link tanpa batas untuk semua platform dan konten Anda"
    },
    {
      icon: Palette,
      title: "Template Islami",
      description: "Pilihan template yang indah dengan nuansa islami dan dapat dikustomisasi sesuai brand Anda"
    },
    {
      icon: QrCode,
      title: "QR Code Generator",
      description: "Generate QR code otomatis untuk memudahkan sharing biolink Anda di dunia offline"
    },
    {
      icon: BarChart3,
      title: "Analytics Lengkap",
      description: "Pantau performa biolink dengan analitik detail tentang visitor, clicks, dan engagement"
    },
    {
      icon: Globe,
      title: "Custom Domain",
      description: "Gunakan domain custom Anda sendiri untuk tampilan yang lebih profesional"
    },
    {
      icon: Zap,
      title: "Load Speed Optimal",
      description: "Teknologi modern memastikan biolink Anda loading dengan cepat di semua perangkat"
    }
  ];

  const biolinkTemplates = [
    {
      name: "Dakwah Modern",
      description: "Template clean untuk da'i dan content creator islami",
      preview: "bg-gradient-to-br from-green-400 to-blue-500",
      features: ["Icon mosque", "Quotes Al-Quran", "Social media links", "Contact info"]
    },
    {
      name: "Santri Creative", 
      description: "Template colorful untuk santri yang kreatif dan dinamis",
      preview: "bg-gradient-to-br from-purple-400 to-pink-500", 
      features: ["Animated elements", "Portfolio gallery", "Skills showcase", "Achievement badges"]
    },
    {
      name: "Ustadz Professional",
      description: "Template formal untuk ustadz dan akademisi islam",
      preview: "bg-gradient-to-br from-gray-600 to-blue-800",
      features: ["CV summary", "Publication list", "Schedule kajian", "Consultation booking"]
    },
    {
      name: "Entrepreneur Muslim",
      description: "Template business untuk pengusaha muslim",
      preview: "bg-gradient-to-br from-amber-400 to-orange-600",
      features: ["Product showcase", "Testimonials", "WhatsApp integration", "Payment links"]
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Gratis",
      description: "Untuk pemula yang ingin mencoba biolink",
      features: [
        "5 link maksimal",
        "1 template dasar",
        "Analytics basic", 
        "Support email",
        "Santri Online branding"
      ],
      cta: "Mulai Gratis",
      popular: false
    },
    {
      name: "Pro",
      price: "Gratis",
      description: "Untuk content creator dan da'i aktif",
      features: [
        "Link unlimited",
        "Semua template tersedia",
        "Analytics advanced",
        "Custom domain",
        "Priority support",
        "No branding"
      ],
      cta: "Daftar Sekarang",
      popular: true
    },
    {
      name: "Business",
      price: "Gratis", 
      description: "Untuk organisasi dan bisnis islami",
      features: [
        "Multiple biolinks",
        "Team collaboration",
        "Advanced analytics",
        "API access",
        "White label solution",
        "Dedicated support"
      ],
      cta: "Mulai Sekarang",
      popular: false
    }
  ];

  const useCases = [
    {
      title: "Da'i & Content Creator",
      description: "Hubungkan semua platform dakwah Anda dalam satu link yang mudah diingat",
      icon: Users,
      benefits: [
        "Link ke semua media sosial",
        "Katalog kajian dan video",
        "Donasi dan support links",
        "Jadwal ceramah dan event"
      ]
    },
    {
      title: "Santri & Mahasiswa",
      description: "Portfolio digital untuk menampilkan karya dan pencapaian akademik",
      icon: Star,
      benefits: [
        "CV dan portfolio online",
        "Link ke karya tulis",
        "Achievement showcase",
        "Contact information"
      ]
    },
    {
      title: "Bisnis Halal",
      description: "Promosikan produk dan layanan dengan cara yang islami dan profesional",
      icon: Heart,
      benefits: [
        "Katalog produk halal",
        "Testimoni pelanggan",
        "Link ke toko online",
        "Customer service access"
      ]
    }
  ];

  const bioLinkStats = [
    { number: "500+", label: "Biolink Aktif" },
    { number: "50K+", label: "Clicks per Bulan" },
    { number: "15+", label: "Template Tersedia" },
    { number: "99%", label: "Uptime Guarantee" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LinkIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Biolink Islami
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Buat biolink yang menawan dengan template islami untuk menghubungkan semua platform digital Anda dalam satu link yang mudah diingat dan mudah dibagikan.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {biolinkFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Template Pilihan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {biolinkTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-full h-32 ${template.preview} rounded-lg mb-4 flex items-center justify-center`}>
                    <LinkIcon className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <p className="text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline">
                    Preview Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Siapa Yang Cocok?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <useCase.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Paket Gratis Untuk Semua</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${plan.popular ? 'border-2 border-primary' : ''}`}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-4 bg-primary">Paling Populer</Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-primary' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Dipercaya Oleh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bioLinkStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Cara Membuatnya</CardTitle>
            <p className="text-center text-muted-foreground">
              Mudah dan cepat, dalam 3 langkah sederhana
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-semibold mb-2">Pilih Template</h3>
                <p className="text-muted-foreground text-sm">Pilih dari 15+ template islami yang tersedia</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-semibold mb-2">Kustomisasi</h3>
                <p className="text-muted-foreground text-sm">Tambahkan link, foto, dan sesuaikan dengan brand Anda</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-semibold mb-2">Bagikan</h3>
                <p className="text-muted-foreground text-sm">Dapatkan link unik dan mulai bagikan ke audiens Anda</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Siap Membuat Biolink Islami Anda?</h2>
            <p className="text-xl mb-6 opacity-90">
              Mulai gratis dan hubungkan semua platform digital Anda dalam satu link yang menawan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" variant="secondary" className="flex-1">
                <Link to="/daftar" className="flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Buat Biolink Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 flex-1">
                <Link to="/kontak" className="flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Tanya Tim Kami
                </Link>
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              ✨ Gratis selamanya • Setup dalam 5 menit • Template berkualitas tersedia
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
