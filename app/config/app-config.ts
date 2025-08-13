// Konfigurasi aplikasi untuk Platform Digital Terintegrasi Santri
// File ini berisi informasi owner dan panduan konten

export const APP_CONFIG = {
  // Informasi Pemilik Platform
  owner: {
    name: "Yogik Pratama Aprilian",
    photo: "https://files.santrionline.com/yogik%20pratama.png",
    project: {
      name: "Platform Digital Terintegrasi untuk Santri",
      description: "Super App untuk komunitas santri dan pesantren",
      type: "Super App",
      targetAudience: "Santri dan Pesantren"
    }
  },

  // Website dan Domain
  websites: {
    primary: "santrionline.com",
    secondary: "santrionline.my.id"
  },

  // Media Sosial (tautan resmi)
  socialMedia: {
    instagram: "https://instagram.com/idsantrionline",
    facebook: "https://facebook.com/santrionline.my.id",
    tiktok: "https://www.tiktok.com/@santrionline.com",
    youtube: "https://www.youtube.com/@websantri",
    twitter: "https://x.com/Websantrionline"
  },

  // Platform E-commerce
  ecommerce: {
    shopee: "https://shopee.co.id/onlinesantri",
    tokopedia: "https://tokopedia.com/santrionline"
  },

  // Panduan Konten dan Komunikasi
  contentGuidelines: {
    // Perspektif keagamaan yang digunakan
    religiousPerspective: "Ahlus Sunnah wal Jama'ah",
    
    // Dasar rujukan
    reference: "4 mazhab dan tasawuf",
    
    // Yang harus dihindari
    avoid: "Pandangan yang menyerupai Wahabi",
    
    // Gaya penjelasan
    explanationStyle: "Berikan penjelasan untuk istilah asing atau bahasa gaul dengan tanda kurung",
    
    // Panduan bantuan teknis
    codingAssistance: "Jelaskan lokasi file atau folder secara spesifik saat memberikan bantuan koding"
  },

  // Metadata aplikasi
  app: {
    name: "Santri Online",
    description: "Platform Digital Terintegrasi untuk Santri",
    version: "1.0.0",
    keywords: ["santri", "pesantren", "islam", "platform", "super-app", "ahlus-sunnah"]
  }
} as const;

// Type definitions untuk TypeScript
export type AppConfig = typeof APP_CONFIG;
export type SocialMediaPlatform = keyof typeof APP_CONFIG.socialMedia;
export type EcommercePlatform = keyof typeof APP_CONFIG.ecommerce;
