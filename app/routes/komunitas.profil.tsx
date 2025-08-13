import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Star,
  MessageCircle,
  Share2,
  Settings,
  Trophy,
  Heart,
  Edit,
  Camera,
  Globe,
  Award,
  Activity,
  BookOpen,
} from 'lucide-react';
// session helper moved to dynamic import in loader
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Profil Komunitas - Santri Online' },
    {
      name: 'description',
      content:
        'Kelola profil komunitas Anda, lihat aktivitas, achievement, dan terhubung dengan santri lainnya.',
    },
    { property: 'og:title', content: 'Profil Komunitas - Santri Online' },
    { property: 'og:description', content: 'Kelola profil komunitas Anda di Santri Online.' },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getUserId } = await import('~/lib/session.server');
  const userId = await getUserId(request, context);

  // Static data for now - dapat dipindah ke database nanti
  const userProfile = {
    id: userId || 'guest',
    name: 'Ahmad Santri',
    username: 'ahmad_santri',
    bio: 'Santri Al-Azhar | Tech Enthusiast | Menghafal Al-Quran | Suka berbagi ilmu agama dan teknologi',
    email: 'ahmad@example.com',
    phone: '+62812345678',
    location: 'Jakarta, Indonesia',
    website: 'https://ahmadsantri.com',
    joinDate: '2023-06-15',
    avatar: 'AS',
    cover: null,
    verified: true,
    level: 'Santri Aktif',
    points: 1250,
    rank: 25,
    isFollowing: false,
    isOwnProfile: true,
    // Social Links
    socialLinks: {
      instagram: 'ahmad_santri',
      twitter: 'ahmad_santri',
      linkedin: 'ahmad-santri',
      github: 'ahmadsantri',
    },
    // Profile Stats
    stats: {
      followers: 234,
      following: 156,
      posts: 45,
      likes: 678,
      comments: 234,
      groupsJoined: 8,
      achievementsUnlocked: 15,
    },
    // Achievements/Badges
    achievements: [
      {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'Bergabung dalam 100 member pertama',
        icon: 'Star',
        color: 'text-yellow-600',
        unlockedAt: '2023-06-15',
      },
      {
        id: 'active-poster',
        name: 'Active Poster',
        description: 'Membuat 50+ postingan berkualitas',
        icon: 'Edit',
        color: 'text-green-600',
        unlockedAt: '2024-02-20',
      },
      {
        id: 'helpful-member',
        name: 'Helpful Member',
        description: 'Memberikan 100+ like dan komentar yang membantu',
        icon: 'Heart',
        color: 'text-red-600',
        unlockedAt: '2024-01-15',
      },
      {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Menyelesaikan 5+ kursus/workshop',
        icon: 'BookOpen',
        color: 'text-purple-600',
        unlockedAt: '2024-04-05',
      },
      {
        id: 'community-leader',
        name: 'Community Leader',
        description: 'Memiliki 100+ followers',
        icon: 'Trophy',
        color: 'text-orange-600',
        unlockedAt: '2024-05-20',
      },
    ],
    // Recent Activities
    activities: [
      {
        id: 1,
        type: 'post',
        action: 'created',
        target: 'Diskusi tentang teknologi dalam pendidikan pesantren',
        time: '2 jam lalu',
        icon: 'Edit',
      },
      {
        id: 3,
        type: 'comment',
        action: 'commented on',
        target: 'Cara efektif menghafal Al-Quran untuk dewasa',
        time: '1 hari lalu',
        icon: 'MessageCircle',
      },
      {
        id: 4,
        type: 'like',
        action: 'liked',
        target: 'Tips belajar bahasa Arab untuk pemula',
        time: '2 hari lalu',
        icon: 'Heart',
      },
      {
        id: 5,
        type: 'group',
        action: 'joined',
        target: 'Santri Tech Community',
        time: '3 hari lalu',
        icon: 'Users',
      },
    ],
    // Recent Posts
    recentPosts: [
      {
        id: 1,
        title: 'Teknologi dalam Pendidikan Pesantren Modern',
        excerpt:
          'Bagaimana pesantren dapat memanfaatkan teknologi untuk meningkatkan kualitas pendidikan...',
        likes: 23,
        comments: 8,
        time: '2 jam lalu',
        category: 'Teknologi',
      },
      {
        id: 2,
        title: 'Review Aplikasi Hafalan Al-Quran Terbaik',
        excerpt:
          'Setelah mencoba berbagai aplikasi, ini adalah rekomendasi aplikasi terbaik untuk membantu hafalan...',
        likes: 45,
        comments: 12,
        time: '1 hari lalu',
        category: 'Hafalan',
      },
      {
        id: 3,
        title: 'Tips Networking untuk Santri Entrepreneur',
        excerpt: 'Membangun jaringan bisnis sambil tetap menjaga nilai-nilai islami...',
        likes: 31,
        comments: 15,
        time: '3 hari lalu',
        category: 'Bisnis',
      },
    ],
  };

  return json({
    userProfile,
    currentUser: userId,
  });
}

export default function ProfilKomunitasPage() {
  const { userProfile } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('overview');

  const levelProgress = ((userProfile.points % 1000) / 1000) * 100;

  const getIconComponent = (iconName: string) => {
    const icons = {
      Star,
      Edit,
      Heart,
      Calendar,
      BookOpen,
      Trophy,
      Users,
      MessageCircle,
    };
    return icons[iconName as keyof typeof icons] || Star;
  };

  const getActivityIcon = (iconName: string) => {
    const icons = {
      Edit,
      Calendar,
      MessageCircle,
      Heart,
      Users,
    };
    return icons[iconName as keyof typeof icons] || Activity;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/komunitas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Komunitas
          </Link>
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-t-lg relative">
              {userProfile.isOwnProfile && (
                <Button variant="secondary" size="sm" className="absolute top-4 right-4">
                  <Camera className="w-4 h-4 mr-2" />
                  Edit Cover
                </Button>
              )}
            </div>

            {/* Profile Info */}
            <CardContent className="relative pt-0">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Avatar */}
                <div className="relative -mt-16">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={`/api/avatar/${userProfile.username}`} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-blue-600 text-white">
                      {userProfile.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile.isOwnProfile && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                    {userProfile.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                  <p className="text-muted-foreground max-w-2xl">{userProfile.bio}</p>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Bergabung{' '}
                      {new Date(userProfile.joinDate).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    {userProfile.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <a
                          href={userProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {userProfile.isOwnProfile ? (
                    <>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profil
                      </Button>
                      <Button variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button>{userProfile.isFollowing ? 'Unfollow' : 'Follow'}</Button>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Pesan
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{userProfile.stats.posts}</div>
              <div className="text-xs text-muted-foreground">Postingan</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{userProfile.stats.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {userProfile.stats.following}
              </div>
              <div className="text-xs text-muted-foreground">Following</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{userProfile.stats.likes}</div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-indigo-600">
                {userProfile.stats.groupsJoined}
              </div>
              <div className="text-xs text-muted-foreground">Groups</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{userProfile.points}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-pink-600">#{userProfile.rank}</div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Postingan</TabsTrigger>
            <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Level & Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      Level & Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold">{userProfile.level}</div>
                        <div className="text-sm text-muted-foreground">{userProfile.points} XP</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Rank #{userProfile.rank}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(1000 - (userProfile.points % 1000))} XP ke level berikutnya
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${levelProgress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-600" />
                      Postingan Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userProfile.recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold line-clamp-1">{post.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments}
                            </span>
                          </div>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Lihat Semua Postingan
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Top Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Pencapaian Terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProfile.achievements.slice(0, 3).map((achievement) => {
                      const IconComponent = getIconComponent(achievement.icon);
                      return (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50"
                        >
                          <div className={`p-2 rounded-full bg-accent ${achievement.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <Button variant="outline" className="w-full" size="sm">
                      Lihat Semua Pencapaian
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Statistik Bulan Ini
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Postingan Baru</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Komentar</span>
                      <Badge variant="secondary">23</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Likes Diterima</span>
                      <Badge variant="secondary">145</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Social Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(userProfile.socialLinks).map(([platform, username]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{platform}</span>
                        <a
                          href={`https://${platform}.com/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          @{username}
                        </a>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Semua Postingan ({userProfile.stats.posts})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.recentPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{post.title}</h4>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{post.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.achievements.map((achievement) => {
                const IconComponent = getIconComponent(achievement.icon);
                return (
                  <Card key={achievement.id} className="text-center">
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center ${achievement.color}`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString('id-ID')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.activities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.icon);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-muted-foreground"> {activity.target}</span>
                          </p>
                          <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
