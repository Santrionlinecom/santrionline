import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation, useSearchParams, Link } from '@remix-run/react';
import { json, redirect } from '@remix-run/cloudflare';
import { safeRedirect } from '~/utils/safe-redirect';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getUserId } = await import('~/lib/session.server');
  const userId = await getUserId(request, context);
  if (userId) return redirect('/dashboard');
  const url = new URL(request.url);
  const redirectTo = safeRedirect(url.searchParams.get('redirectTo'));
  return json({ redirectTo });
}

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { setSessionTokens } from '~/lib/session.server';
import { getDb } from '~/db/drizzle.server';
import { ensureWallet } from '~/lib/wallet.server';
import { syncUserRecords } from '~/lib/user-sync.server';
import { comparePassword } from '~/lib/crypto.server';
import { legacyUser } from '~/db/schema';
import { eq } from 'drizzle-orm';

type ActionData =
  | {
      formError?: string;
      fieldErrors?: { email?: string | null; password?: string | null };
      values?: { email?: string };
    }
  | undefined;

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if (intent !== 'password-login') {
    return json({ formError: 'Permintaan tidak valid.' }, { status: 400 });
  }

  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'));

  const fieldErrors = {
    email: typeof email === 'string' && email.trim().length > 0 ? null : 'Email wajib diisi.',
    password:
      typeof password === 'string' && password.length >= 6 ? null : 'Password minimal 6 karakter.',
  } as const;

  if (fieldErrors.email || fieldErrors.password) {
    return json<ActionData>(
      {
        fieldErrors,
        values: { email: typeof email === 'string' ? email : undefined },
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

  if (!existingUser) {
    return json<ActionData>(
      {
        formError: 'Email atau password tidak valid.',
        values: { email: email as string },
      },
      { status: 400 },
    );
  }

  if (!existingUser.passwordHash) {
    return json<ActionData>(
      {
        formError: 'Akun ini terdaftar menggunakan Google. Silakan masuk dengan Google.',
        values: { email: email as string },
      },
      { status: 400 },
    );
  }

  const isPasswordValid = await comparePassword(password as string, existingUser.passwordHash);
  if (!isPasswordValid) {
    return json<ActionData>(
      {
        formError: 'Email atau password tidak valid.',
        values: { email: email as string },
      },
      { status: 400 },
    );
  }

  await syncUserRecords({
    context,
    db,
    userId: existingUser.id,
    email: normalizedEmail,
    name: existingUser.name,
    avatarUrl: existingUser.avatarUrl,
  });

  try {
    await ensureWallet(db, existingUser.id);
  } catch (walletError) {
    console.warn('Failed to ensure wallet after password login', walletError);
  }

  const sessionCookie = await setSessionTokens(context, {
    type: 'local',
    userId: existingUser.id,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  });

  const headers = new Headers();
  headers.append('Set-Cookie', sessionCookie);

  return redirect(redirectTo, { headers });
}

export default function MasukPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');
  const redirectTo = searchParams.get('redirectTo') ?? undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>
            Masuk menggunakan email dan password Anda atau lanjutkan dengan akun Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionData?.formError && (
            <div className="mb-4 rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {actionData.formError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded border border-green-300 bg-green-100 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 rounded border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          <Form method="post" className="grid gap-4">
            <input type="hidden" name="intent" value="password-login" />
            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
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
                autoComplete="current-password"
                required
                aria-invalid={actionData?.fieldErrors?.password ? true : undefined}
                aria-describedby={actionData?.fieldErrors?.password ? 'password-error' : undefined}
              />
              {actionData?.fieldErrors?.password && (
                <p id="password-error" className="text-sm text-red-600">
                  {actionData.fieldErrors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Masuk'}
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
              Lanjutkan dengan Google
            </Button>
          </Form>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link
              to={redirectTo ? `/daftar?redirectTo=${encodeURIComponent(redirectTo)}` : '/daftar'}
              className="underline"
            >
              Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
