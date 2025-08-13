import { useState } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
// server-only modules moved to dynamic imports in loader/action
import { dompet_santri, transactions } from '~/db/schema';
import { eq, desc } from 'drizzle-orm';
import {
  Coins,
  ArrowUpCircle,
  ArrowDownCircle,
  Send,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Phone,
} from 'lucide-react';

type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

// Define type for topup variations
type TopupVariation = {
  amount: number;
  currency: 'dincoin' | 'dircoin';
  price: number;
  label: string;
  description: string;
  popular?: boolean;
  bonus?: string;
};

// Variasi topup dengan harga
const topupVariations: TopupVariation[] = [
  {
    amount: 1,
    currency: 'dincoin',
    price: 10000,
    label: '1 Dincoin',
    description: '= 100 Dircoin',
  },
  {
    amount: 5,
    currency: 'dincoin',
    price: 50000,
    label: '5 Dincoin',
    description: '= 500 Dircoin',
    popular: true,
  },
  {
    amount: 10,
    currency: 'dincoin',
    price: 100000,
    label: '10 Dincoin',
    description: '= 1,000 Dircoin',
  },
  {
    amount: 25,
    currency: 'dincoin',
    price: 250000,
    label: '25 Dincoin',
    description: '= 2,500 Dircoin',
  },
  {
    amount: 50,
    currency: 'dincoin',
    price: 500000,
    label: '50 Dincoin',
    description: '= 5,000 Dircoin',
  },
  {
    amount: 100,
    currency: 'dincoin',
    price: 1000000,
    label: '100 Dincoin',
    description: '= 10,000 Dircoin',
    bonus: '10% bonus!',
  },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { requireUserId } = await import('~/lib/session.server');
  const { getDb } = await import('~/db/drizzle.server');
  const userId = await requireUserId(request, context);
  const db = getDb(context);

  // Ambil data dompet
  let wallet = await db.query.dompet_santri.findFirst({
    where: eq(dompet_santri.userId, userId),
  });

  // Buat dompet jika belum ada
  if (!wallet) {
    const newWalletId = `wallet_${userId}_${Date.now()}`;
    await db.insert(dompet_santri).values({
      id: newWalletId,
      userId,
      dincoinBalance: 0,
      dircoinBalance: 0,
    });

    wallet = {
      id: newWalletId,
      userId,
      dincoinBalance: 0,
      dircoinBalance: 0,
    };
  }

  // Define the type for transactions
  type Transaction = typeof transactions.$inferSelect;
  let transactions_list: Transaction[] = [];

  if (wallet) {
    // Ambil riwayat transaksi
    transactions_list = await db.query.transactions.findMany({
      where: eq(transactions.dompetId, wallet.id),
      orderBy: [desc(transactions.createdAt)],
      limit: 10,
    });
  }

  return json({
    wallet: {
      id: wallet.id,
      dincoin: wallet?.dincoinBalance ?? 0,
      dircoin: wallet?.dircoinBalance ?? 0,
    },
    transactions: transactions_list,
  });
}

export async function action(): Promise<Response> {
  // In the updated version, all topups are handled through the manual process
  // No more instant demo topups
  return json(
    {
      success: false,
      error: 'Silahkan gunakan menu topup manual melalui transfer bank dan konfirmasi WhatsApp',
    },
    { status: 400 },
  );
}

export default function DompetPage() {
  const { wallet, transactions } = useLoaderData<typeof loader>();
  const [selectedTopup, setSelectedTopup] = useState<TopupVariation | null>(null);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showTopupOptions, setShowTopupOptions] = useState(false);
  const [topupMethod, setTopupMethod] = useState<'manual'>('manual');
  const fetcher = useFetcher<ActionResponse>();

  const handleTopup = (variation: TopupVariation) => {
    setSelectedTopup(variation);
    setShowTopupModal(true);
  };

  const confirmTopup = () => {
    if (selectedTopup) {
      fetcher.submit(
        {
          actionType: 'topup',
          amount: String(selectedTopup.amount),
          currency: selectedTopup.currency,
          price: String(selectedTopup.price),
        },
        { method: 'post' },
      );
      setShowTopupModal(false);
      setSelectedTopup(null);
    }
  };

  // Calculate total value in rupiah
  const totalValueRupiah = wallet.dincoin * 10000 + wallet.dircoin * 100;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dompet Digital</h1>
        <p className="text-muted-foreground">
          Kelola dincoin dan dircoin Anda untuk transaksi di Santri Online
        </p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Dincoin</CardTitle>
            <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
              <Coins className="h-5 w-5 text-yellow-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{wallet.dincoin.toLocaleString('id-ID')}</div>
            <p className="text-xs opacity-90">Coin Emas Premium</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-400 to-gray-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Dircoin</CardTitle>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Coins className="h-5 w-5 text-gray-800" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{wallet.dircoin.toLocaleString('id-ID')}</div>
            <p className="text-xs opacity-90">Coin Perak Standard</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalValueRupiah.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Setara Rupiah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konversi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>1 Dincoin = 100 Dircoin</div>
              <div>1 Dincoin = Rp 10.000</div>
              <div>10 Dircoin = Rp 1.000</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setShowTopupOptions(true)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Topup Saldo</h3>
              <p className="text-sm text-muted-foreground">Isi ulang dincoin/dircoin</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer opacity-75">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Kirim Coin</h3>
              <p className="text-sm text-muted-foreground">Transfer ke santri lain</p>
              <Badge variant="outline" className="text-xs mt-1">
                Segera Hadir
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer opacity-75">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Marketplace</h3>
              <p className="text-sm text-muted-foreground">Belanja karya santri</p>
              <Badge variant="outline" className="text-xs mt-1">
                Segera Hadir
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Topup Variations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5" />
            Pilihan Topup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topupVariations.map((variation, index) => (
              <Card
                key={index}
                className="relative p-4 border-2 hover:border-primary cursor-pointer transition-colors"
                onClick={() => handleTopup(variation)}
              >
                {variation.popular ? (
                  <Badge className="absolute -top-2 left-4 bg-orange-500">Populer</Badge>
                ) : null}
                {variation.bonus ? (
                  <Badge className="absolute -top-2 right-4 bg-green-500">{variation.bonus}</Badge>
                ) : null}
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-lg">{variation.label}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{variation.description}</p>
                  <div className="text-2xl font-bold text-primary">
                    Rp {variation.price.toLocaleString('id-ID')}
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Topup Sekarang
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada riwayat transaksi</p>
              <p className="text-sm text-muted-foreground">Lakukan topup pertama Anda!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {tx.type === 'credit' ? (
                        <ArrowUpCircle
                          className={`h-5 w-5 ${
                            tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}
                        />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {tx.amount} {tx.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topup Options Modal */}
      {showTopupOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pilih Metode Topup
                <Button variant="ghost" size="sm" onClick={() => setShowTopupOptions(false)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Manual WhatsApp - Now the only option */}
                <Card
                  className={`p-4 border-2 cursor-pointer transition-colors ${
                    topupMethod === 'manual'
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setTopupMethod('manual')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Transfer Bank + WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">
                        Transfer ke rekening, konfirmasi via WA
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        1x24 jam
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Multi Payment Gateway */}
                {/* Mayar.id Payment Gateway removed as requested */}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowTopupOptions(false)}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setShowTopupOptions(false);
                    // Always redirect to manual topup page
                    window.location.href = '/dashboard/topup/manual';
                  }}
                >
                  Lanjutkan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Topup Confirmation Modal */}
      {showTopupModal && selectedTopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Konfirmasi Topup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-lg">{selectedTopup.label}</h3>
                <p className="text-muted-foreground">{selectedTopup.description}</p>
                <div className="text-2xl font-bold text-primary mt-2">
                  Rp {selectedTopup.price.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Detail Transaksi:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Dincoin:</span>
                    <span>+{selectedTopup.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dircoin:</span>
                    <span>+{selectedTopup.amount * 100}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Bayar:</span>
                    <span>Rp {selectedTopup.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowTopupModal(false)}
                  disabled={fetcher.state === 'submitting'}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1"
                  onClick={confirmTopup}
                  disabled={fetcher.state === 'submitting'}
                >
                  {fetcher.state === 'submitting' ? 'Memproses...' : 'Konfirmasi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success/Error Messages */}
      {fetcher.data && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${
            fetcher.data.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {fetcher.data.message || fetcher.data.error || 'Operasi selesai'}
        </div>
      )}
    </div>
  );
}
