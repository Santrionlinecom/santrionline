import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// NOTE: server-only imports (db, session) dynamically imported in loader
import { dompet_santri, transactions, purchases, topup_requests, karya, user } from '~/db/schema';
import { sql, desc, eq } from 'drizzle-orm';
import { DollarSign, Users, TrendingUp, ShoppingCart, Coins, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);

  // Get overall stats
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(user);
  const totalKarya = await db.select({ count: sql<number>`count(*)` }).from(karya);
  const totalWallets = await db.select({ count: sql<number>`count(*)` }).from(dompet_santri);
  
  // Wallet stats
  const walletStats = await db
    .select({
      totalDincoin: sql<number>`sum(dincoin_balance)`,
      totalDircoin: sql<number>`sum(dircoin_balance)`,
    })
    .from(dompet_santri);

  // Purchase stats
  const purchaseStats = await db
    .select({
      totalPurchases: sql<number>`count(*)`,
      totalRevenue: sql<number>`sum(amount)`,
      totalPlatformFee: sql<number>`sum(platform_fee)`,
    })
    .from(purchases)
    .where(eq(purchases.status, 'completed'));

  // Topup request stats
  const topupStats = await db
    .select({
      pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`,
      approved: sql<number>`sum(case when status = 'approved' then 1 else 0 end)`,
      rejected: sql<number>`sum(case when status = 'rejected' then 1 else 0 end)`,
      totalValue: sql<number>`sum(case when status = 'approved' then transfer_amount else 0 end)`,
    })
    .from(topup_requests);

  // Daily transaction trends (last 30 days)
  const dailyTransactions = await db
    .select({
      date: sql<string>`date(created_at)`,
      count: sql<number>`count(*)`,
      totalAmount: sql<number>`sum(amount)`,
    })
    .from(transactions)
    .where(sql`created_at >= date('now', '-30 days')`)
    .groupBy(sql`date(created_at)`)
    .orderBy(sql`date(created_at)`);

  // Top selling karya
  const topSellingKarya = await db
    .select({
      karyaId: purchases.karyaId,
      karyaTitle: karya.title,
      authorName: user.name,
      totalSales: sql<number>`count(*)`,
      totalRevenue: sql<number>`sum(${purchases.amount})`,
    })
    .from(purchases)
    .leftJoin(karya, eq(purchases.karyaId, karya.id))
    .leftJoin(user, eq(karya.authorId, user.id))
    .where(eq(purchases.status, 'completed'))
    .groupBy(purchases.karyaId, karya.title, user.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Recent activities
  const recentTopups = await db
    .select({
      id: topup_requests.id,
      userName: user.name,
      amount: topup_requests.amount,
      currency: topup_requests.currency,
      transferAmount: topup_requests.transferAmount,
      status: topup_requests.status,
      createdAt: topup_requests.createdAt,
    })
    .from(topup_requests)
    .leftJoin(user, eq(topup_requests.userId, user.id))
    .orderBy(desc(topup_requests.createdAt))
    .limit(5);

  const recentPurchases = await db
    .select({
      id: purchases.id,
      buyerName: sql<string>`(SELECT name FROM ${user} WHERE id = ${purchases.buyerId})`,
      sellerName: sql<string>`(SELECT name FROM ${user} WHERE id = ${purchases.sellerId})`,
      karyaTitle: karya.title,
      amount: purchases.amount,
      currency: purchases.currency,
      createdAt: purchases.createdAt,
    })
    .from(purchases)
    .leftJoin(karya, eq(purchases.karyaId, karya.id))
    .where(eq(purchases.status, 'completed'))
    .orderBy(desc(purchases.createdAt))
    .limit(5);

  return json({
    stats: {
      totalUsers: totalUsers[0]?.count || 0,
      totalKarya: totalKarya[0]?.count || 0,
      totalWallets: totalWallets[0]?.count || 0,
      totalDincoin: walletStats[0]?.totalDincoin || 0,
      totalDircoin: walletStats[0]?.totalDircoin || 0,
      totalPurchases: purchaseStats[0]?.totalPurchases || 0,
      totalRevenue: purchaseStats[0]?.totalRevenue || 0,
      totalPlatformFee: purchaseStats[0]?.totalPlatformFee || 0,
      pendingTopups: topupStats[0]?.pending || 0,
      approvedTopups: topupStats[0]?.approved || 0,
      rejectedTopups: topupStats[0]?.rejected || 0,
      totalTopupValue: topupStats[0]?.totalValue || 0,
    },
    charts: {
      dailyTransactions,
      topSellingKarya,
    },
    recent: {
      topups: recentTopups,
      purchases: recentPurchases,
    },
  });
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboardPage() {
  const { stats, charts, recent } = useLoaderData<typeof loader>();

  // Prepare chart data
  const transactionChartData = charts.dailyTransactions.map(item => ({
    date: new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
    transactions: item.count,
    amount: item.totalAmount,
  }));

  const topupStatusData = [
    { name: 'Pending', value: stats.pendingTopups, color: '#FFBB28' },
    { name: 'Approved', value: stats.approvedTopups, color: '#00C49F' },
    { name: 'Rejected', value: stats.rejectedTopups, color: '#FF8042' },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview sistem ekonomi Santri Online</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Karya</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKarya}</div>
            <p className="text-xs text-muted-foreground">Published works</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dincoin</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDincoin.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">In circulation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlatformFee.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Dircoin earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Topups</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTopups}</div>
            <p className="text-xs text-muted-foreground">Needs approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Topups</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedTopups}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topup Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.totalTopupValue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Total processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Transaction Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Trends (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="transactions" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Topup Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Topup Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topupStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topupStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Karya */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Selling Karya</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.topSellingKarya}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="karyaTitle" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#8884d8" name="Sales Count" />
              <Bar dataKey="totalRevenue" fill="#82ca9d" name="Revenue (Dircoin)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Topups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Topup Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.topups.map((topup) => (
                <div key={topup.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{topup.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {topup.amount} {topup.currency.toUpperCase()} - Rp {topup.transferAmount?.toLocaleString('id-ID') || '0'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(topup.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    topup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    topup.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {topup.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{purchase.karyaTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.buyerName} → {purchase.sellerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(purchase.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{purchase.amount} {purchase.currency.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
