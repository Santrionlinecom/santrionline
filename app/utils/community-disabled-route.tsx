import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/cloudflare';
import { useLoaderData, Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  COMMUNITY_DISABLED_MESSAGE,
  communityDisabledActionResponse,
  communityDisabledLoaderData,
} from '~/utils/community-disabled';

export const communityDisabledMeta: MetaFunction = () => [
  { title: 'Fitur Komunitas Dinonaktifkan - Santri Online' },
  {
    name: 'description',
    content: COMMUNITY_DISABLED_MESSAGE,
  },
  { name: 'robots', content: 'noindex, nofollow' },
];

export function communityDisabledLoader(_args: LoaderFunctionArgs) {
  return communityDisabledLoaderData();
}

export function communityDisabledAction(_args: ActionFunctionArgs) {
  return communityDisabledActionResponse();
}

export function CommunityDisabledPage() {
  const { message } = useLoaderData<typeof communityDisabledLoader>();

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="space-y-4 max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Fitur Komunitas Dinonaktifkan
        </h1>
        <p className="text-muted-foreground leading-relaxed">{message}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Buka Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
