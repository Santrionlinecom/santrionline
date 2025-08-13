import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
// server-only modules moved to dynamic imports in loader
import { Phone, Building2, AlertCircle, ExternalLink, CreditCard } from 'lucide-react';
import { useState } from 'react';

// Define payment methods
const BANK_ACCOUNTS: PaymentMethod[] = [
  {
    name: 'BCA',
    accountNumber: '3314050695',
    accountName: 'Yogik Pratama Aprilian',
    code: 'BCA',
    type: 'bank',
  },
  {
    name: 'Bank Jago',
    accountNumber: '505492752074',
    accountName: 'Yogik Pratama Aprilian',
    code: 'JAGO',
    type: 'bank',
  },
  {
    name: 'SeaBank',
    accountNumber: '901577085527',
    accountName: 'Yogik Pratama Aprilian',
    code: 'SEABANK',
    type: 'bank',
  },
];

const EWALLET_ACCOUNTS: PaymentMethod[] = [
  {
    name: 'GoPay',
    accountNumber: '087854545274',
    accountName: 'Yogik Pratama Aprilian',
    code: 'GOPAY',
    type: 'ewallet',
  },
  {
    name: 'ShopeePay',
    accountNumber: '087854545274',
    accountName: 'Yogik Pratama Aprilian',
    code: 'SHOPEE',
    type: 'ewallet',
  },
  {
    name: 'DANA',
    accountNumber: '083878535157',
    accountName: 'Yogik Pratama Aprilian',
    code: 'DANA',
    type: 'ewallet',
  },
];

// Define topup variations
type TopupVariation = {
  amount: number;
  currency: string;
  price: number;
  label: string;
  description: string;
  popular?: boolean;
  bonus?: string;
};

type PaymentMethod = {
  name: string;
  accountNumber: string;
  accountName: string;
  code: string;
  type: string;
};

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

const ADMIN_WHATSAPP = '+6287854545274'; // Real admin WhatsApp

export async function loader({ request, context }: LoaderFunctionArgs): Promise<Response> {
  const { requireUserId } = await import('~/lib/session.server');
  const userId = await requireUserId(request, context);
  return json({ userId });
}

export default function ManualTopupPage(): JSX.Element {
  const { userId } = useLoaderData<{ userId: string }>();
  const [selectedVariation, setSelectedVariation] = useState<TopupVariation | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const selectTopupVariation = (variation: TopupVariation) => {
    setSelectedVariation(variation);
    setShowPaymentMethods(true);
    setSelectedPayment(null);
  };

  const openWhatsAppForTopup = (variation: TopupVariation, paymentMethod: PaymentMethod) => {
    const message = encodeURIComponent(
      `Halo Admin Santri Online! 📱💰

Saya ingin melakukan topup dengan detail berikut:

📋 *DETAIL TOPUP*
• Nominal: ${variation.amount} ${variation.currency.toUpperCase()}
• Nilai Transfer: Rp ${variation.price.toLocaleString('id-ID')}
• User ID: ${userId}

💳 *METODE PEMBAYARAN DIPILIH*
• ${paymentMethod.type === 'bank' ? '🏦' : '💳'} ${paymentMethod.name}
• No. Rekening/Akun: ${paymentMethod.accountNumber}
• Atas Nama: ${paymentMethod.accountName}

*⚠️ PENTING*: Saya akan mengirimkan bukti transfer setelah melakukan pembayaran.

Terima kasih! 😊`,
    );

    const url = `https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Topup Manual</h1>
        <p className="text-muted-foreground">
          Pilih nominal dan metode pembayaran, lalu chat admin via WhatsApp
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Topup Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Pilih Nominal Topup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {topupVariations.map((variation, index) => (
                  <div
                    key={index}
                    className={`relative p-4 border-2 rounded-lg transition-colors cursor-pointer group ${
                      selectedVariation?.amount === variation.amount
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => selectTopupVariation(variation)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        selectTopupVariation(variation);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">{variation.label}</div>
                        <div className="text-sm text-muted-foreground">{variation.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          Rp {variation.price.toLocaleString('id-ID')}
                        </div>
                        {selectedVariation?.amount === variation.amount && (
                          <Badge className="mt-2" variant="default">
                            Dipilih
                          </Badge>
                        )}
                      </div>
                    </div>

                    {variation.popular && (
                      <Badge className="absolute -top-2 -right-2 text-xs" variant="default">
                        Populer
                      </Badge>
                    )}

                    {variation.bonus && (
                      <div className="absolute -top-2 -left-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {variation.bonus}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Selection */}
          {showPaymentMethods && selectedVariation && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Pilih Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bank Accounts */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Transfer Bank
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {BANK_ACCOUNTS.map((bank) => (
                        <div
                          key={bank.code}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPayment?.code === bank.code
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedPayment(bank)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedPayment(bank);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{bank.name}</p>
                              <p className="text-sm text-muted-foreground">{bank.accountNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                a.n. {bank.accountName}
                              </p>
                            </div>
                            {selectedPayment?.code === bank.code && (
                              <Badge variant="default">Dipilih</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* E-Wallet Accounts */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      E-Wallet
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {EWALLET_ACCOUNTS.map((ewallet) => (
                        <div
                          key={ewallet.code}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPayment?.code === ewallet.code
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedPayment(ewallet)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedPayment(ewallet);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{ewallet.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {ewallet.accountNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                a.n. {ewallet.accountName}
                              </p>
                            </div>
                            {selectedPayment?.code === ewallet.code && (
                              <Badge variant="default">Dipilih</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Admin Button */}
                  {selectedPayment && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => openWhatsAppForTopup(selectedVariation, selectedPayment)}
                        className="w-full"
                        size="lg"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Lanjutkan ke WhatsApp
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        *Setelah transfer, silahkan kirim bukti pembayaran via WhatsApp
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Cara Topup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Cara Topup Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Pilih nominal topup</p>
                  <p className="text-sm text-muted-foreground">
                    Pilih jumlah dincoin yang ingin dibeli
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Pilih metode pembayaran</p>
                  <p className="text-sm text-muted-foreground">
                    Pilih rekening bank atau e-wallet untuk transfer
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Hubungi admin via WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Kirimkan detail pesanan Anda ke admin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Transfer sesuai nominal</p>
                  <p className="text-sm text-muted-foreground">
                    Lakukan transfer ke rekening yang dipilih
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium">Kirim bukti transfer</p>
                  <p className="text-sm text-muted-foreground">
                    Kirim bukti transfer/screenshot via WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <div>
                  <p className="font-medium">Konfirmasi & proses</p>
                  <p className="text-sm text-muted-foreground">
                    Admin akan memproses topup dalam 1x24 jam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Summary */}
          {selectedVariation && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-primary">Ringkasan Pilihan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="font-medium">Nominal Topup</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedVariation.label} - Rp {selectedVariation.price.toLocaleString('id-ID')}
                  </p>
                </div>

                {selectedPayment && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">Metode Pembayaran</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPayment.name} - {selectedPayment.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      a.n. {selectedPayment.accountName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* WhatsApp Admin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Kontak Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">WhatsApp Admin</p>
                  <p className="text-sm text-muted-foreground">{ADMIN_WHATSAPP}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(`https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}`, '_blank')
                  }
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
