import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { communityDisabledApiResponse } from '~/utils/community-disabled';

export function action(_args: ActionFunctionArgs) {
  return communityDisabledApiResponse();
}

export const loader = communityDisabledApiResponse;
