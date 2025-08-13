import type { MetaFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dukungan Teknis - Santri Online' },
    { name: 'description', content: 'Bantuan teknis untuk platform Santri Online' },
  ];
};

// Redirect ke halaman bantuan
export function loader() {
  return redirect('/bantuan');
}
