import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useSearchParams, Link } from '@remix-run/react';
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

export default function MasukPage() {
  const [searchParams] = useSearchParams();
  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');
  const redirectTo = searchParams.get('redirectTo') ?? undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>
            Gunakan akun Google Anda untuk mengakses dashboard Santri Online
          </CardDescription>
        </CardHeader>
        <CardContent>
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
