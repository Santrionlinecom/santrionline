import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { communityDisabledApiResponse } from '~/utils/community-disabled';

export function loader(_args: LoaderFunctionArgs) {
  return communityDisabledApiResponse();
}
