import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import * as React from 'react';
import { getDb } from '~/db/drizzle.server';
import { user as userTable, user_social_links, karya } from '~/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { SocialIcon, getSocialPlatformColor } from '~/components/ui/social-icons';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Eye, Download, ExternalLink, Gift } from 'lucide-react';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.user) {
    return [{ title: 'User Not Found - Santri Online' }];
  }

  return [
    { title: `${data.user.name} - Santri Online` },
    { name: 'description', content: data.user.bio || `Profil ${data.user.name} di Santri Online` },
    { property: 'og:title', content: `${data.user.name} - Santri Online` },
    {
      property: 'og:description',
      content: data.user.bio || `Profil ${data.user.name} di Santri Online`,
    },
    { property: 'og:image', content: data.user.avatarUrl || '/logo-light.png' },
  ];
};

// Mock data for demo purposes
const getMockProfile = (username: string) => {
  const mockProfiles = {
    santritest: {
      user: {
        id: 'demo-1',
        name: 'Ahmad Santri',
        username: 'santritest',
        bio: '🎓 Santri Pesantren Darunnajah | 📚 Menghafal Al-Quran | 🕌 Aktivis Dakwah | 💚 Ahlussunnah wal Jamaah',
        avatarUrl: '/images/avatars/santri-1.jpg',
        theme: 'light',
        isPublic: true,
        createdAt: new Date('2024-01-15'),
      },
      socialLinks: [
        {
          id: '1',
          platform: 'instagram',
          url: 'https://instagram.com/ahmadsantri',
          isVisible: true,
          displayOrder: 1,
        },
        {
          id: '2',
          platform: 'tiktok',
          url: 'https://tiktok.com/@ahmadsantri',
          isVisible: true,
          displayOrder: 2,
        },
        {
          id: '3',
          platform: 'youtube',
          url: 'https://youtube.com/@ahmadsantri',
          isVisible: true,
          displayOrder: 3,
        },
        {
          id: '4',
          platform: 'telegram',
          url: 'https://t.me/ahmadsantri',
          isVisible: true,
          displayOrder: 4,
        },
      ],
      karya: [
        {
          id: '1',
          title: 'Catatan Tahfidz Al-Quran',
          excerpt: 'Tips dan trik menghafal Al-Quran dengan metode yang efektif',
          featuredImage: '/images/karya/tahfidz-notes.jpg',
          price: 0,
          isFree: true,
          viewCount: 1250,
          downloadCount: 890,
          slug: 'catatan-tahfidz',
          publishedAt: new Date(),
        },
        {
          id: '2',
          title: 'Panduan Sholat Khusyu',
          excerpt: 'Cara mencapai kekhusyuan dalam sholat berdasarkan tuntunan ulama salaf',
          featuredImage: '/images/karya/sholat-guide.jpg',
          price: 15000,
          isFree: false,
          viewCount: 980,
          downloadCount: 450,
          slug: 'panduan-sholat',
          publishedAt: new Date(),
        },
      ],
    },
    ustadzfarhan: {
      user: {
        id: 'demo-2',
        name: 'Ustadz Farhan Maulana',
        username: 'ustadzfarhan',
        bio: '🎓 Alumni Al-Azhar Kairo | 📖 Santri Senior | 🕌 Pengurus Masjid Baitul Izzah | ✍️ Penulis Buku Islam',
        avatarUrl: '/images/avatars/ustadz-1.jpg',
        theme: 'dark',
        isPublic: true,
        createdAt: new Date('2024-01-10'),
      },
      socialLinks: [
        {
          id: '1',
          platform: 'youtube',
          url: 'https://youtube.com/@ustadzfarhan',
          isVisible: true,
          displayOrder: 1,
        },
        {
          id: '2',
          platform: 'instagram',
          url: 'https://instagram.com/ustadzfarhan',
          isVisible: true,
          displayOrder: 2,
        },
        {
          id: '3',
          platform: 'website',
          url: 'https://ustadzfarhan.com',
          isVisible: true,
          displayOrder: 3,
        },
        {
          id: '4',
          platform: 'whatsapp',
          url: 'https://wa.me/628123456789',
          isVisible: true,
          displayOrder: 4,
        },
        {
          id: '5',
          platform: 'twitter',
          url: 'https://twitter.com/ustadzfarhan',
          isVisible: true,
          displayOrder: 5,
        },
      ],
      karya: [
        {
          id: '1',
          title: 'Syarah Aqidatul Awam',
          excerpt: 'Penjelasan lengkap kitab Aqidatul Awam dengan dalil-dalil Al-Quran dan Hadits',
          featuredImage: '/images/karya/aqidatul-awam.jpg',
          price: 50000,
          isFree: false,
          viewCount: 3420,
          downloadCount: 1890,
          slug: 'syarah-aqidatul-awam',
          publishedAt: new Date(),
        },
        {
          id: '2',
          title: 'Fiqih Sholat Praktis',
          excerpt:
            "Panduan lengkap fiqih sholat sesuai madzhab Syafi'i untuk kehidupan sehari-hari",
          featuredImage: '/images/karya/fiqih-sholat.jpg',
          price: 35000,
          isFree: false,
          viewCount: 2650,
          downloadCount: 1240,
          slug: 'fiqih-sholat',
          publishedAt: new Date(),
        },
        {
          id: '3',
          title: 'Adab Menuntut Ilmu',
          excerpt: 'Etika dan adab seorang penuntut ilmu berdasarkan kitab-kitab ulama salaf',
          featuredImage: '/images/karya/adab-ilmu.jpg',
          price: 0,
          isFree: true,
          viewCount: 4180,
          downloadCount: 3200,
          slug: 'adab-ilmu',
          publishedAt: new Date(),
        },
      ],
    },
    santriwati: {
      user: {
        id: 'demo-3',
        name: 'Ummul Khoirot',
        username: 'santriwati',
        bio: '👩‍🎓 Santriwati Pon-Pes Lirboyo | 📿 Huffadhah Al-Quran | 🌸 Kajian Khusus Akhawat | 💝 Dakwah untuk Muslimah',
        avatarUrl: '/images/avatars/santriwati-1.jpg',
        theme: 'colorful',
        isPublic: true,
        createdAt: new Date('2024-01-20'),
      },
      socialLinks: [
        {
          id: '1',
          platform: 'instagram',
          url: 'https://instagram.com/ummulkhoirot',
          isVisible: true,
          displayOrder: 1,
        },
        {
          id: '2',
          platform: 'tiktok',
          url: 'https://tiktok.com/@ummulkhoirot',
          isVisible: true,
          displayOrder: 2,
        },
        {
          id: '3',
          platform: 'telegram',
          url: 'https://t.me/kajianakhawat',
          isVisible: true,
          displayOrder: 3,
        },
        {
          id: '4',
          platform: 'website',
          url: 'https://ummulkhoirot.com',
          isVisible: true,
          displayOrder: 4,
        },
      ],
      karya: [
        {
          id: '1',
          title: 'Fiqih Wanita Modern',
          excerpt: 'Panduan fiqih khusus wanita muslimah dalam kehidupan modern',
          featuredImage: '/images/karya/fiqih-wanita.jpg',
          price: 25000,
          isFree: false,
          viewCount: 2180,
          downloadCount: 1420,
          slug: 'fiqih-wanita',
          publishedAt: new Date(),
        },
        {
          id: '2',
          title: 'Tips Tahfidz untuk Akhawat',
          excerpt: 'Metode khusus menghafal Al-Quran untuk para santriwati dan muslimah',
          featuredImage: '/images/karya/tahfidz-akhawat.jpg',
          price: 0,
          isFree: true,
          viewCount: 1890,
          downloadCount: 1650,
          slug: 'tahfidz-akhawat',
          publishedAt: new Date(),
        },
      ],
    },
    hafidzali: {
      user: {
        id: 'demo-4',
        name: 'Hafidz Ali Rahman',
        username: 'hafidzali',
        bio: '🕌 Hafidz 30 Juz | 🎯 Instruktur Tahfidz | 📱 Content Creator Islami | 🏆 Juara MTQ Nasional 2023',
        avatarUrl: '/images/avatars/hafidz-1.jpg',
        theme: 'light',
        isPublic: true,
        createdAt: new Date('2024-01-05'),
      },
      socialLinks: [
        {
          id: '1',
          platform: 'youtube',
          url: 'https://youtube.com/@hafidzali',
          isVisible: true,
          displayOrder: 1,
        },
        {
          id: '2',
          platform: 'instagram',
          url: 'https://instagram.com/hafidzali',
          isVisible: true,
          displayOrder: 2,
        },
        {
          id: '3',
          platform: 'tiktok',
          url: 'https://tiktok.com/@hafidzali',
          isVisible: true,
          displayOrder: 3,
        },
        {
          id: '4',
          platform: 'spotify',
          url: 'https://open.spotify.com/artist/hafidzali',
          isVisible: true,
          displayOrder: 4,
        },
        {
          id: '5',
          platform: 'telegram',
          url: 'https://t.me/tahfidzmethod',
          isVisible: true,
          displayOrder: 5,
        },
      ],
      karya: [
        {
          id: '1',
          title: 'Metode Tahfidz 7 Hari',
          excerpt: 'Teknik revolusioner menghafal 1 halaman Al-Quran dalam 7 hari',
          featuredImage: '/images/karya/metode-7hari.jpg',
          price: 75000,
          isFree: false,
          viewCount: 5240,
          downloadCount: 2890,
          slug: 'metode-7hari',
          publishedAt: new Date(),
        },
        {
          id: '2',
          title: 'Murottal Juz Amma',
          excerpt: 'Rekaman murottal Juz Amma dengan tajwid yang benar untuk pembelajaran',
          featuredImage: '/images/karya/murottal-juzamma.jpg',
          price: 30000,
          isFree: false,
          viewCount: 3650,
          downloadCount: 2100,
          slug: 'murottal-juzamma',
          publishedAt: new Date(),
        },
        {
          id: '3',
          title: 'Kaidah Tajwid Praktis',
          excerpt: 'Panduan lengkap kaidah tajwid yang mudah dipahami dan dipraktikkan',
          featuredImage: '/images/karya/tajwid-praktis.jpg',
          price: 0,
          isFree: true,
          viewCount: 4890,
          downloadCount: 4200,
          slug: 'tajwid-praktis',
          publishedAt: new Date(),
        },
        {
          id: '4',
          title: 'Doa-doa Pilihan',
          excerpt: 'Kumpulan doa-doa pilihan dari Al-Quran dan Hadits dengan audio',
          featuredImage: '/images/karya/doa-pilihan.jpg',
          price: 20000,
          isFree: false,
          viewCount: 2780,
          downloadCount: 1890,
          slug: 'doa-pilihan',
          publishedAt: new Date(),
        },
      ],
    },
  };

  return mockProfiles[username as keyof typeof mockProfiles] || null;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { username } = params;

  if (!username) {
    throw new Response('Username tidak ditemukan', { status: 404 });
  }

  // Check if this is a demo profile first
  const mockProfile = getMockProfile(username);
  if (mockProfile) {
    return json(mockProfile);
  }

  // If not a demo profile, try database
  const db = getDb(context);

  // Get user profile
  const user = await db.query.user.findFirst({
    where: eq(userTable.username, username),
    columns: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      theme: true,
      isPublic: true,
      createdAt: true,
    },
  });

  if (!user || !user.isPublic) {
    throw new Response('Profil tidak ditemukan atau tidak publik', { status: 404 });
  }

  // Get social links
  const socialLinks = await db.query.user_social_links.findMany({
    where: and(eq(user_social_links.userId, user.id), eq(user_social_links.isVisible, true)),
    orderBy: [user_social_links.displayOrder],
  });

  // Get published karya
  const userKarya = await db.query.karya.findMany({
    where: and(
      eq(karya.authorId, user.id),
      eq(karya.status, 'published'),
      // @ts-expect-error deletedAt added
      // ensure not soft-deleted
      (karya as unknown).deletedAt.isNull?.() ?? undefined,
    ),
    orderBy: [desc(karya.publishedAt)],
    limit: 6,
    columns: {
      id: true,
      title: true,
      excerpt: true,
      featuredImage: true,
      price: true,
      isFree: true,
      viewCount: true,
      downloadCount: true,
      slug: true,
      publishedAt: true,
    },
  });

  // Update analytics (visitor count)
  // This should be done asynchronously in production

  return json({
    user,
    socialLinks,
    karya: userKarya,
  });
}

export default function BiolinkPage() {
  const { user, socialLinks, karya } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const isDemoProfile = user.username
    ? ['santritest', 'ustadzfarhan', 'santriwati', 'hafidzali'].includes(user.username)
    : false;

  // Track page visit
  React.useEffect(() => {
    if (user.username && !isDemoProfile) {
      fetch('/api/biolink-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, type: 'visit' }),
      }).catch(() => {
        // Ignore errors for analytics
      });
    }
  }, [user.username, isDemoProfile]);

  // Real-time sync for user's karya updates
  React.useEffect(() => {
    if (isDemoProfile) return; // Skip for demo profiles

    let cancelled = false;
    let lastCheck = Date.now();

    async function pollUserKarya() {
      try {
        const res = await fetch(`/api/karya-events?since=${lastCheck}`);
        if (!res.ok) return;
        const data = (await res.json()) as { events: Array<{ type: string; authorId?: string }> };
        if (cancelled) return;

        if (data.events?.length) {
          // Check if any events affect this user's karya
          const userEvents = data.events.filter((e) => {
            // This is a simplified check - in production you'd want to verify authorId
            return ['created', 'status_changed', 'deleted', 'restored', 'updated'].includes(e.type);
          });

          if (userEvents.length > 0) {
            lastCheck = Date.now();
            revalidator.revalidate();
          }
        }
      } catch (error) {
        console.log('Biolink poll error:', error);
      }
    }

    const id = setInterval(pollUserKarya, 20000); // Every 20 seconds
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [user.username, isDemoProfile, revalidator]);

  const trackClick = () => {
    if (user.username && !isDemoProfile) {
      fetch('/api/biolink-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, type: 'click' }),
      }).catch(() => {
        // Ignore errors for analytics
      });
    }
  };

  const themeClasses = {
    light: 'bg-gradient-to-br from-white via-blue-50 to-green-50 text-gray-900',
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white',
    colorful: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white',
  };

  const cardClasses = {
    light: 'bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg',
    dark: 'bg-gray-800/80 backdrop-blur-sm border-gray-700 text-white shadow-lg',
    colorful: 'bg-white/10 border-white/20 backdrop-blur-sm text-white shadow-lg',
  };

  const getProfileStats = () => {
    if (user.username === 'ustadzfarhan') {
      return { followers: 12400, students: 2890, lessons: 156 };
    } else if (user.username === 'santriwati') {
      return { followers: 8750, students: 1240, lessons: 89 };
    } else if (user.username === 'hafidzali') {
      return { followers: 15600, students: 3420, lessons: 201 };
    } else if (user.username === 'santritest') {
      return { followers: 890, progress: 75, badges: 12 };
    }
    return null;
  };

  const stats = getProfileStats();

  return (
    <div
      className={`min-h-screen ${themeClasses[user.theme as keyof typeof themeClasses] || themeClasses.light}`}
    >
      {/* Header */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Santri Online</h1>
              {isDemoProfile && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 text-yellow-700 border-yellow-300"
                >
                  Demo Profile
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/" className="text-current border-current hover:bg-white/10">
                Bergabung
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-3">{user.name}</h1>
          {user.bio && (
            <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed mb-4">{user.bio}</p>
          )}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-300">
              Santri Online
            </Badge>
            {user.username === 'ustadzfarhan' && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-300">
                Santri Senior
              </Badge>
            )}
            {user.username === 'hafidzali' && (
              <Badge
                variant="secondary"
                className="bg-purple-500/20 text-purple-700 border-purple-300"
              >
                Hafidz Al-Quran
              </Badge>
            )}
            {user.username === 'santriwati' && (
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-700 border-pink-300">
                Kajian Akhawat
              </Badge>
            )}
          </div>

          {/* Gift/Apresiasi Button */}
          <div className="mb-6">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
              <Gift className="w-4 h-4 mr-2" />
              Beri Apresiasi
            </Button>
            <p className="text-xs opacity-70 mt-2">
              Berikan DinCoin sebagai apresiasi atas karya dan kontribusi
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div
            className={`mb-8 p-6 rounded-xl ${cardClasses[user.theme as keyof typeof cardClasses] || cardClasses.light}`}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              {user.username === 'santritest' ? (
                <>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.followers}</div>
                    <div className="text-sm opacity-70">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.progress}%</div>
                    <div className="text-sm opacity-70">Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{stats.badges}</div>
                    <div className="text-sm opacity-70">Badges</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.followers?.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-70">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.students?.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-70">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{stats.lessons}</div>
                    <div className="text-sm opacity-70">Lessons</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-center">Temukan Saya Di</h2>
            <div className="grid gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick()}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl ${
                    cardClasses[user.theme as keyof typeof cardClasses] || cardClasses.light
                  }`}
                >
                  <div className={`p-3 rounded-full ${getSocialPlatformColor(link.platform)}`}>
                    <SocialIcon platform={link.platform} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium capitalize">{link.platform}</span>
                    {user.username === 'hafidzali' && link.platform === 'youtube' && (
                      <div className="text-xs opacity-70">500K+ subscribers</div>
                    )}
                    {user.username === 'ustadzfarhan' && link.platform === 'youtube' && (
                      <div className="text-xs opacity-70">1.2M+ subscribers</div>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Karya Section */}
        {karya.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {user.username === 'santritest' ? 'Progress Belajar' : 'Karya Terbaru'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {karya.map((work) => (
                <Card
                  key={work.id}
                  className={`overflow-hidden transition-all hover:scale-105 hover:shadow-xl ${
                    cardClasses[user.theme as keyof typeof cardClasses] || cardClasses.light
                  }`}
                >
                  {work.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={work.featuredImage}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{work.title}</h3>
                    {work.excerpt && (
                      <p className="text-sm opacity-80 mb-3 line-clamp-2">{work.excerpt}</p>
                    )}
                    <div className="flex justify-between items-center text-sm mb-3">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {work.viewCount?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {work.downloadCount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="font-semibold">
                        {work.isFree ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                            Gratis
                          </Badge>
                        ) : (
                          <span>Rp {work.price?.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" asChild>
                      <a href={`/karya/${work.slug}`}>
                        {user.username === 'santritest' ? 'Lanjutkan Belajar' : 'Lihat Karya'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {karya.length >= 6 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  asChild
                  className="border-current text-current hover:bg-white/10"
                >
                  <a href={`/marketplace?author=${user.name}`}>Lihat Semua Karya</a>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Demo Profiles CTA */}
        {isDemoProfile && (
          <div
            className={`mb-8 p-6 rounded-xl text-center ${cardClasses[user.theme as keyof typeof cardClasses] || cardClasses.light}`}
          >
            <h3 className="font-semibold mb-2">Suka dengan profil ini?</h3>
            <p className="text-sm opacity-80 mb-4">
              Buat biolink Anda sendiri dan mulai berbagi karya dengan dunia
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/daftar">Daftar Gratis</a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-current text-current hover:bg-white/10"
              >
                <a href="/">Pelajari Lebih Lanjut</a>
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/20">
          <p className="text-sm opacity-60 mb-2">Dibuat dengan ❤️ di Santri Online</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs opacity-50">
            <span>Platform Pembelajaran Islam Digital</span>
            <span>•</span>
            <span>Manhaj Ahlussunnah wal Jamaah</span>
          </div>
          {!isDemoProfile && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mt-3 text-current hover:bg-white/10"
            >
              <a href="/">Buat biolink Anda sendiri</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
