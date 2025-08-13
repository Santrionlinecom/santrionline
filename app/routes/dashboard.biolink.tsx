import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
// NOTE: server-only modules dynamically imported in loader
import { biolink_analytics, user_social_links, user as userTable } from "~/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
// session helper moved to dynamic import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Eye, MousePointer, TrendingUp, ExternalLink, Copy, Share } from "lucide-react";

export const meta: MetaFunction = () => {
  return [{ title: "Analytics Biolink - Santri Online" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);

  // Get user data
  const user = await db.query.user.findFirst({
    where: eq(userTable.id, userId),
    columns: {
      username: true,
      name: true,
      isPublic: true,
      theme: true,
      bio: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    throw new Response("User tidak ditemukan", { status: 404 });
  }

  // Initialize empty data in case tables don't exist yet
  let analytics: any[] = [];
  let socialLinks: any[] = [];
  let totalVisitors = 0;
  let totalClicks = 0;
  let visitorGrowth = 0;

  try {
    // Get analytics data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split('T')[0];

    analytics = await db.query.biolink_analytics.findMany({
      where: and(
        eq(biolink_analytics.userId, userId),
        sql`${biolink_analytics.date} >= ${dateString}`
      ),
      orderBy: [desc(biolink_analytics.date)],
    });

    // Get social links
    socialLinks = await db.query.user_social_links.findMany({
      where: eq(user_social_links.userId, userId),
      orderBy: [user_social_links.displayOrder],
    });

    // Calculate totals
    totalVisitors = analytics.reduce((sum, record) => sum + (record.visitorCount || 0), 0);
    totalClicks = analytics.reduce((sum, record) => sum + (record.clickCount || 0), 0);

    // Calculate growth (compare last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const lastWeek = analytics.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= sevenDaysAgo;
    });

    const previousWeek = analytics.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= fourteenDaysAgo && recordDate < sevenDaysAgo;
    });

    const lastWeekVisitors = lastWeek.reduce((sum, record) => sum + (record.visitorCount || 0), 0);
    const previousWeekVisitors = previousWeek.reduce((sum, record) => sum + (record.visitorCount || 0), 0);
    
    visitorGrowth = previousWeekVisitors === 0 
      ? (lastWeekVisitors > 0 ? 100 : 0)
      : ((lastWeekVisitors - previousWeekVisitors) / previousWeekVisitors) * 100;
  } catch (error) {
    console.error('Error loading biolink data:', error);
    // Continue with empty data if tables don't exist
  }

  return json({
    user,
    analytics,
    socialLinks,
    stats: {
      totalVisitors,
      totalClicks,
      visitorGrowth: Math.round(visitorGrowth),
      clickThroughRate: totalVisitors > 0 ? Math.round((totalClicks / totalVisitors) * 100) : 0,
    },
  });
}

export default function BiolinkAnalyticsPage() {
  const { user, analytics, socialLinks, stats } = useLoaderData<typeof loader>();

  const biolinkUrl = user.username 
    ? `https://santrionline.com/${user.username}` 
    : 'https://santrionline.com/username-belum-diset';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  const shareViaWhatsApp = () => {
    if (!user.username) {
      alert('Silakan set username terlebih dahulu di pengaturan');
      return;
    }
    const message = encodeURIComponent(`Lihat biolink saya di Santri Online: ${biolinkUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // If user doesn't have username, show setup prompt
  if (!user.username) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Setup Biolink Anda</CardTitle>
            <CardDescription>
              Anda belum mengatur username untuk biolink Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Untuk menggunakan fitur biolink, Anda perlu mengatur username terlebih dahulu.
              Username akan menjadi URL unik Anda di Santri Online.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Contoh biolink URL:</p>
              <p className="font-mono text-sm">https://santrionline.com/username_anda</p>
            </div>
            <Button asChild>
              <a href="/dashboard/pengaturan?tab=biolink">
                Set Username Sekarang
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Biolink</h1>
        <p className="text-gray-600 mt-2">Lihat performa biolink Anda</p>
      </div>

      {/* Biolink URL Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>URL Biolink Anda</span>
            <Badge variant={user.isPublic ? "default" : "secondary"}>
              {user.isPublic ? "Publik" : "Privat"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="flex-1 font-mono text-sm break-all">{biolinkUrl}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(biolinkUrl)}
                title="Salin URL"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={shareViaWhatsApp}
                title="Share via WhatsApp"
              >
                <Share className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={biolinkUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengunjung</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.visitorGrowth > 0 ? '+' : ''}{stats.visitorGrowth}% dari minggu lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Klik</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Dari {socialLinks.length} link sosial media
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clickThroughRate}%</div>
            <p className="text-xs text-muted-foreground">
              Rasio klik per pengunjung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Aktif</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialLinks.filter(link => link.isVisible).length}</div>
            <p className="text-xs text-muted-foreground">
              Dari {socialLinks.length} total link
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru (30 Hari)</CardTitle>
            <CardDescription>
              Data pengunjung dan klik harian
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.length > 0 ? (
              <div className="space-y-3">
                {analytics.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(record.date).toLocaleDateString('id-ID')}</p>
                      <p className="text-sm text-gray-600">
                        {record.visitorCount || 0} pengunjung, {record.clickCount || 0} klik
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {(record.visitorCount || 0) > 0 ? Math.round(((record.clickCount || 0) / (record.visitorCount || 0)) * 100) : 0}% CTR
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada data analytics</p>
                <p className="text-sm">Bagikan biolink Anda untuk mulai mengumpulkan data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link Sosial Media</CardTitle>
            <CardDescription>
              Daftar link yang aktif di biolink Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {socialLinks.length > 0 ? (
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{link.platform}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{link.url}</p>
                    </div>
                    <Badge variant={link.isVisible ? "default" : "secondary"}>
                      {link.isVisible ? "Aktif" : "Tersembunyi"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada link sosial media</p>
                <Button variant="outline" asChild className="mt-3">
                  <a href="/dashboard/pengaturan?tab=social">
                    Tambah Link
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Kelola biolink Anda dengan mudah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="/dashboard/pengaturan?tab=biolink">
                Edit Biolink
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/pengaturan?tab=social">
                Kelola Social Media
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={biolinkUrl} target="_blank" rel="noopener noreferrer">
                Preview Biolink
              </a>
            </Button>
            <Button variant="outline" onClick={shareViaWhatsApp}>
              Share via WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
