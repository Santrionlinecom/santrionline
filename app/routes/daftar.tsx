import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useSearchParams, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getDb } from '~/db/drizzle.server';
import { user } from '~/db/schema';
import { json, redirect } from '@remix-run/cloudflare';
import { nanoid } from 'nanoid';
import { ensureWallet } from '~/lib/wallet.server';
import { log } from '~/lib/logger';
import { hashPassword } from '~/lib/crypto.server';
import { eq } from 'drizzle-orm';
import { safeRedirect } from '~/utils/safe-redirect';
import { motion } from 'framer-motion'; // <-- 1. Impor motion dari framer-motion
import { getFirebaseClientConfig } from '~/lib/firebase-auth.server';
import { hasGoogleClientConfig } from '~/lib/google-auth.server';
import { FirebaseGoogleButton } from '~/components/firebase-google-button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Daftar Akun Baru - Santri Online' },
    {
      name: 'description',
      content: 'Buat akun baru untuk memulai perjalanan belajar Anda di Santri Online.',
    },
  ];
};

type LoaderData = {
  googleOAuthEnabled: boolean;
  firebaseConfig: ReturnType<typeof getFirebaseClientConfig>;
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getUserId } = await import('~/lib/session.server');
  const userId = await getUserId(request, context);
  if (userId) {
    return redirect('/dashboard');
  }

  const googleOAuthEnabled = hasGoogleClientConfig(context);
  const firebaseConfig = getFirebaseClientConfig(context);

  return json<LoaderData>({
    googleOAuthEnabled,
    firebaseConfig,
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const db = getDb(context);
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const rawRedirectTo = formData.get('redirectTo');
  const redirectTo = rawRedirectTo ? safeRedirect(rawRedirectTo) : null;

  const appEnv = (context as any)?.env?.APP_ENV;
  log.info?.('register.start', { email, username, appEnv });

  if (!name || !email || !username || !password) {
    return json({ error: 'Semua field wajib diisi.' }, { status: 400 });
  }

  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return json(
      { error: 'Username hanya boleh menggunakan huruf kecil, angka, dan underscore.' },
      { status: 400 },
    );
  }
  if (username.length < 3 || username.length > 20) {
    return json({ error: 'Username harus antara 3-20 karakter.' }, { status: 400 });
  }

  const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (existingUser) {
    log.warn?.('register.duplicate_email', { email });
    return json({ error: 'Email sudah terdaftar.' }, { status: 400 });
  }

  const existingUsername = await db.query.user.findFirst({ where: eq(user.username, username) });
  if (existingUsername) {
    log.warn?.('register.duplicate_username', { username });
    return json({ error: 'Username sudah digunakan.' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  try {
    const userId = nanoid();
    log.info?.('register.inserting', { userId });
    await db.insert(user).values({
      id: userId,
      name,
      email,
      username,
      passwordHash,
      createdAt: new Date(),
      role: 'santri',
      bio: null,
      isPublic: true,
      theme: 'light',
      customDomain: null,
    });

    // Immediate confirmation read (ensures persisted in bound D1 DB)
    const confirm = await db.query.user.findFirst({ where: eq(user.id, userId) });
    if (!confirm) {
      log.error?.('register.confirmation_failed', { userId });
      return json({ error: 'Gagal mengkonfirmasi penyimpanan data. Coba lagi.' }, { status: 500 });
    }

    try {
      await ensureWallet(db, userId);
    } catch (e) {
      console.log('ensureWallet failed (ignored):', e);
    }

    log.info?.('register.success', { userId });

    const params = new URLSearchParams({
      success: 'Akun berhasil dibuat, silakan masuk',
    });
    if (redirectTo) {
      params.set('redirectTo', redirectTo);
    }

    return redirect(`/masuk?${params.toString()}`);
  } catch (error) {
    log.error?.('register.error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return json(
      { error: 'Terjadi kesalahan saat membuat akun. Silakan coba lagi.' },
      { status: 500 },
    );
  }
}

export default function DaftarPage() {
  const { googleOAuthEnabled, firebaseConfig } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const googleHref = googleOAuthEnabled
    ? `/auth/google${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    : null;
  const hasSocialLogin = googleOAuthEnabled || Boolean(firebaseConfig);

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
            <CardDescription>Masukkan informasi Anda untuk membuat akun baru</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="grid gap-4">
              {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
              <div className="grid gap-2">
                <Label htmlFor="full-name">Nama Lengkap</Label>
                <Input name="name" id="full-name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username Biolink</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-sm text-gray-500">santrionline.com/</span>
                  </div>
                  <Input
                    name="username"
                    id="username"
                    placeholder="username_anda"
                    className="pl-36"
                    pattern="[a-z0-9_]+"
                    minLength={3}
                    maxLength={20}
                    title="Username hanya boleh menggunakan huruf kecil, angka, dan underscore"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Biolink Anda akan tersedia di: https://santrionline.com/username_anda
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" required />
              </div>
              {actionData?.error && (
                <p className="text-sm font-medium text-destructive">{actionData.error}</p>
              )}
              <Button type="submit" className="w-full">
                Buat Akun
              </Button>
            </Form>
            {hasSocialLogin && (
              <div className="space-y-3">
                <div className="my-4 flex items-center gap-2 text-center text-xs text-muted-foreground">
                  <span className="flex-1 border-t border-border" />
                  <span>atau</span>
                  <span className="flex-1 border-t border-border" />
                </div>
                {googleHref && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={googleHref}>Daftar dengan Google</a>
                  </Button>
                )}
                {firebaseConfig && (
                  <FirebaseGoogleButton
                    config={firebaseConfig}
                    redirectTo={redirectTo}
                    label="Daftar dengan Google (Firebase)"
                  />
                )}
              </div>
            )}
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
