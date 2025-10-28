import { json } from '@remix-run/cloudflare';

export const COMMUNITY_DISABLED_MESSAGE =
  'Fitur komunitas telah dinonaktifkan. Kami sedang memfokuskan platform pada pengalaman belajar inti.';

export function communityDisabledLoaderData() {
  return json({ message: COMMUNITY_DISABLED_MESSAGE }, { status: 410 });
}

export function communityDisabledActionResponse() {
  return json({ success: false, error: COMMUNITY_DISABLED_MESSAGE }, { status: 410 });
}

export function communityDisabledApiResponse() {
  return json({ error: COMMUNITY_DISABLED_MESSAGE }, { status: 410 });
}
