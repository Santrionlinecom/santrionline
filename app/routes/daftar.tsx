import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, Link, useActionData, useNavigation, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { json, redirect } from '@remix-run/cloudflare';
import { safeRedirect } from '~/utils/safe-redirect';
import { motion } from 'framer-motion';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { hashPassword } from '~/lib/crypto.server';
import { setSessionTokens } from '~/lib/session.server';
import { getDb } from '~/db/drizzle.server';
import { ensureWallet } from '~/lib/wallet.server';
import { syncUserRecords } from '~/lib/user-sync.server';
import { legacyUser } from '~/db/schema';
import { eq } from 'drizzle-orm';

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

type ActionData =
  | {
      formError?: string;
      fieldErrors?: {
        name?: string | null;
        email?: string | null;
        password?: string | null;
        confirmPassword?: string | null;
      };
      values?: { name?: string; email?: string };
    }
  | undefined;

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if (intent !== 'register') {
    return json({ formError: 'Permintaan tidak valid.' }, { status: 400 });
  }

  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const redirectTo = safeRedirect(formData.get('redirectTo'));

  const fieldErrors = {
    name: typeof name === 'string' && name.trim().length > 2 ? null : 'Nama minimal 3 karakter.',
    email: typeof email === 'string' && email.trim().length > 0 ? null : 'Email wajib diisi.',
    password:
      typeof password === 'string' && password.length >= 6 ? null : 'Password minimal 6 karakter.',
    confirmPassword:
      typeof confirmPassword === 'string' && confirmPassword === password
        ? null
        : 'Konfirmasi password tidak sesuai.',
  } as const;

  if (
    fieldErrors.name ||
    fieldErrors.email ||
    fieldErrors.password ||
    fieldErrors.confirmPassword
  ) {
    return json<ActionData>(
      {
        fieldErrors,
        values: {
          name: typeof name === 'string' ? name : undefined,
          email: typeof email === 'string' ? email : undefined,
        },
        formError: 'Mohon periksa kembali data yang diisi.',
      },
      { status: 400 },
    );
  }

  const db = getDb(context);
  const normalizedEmail = (email as string).toLowerCase();
  const existingUser = await db.query.legacyUser.findFirst({
    where: eq(legacyUser.email, normalizedEmail),
  });

  if (existingUser) {
    return json<ActionData>(
      {
        formError: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.',
        values: {
          name: name as string,
          email: email as string,
        },
      },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password as string);
  const userId = crypto.randomUUID();

  await syncUserRecords({
    context,
    db,
    userId,
    email: normalizedEmail,
    name: name as string,
    avatarUrl: null,
    passwordHash,
  });

  try {
    await ensureWallet(db, userId);
  } catch (walletError) {
    console.warn('Failed to ensure wallet after registration', walletError);
  }

  const sessionCookie = await setSessionTokens(context, {
    type: 'local',
    userId,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  });

  const headers = new Headers();
  headers.append('Set-Cookie', sessionCookie);

  return redirect(redirectTo, { headers });
}

export default function DaftarPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
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
              Buat akun dengan email dan password atau daftar instan menggunakan Google.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {actionData?.formError && (
              <div className="mb-4 rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
                {actionData.formError}
              </div>
            )}
            <Form method="post" className="grid gap-4">
              <input type="hidden" name="intent" value="register" />
              {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  defaultValue={actionData?.values?.name ?? ''}
                  aria-invalid={actionData?.fieldErrors?.name ? true : undefined}
                  aria-describedby={actionData?.fieldErrors?.name ? 'name-error' : undefined}
                />
                {actionData?.fieldErrors?.name && (
                  <p id="name-error" className="text-sm text-red-600">
                    {actionData.fieldErrors.name}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={actionData?.values?.email ?? ''}
                  aria-invalid={actionData?.fieldErrors?.email ? true : undefined}
                  aria-describedby={actionData?.fieldErrors?.email ? 'email-error' : undefined}
                />
                {actionData?.fieldErrors?.email && (
                  <p id="email-error" className="text-sm text-red-600">
                    {actionData.fieldErrors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  aria-invalid={actionData?.fieldErrors?.password ? true : undefined}
                  aria-describedby={
                    actionData?.fieldErrors?.password ? 'password-error' : undefined
                  }
                />
                {actionData?.fieldErrors?.password && (
                  <p id="password-error" className="text-sm text-red-600">
                    {actionData.fieldErrors.password}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  aria-invalid={actionData?.fieldErrors?.confirmPassword ? true : undefined}
                  aria-describedby={
                    actionData?.fieldErrors?.confirmPassword ? 'confirmPassword-error' : undefined
                  }
                />
                {actionData?.fieldErrors?.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-red-600">
                    {actionData.fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Daftar'}
              </Button>
            </Form>
            <div className="mt-4 flex items-center gap-4 text-xs uppercase text-gray-500 dark:text-gray-400">
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span>atau</span>
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>
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
