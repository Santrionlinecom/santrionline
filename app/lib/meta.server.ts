import { MetaFunction } from '@remix-run/cloudflare';

export const defaultMeta = [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { title: 'Santri Online - Platform Edukasi Islam Modern' },
  {
    name: 'description',
    content:
      'Platform edukasi Islam terdepan dengan fitur hafalan Al-Quran, marketplace karya islami, dan sistem pembelajaran diniyah yang interaktif.',
  },
  { name: 'robots', content: 'index,follow' },
  { name: 'author', content: 'Santri Online' },

  // Open Graph / Facebook
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: 'Santri Online - Platform Edukasi Islam Modern' },
  {
    property: 'og:description',
    content:
      'Bergabunglah dengan ribuan santri dalam platform edukasi Islam modern. Hafalan Al-Quran dan marketplace karya islami siap mendukung perjalanan belajar Anda.',
  },
  { property: 'og:image', content: '/logo-dark.png' },
  { property: 'og:site_name', content: 'Santri Online' },

  // Twitter
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Santri Online - Platform Edukasi Islam Modern' },
  {
    name: 'twitter:description',
    content:
      'Platform edukasi Islam dengan fitur hafalan Al-Quran, marketplace karya islami, dan layanan sertifikat digital.',
  },
  { name: 'twitter:image', content: '/logo-dark.png' },

  // Additional SEO
  {
    name: 'keywords',
    content:
      'islam, santri, hafalan quran, edukasi islam, pesantren online, marketplace islami, sertifikat digital',
  },
  { name: 'theme-color', content: '#10b981' },
  { name: 'msapplication-TileColor', content: '#10b981' },

  // Security
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
];

// Helper function untuk dynamic meta
export function createMeta({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}): MetaFunction {
  return () => [
    ...defaultMeta,
    ...(title ? [{ title: `${title} - Santri Online` }] : []),
    ...(description ? [{ name: 'description', content: description }] : []),
    ...(image ? [{ property: 'og:image', content: image }] : []),
    ...(url ? [{ property: 'og:url', content: url }] : []),
    { property: 'og:type', content: type },
  ];
}
