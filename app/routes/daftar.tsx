import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, Link, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { json, redirect } from '@remix-run/cloudflare';
import { safeRedirect } from '~/utils/safe-redirect';
import { motion } from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    { title: 'Daftar Akun Baru - Santri Online' },
    {
      name: 'description',
      content: 'Buat akun baru untuk memulai perjalanan belajar Anda di Santri Online.',
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getUserId } = await import('~/lib/session.server');
  const userId = await getUserId(request, context);
  if (userId) return redirect('/dashboard');
  const url = new URL(request.url);
  const redirectTo = safeRedirect(url.searchParams.get('redirectTo'));
  return json({ redirectTo });
}

export default function DaftarPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {/* 2. Bungkus komponen Card dengan motion.div dan tambahkan properti animasi */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 50 }} // Mulai dari transparan & 50px di bawah
        animate={{ opacity: 1, y: 0 }} // Animasikan menjadi terlihat & ke posisi asli
        transition={{ duration: 0.6, ease: 'easeInOut' }} // Atur durasi & gaya animasi
      >
        <Card>
          {' '}
          {/* Kelas 'mx-auto' dan 'max-w-sm' dipindahkan ke motion.div */}
          <CardHeader>
            <CardTitle className="text-2xl">Daftar</CardTitle>
            <CardDescription>
              Gunakan akun Google Anda untuk membuat akun Santri Online secara instan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" action="/auth/login" className="grid gap-4">
              {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
              <Button type="submit" className="w-full">
                Daftar dengan Google
              </Button>
            </Form>
            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{' '}
              <Link
                to={redirectTo ? `/masuk?redirectTo=${encodeURIComponent(redirectTo)}` : '/masuk'}
                className="underline"
              >
                Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
