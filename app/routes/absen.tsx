import { useState } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { requireUser } from '~/lib/session.server';
import { useFetcher } from '@remix-run/react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export async function loader({ request, context }: LoaderFunctionArgs) {
  await requireUser(request, context);
  return json({ ok: true });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await requireUser(request, context);
  return json({ ok: true });
}

export default function AbsenPage() {
  const fetcher = useFetcher<typeof action>();
  const [code, setCode] = useState('');
  const isSubmitting = fetcher.state !== 'idle';
  const result = fetcher.data as
    | { data?: { status: string; message: string }; error?: string; status?: string }
    | undefined;

  return (
    <div className="container mx-auto max-w-3xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Kehadiran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Masukkan kode QR yang diterima dari panitia atau pengurus untuk mencatat kehadiran.
            Sistem akan otomatis memvalidasi waktu kehadiran sesuai jadwal QR.
          </p>
          <fetcher.Form method="post" action="/api/absen/scan" className="space-y-3">
            <Input
              name="code"
              placeholder="Masukkan kode atau hasil scan"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim'
              )}
            </Button>
          </fetcher.Form>
          {result?.data && (
            <Alert variant={result.data.status === 'invalid' ? 'destructive' : 'default'}>
              {result.data.status === 'invalid' ? (
                <XCircle className="h-4 w-4" />
              ) : result.data.status === 'terlambat' ? (
                <Loader2 className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <div className="font-semibold">Hasil Pemindaian</div>
              <AlertDescription>{result.data.message}</AlertDescription>
            </Alert>
          )}
          {result?.error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <div className="font-semibold">Gagal</div>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
