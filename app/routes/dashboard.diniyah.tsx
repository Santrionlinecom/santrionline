import type { MetaFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Diniyah - Santri Online' },
    { name: 'description', content: 'Pembelajaran ilmu diniyah untuk santri modern' },
  ];
};

// Redirect ke halaman hafalan karena diniyah adalah bagian dari pembelajaran hafalan
export function loader() {
  return redirect('/dashboard/hafalan');
}
