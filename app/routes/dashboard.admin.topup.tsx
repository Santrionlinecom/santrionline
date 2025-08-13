import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
// NOTE: server-only modules dynamically imported in loader/action
import { topup_requests, dompet_santri, user } from '~/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Check, X, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';

interface TopupRequest {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentProof: string | null;
  bankAccount: string | null;
  transferAmount: number | null;
  whatsappNumber: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  processedAt: Date | null;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

type ActionResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);

  // Get pending topup requests
  const pendingRequests: TopupRequest[] = await db
    .select({
      id: topup_requests.id,
      userId: topup_requests.userId,
      userName: user.name,
      userEmail: user.email,
      amount: topup_requests.amount,
      currency: topup_requests.currency,
      paymentMethod: topup_requests.paymentMethod,
      paymentProof: topup_requests.paymentProof,
      bankAccount: topup_requests.bankAccount,
      transferAmount: topup_requests.transferAmount,
      whatsappNumber: topup_requests.whatsappNumber,
      notes: topup_requests.notes,
      status: topup_requests.status,
      createdAt: topup_requests.createdAt,
      processedAt: topup_requests.processedAt,
    })
    .from(topup_requests)
    .leftJoin(user, eq(topup_requests.userId, user.id))
    .orderBy(desc(topup_requests.createdAt));

  const stats: Stats = {
    pending: pendingRequests.filter(req => req.status === 'pending').length,
    approved: pendingRequests.filter(req => req.status === 'approved').length,
    rejected: pendingRequests.filter(req => req.status === 'rejected').length,
    totalAmount: pendingRequests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + (req.transferAmount || 0), 0),
  };

  return json({ pendingRequests, stats });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { requireAdminUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  await requireAdminUserId(request, context);
  const db = getDb(context);
  const formData = await request.formData();
  
  const action = formData.get('action');
  const requestId = formData.get('requestId');
  const adminNotes = formData.get('adminNotes');

  if (!action || !requestId) {
    return json({ error: 'Action dan Request ID diperlukan' }, { status: 400 });
  }

  const actionStr = action.toString();
  const requestIdStr = requestId.toString();
  const adminNotesStr = adminNotes?.toString() || '';

  try {
    // Get the topup request
    const topupRequest = await db
      .select()
      .from(topup_requests)
      .where(eq(topup_requests.id, requestIdStr))
      .limit(1);

    if (!topupRequest[0]) {
      return json({ error: 'Request tidak ditemukan' }, { status: 404 });
    }

    const request_data = topupRequest[0];

    if (actionStr === 'approve') {
      // Get user wallet
      let userWallet = await db
        .select()
        .from(dompet_santri)
        .where(eq(dompet_santri.userId, request_data.userId))
        .limit(1);

      // Create wallet if doesn't exist
      if (!userWallet[0]) {
        const newWalletId = `wallet_${request_data.userId}_${Date.now()}`;
        await db.insert(dompet_santri).values({
          id: newWalletId,
          userId: request_data.userId,
          dincoinBalance: 0,
          dircoinBalance: 0,
        });
        
        userWallet = [{
          id: newWalletId,
          userId: request_data.userId,
          dincoinBalance: 0,
          dircoinBalance: 0,
        }];
      }

      // Update wallet balance
      const currentDincoin = userWallet[0].dincoinBalance;
      const currentDircoin = userWallet[0].dircoinBalance;
      
      let newDincoin = currentDincoin;
      let newDircoin = currentDircoin;
      
      if (request_data.currency === 'dincoin') {
        newDincoin += request_data.amount;
        newDircoin += request_data.amount * 100; // 1 dincoin = 100 dircoin
      } else {
        newDircoin += request_data.amount;
      }

      await db.update(dompet_santri)
        .set({ 
          dincoinBalance: newDincoin,
          dircoinBalance: newDircoin 
        })
        .where(eq(dompet_santri.id, userWallet[0].id));

      // Update request status
      await db.update(topup_requests)
        .set({
          status: 'approved',
          processedAt: new Date(),
          adminNotes: adminNotesStr || 'Topup disetujui oleh admin',
        })
        .where(eq(topup_requests.id, requestIdStr));

      return json({ success: true, message: 'Topup berhasil disetujui' });

    } else if (actionStr === 'reject') {
      await db.update(topup_requests)
        .set({
          status: 'rejected',
          processedAt: new Date(),
          adminNotes: adminNotesStr || 'Topup ditolak oleh admin',
        })
        .where(eq(topup_requests.id, requestIdStr));

      return json({ success: true, message: 'Topup berhasil ditolak' });
    }

    return json({ error: 'Action tidak valid' }, { status: 400 });

  } catch (error) {
    console.error('Admin action error:', error);
    return json({ error: 'Gagal memproses request' }, { status: 500 });
  }
}

export default function AdminTopupPage() {
  const { pendingRequests, stats } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionResponse>();
  
  const isLoading = fetcher.state === 'submitting';

  const handleApprove = (requestId: string, notes: string = '') => {
    if (isLoading) return;
    
    fetcher.submit(
      {
        action: 'approve',
        requestId,
        adminNotes: notes,
      },
      { method: 'post' }
    );
  };

  const handleReject = (requestId: string, notes: string) => {
    if (isLoading) return;
    
    if (!notes.trim()) {
      alert('Harap berikan alasan penolakan');
      return;
    }
    
    fetcher.submit(
      {
        action: 'reject',
        requestId,
        adminNotes: notes,
      },
      { method: 'post' }
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin - Kelola Topup</h1>
        <p className="text-muted-foreground">Verifikasi dan approve request topup dari user</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Sudah disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.totalAmount.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Yang sudah diproses</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Request Topup</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Bukti</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.userName || 'Unknown User'}</div>
                      <div className="text-sm text-muted-foreground">{request.userEmail || 'No email'}</div>
                      {request.whatsappNumber && (
                        <div className="text-xs text-muted-foreground">WA: {request.whatsappNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.amount} {request.currency.toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground">
                        Rp {(request.transferAmount || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{request.paymentMethod}</div>
                      {request.bankAccount && (
                        <div className="text-muted-foreground">{request.bankAccount}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.paymentProof ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={request.paymentProof} target="_blank" rel="noopener noreferrer">
                          Lihat Bukti
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      request.status === 'pending' ? 'secondary' :
                      request.status === 'approved' ? 'default' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {request.createdAt ? new Date(request.createdAt).toLocaleDateString('id-ID') : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={isLoading}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {isLoading ? 'Loading...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt('Alasan penolakan:');
                            if (reason) handleReject(request.id, reason);
                          }}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {isLoading ? 'Loading...' : 'Reject'}
                        </Button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <div className="text-sm text-muted-foreground">
                        {request.processedAt ? new Date(request.processedAt).toLocaleDateString('id-ID') : 'Processed'}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pendingRequests.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada request topup</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success/Error Messages */}
      {fetcher.data && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          fetcher.data.success 
            ? 'bg-green-500 text-white border-green-600' 
            : 'bg-red-500 text-white border-red-600'
        }`}>
          <div className="flex items-center gap-2">
            {fetcher.data.success ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span>{fetcher.data.message || fetcher.data.error || 'Operasi selesai'}</span>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Memproses request...</span>
          </div>
        </div>
      )}
    </div>
  );
}
