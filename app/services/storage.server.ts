import type { AppLoadContext } from '@remix-run/cloudflare';

export async function putObject(
  context: AppLoadContext,
  key: string,
  data: ArrayBuffer | Uint8Array,
  contentType = 'application/octet-stream',
) {
  const bucket = (context.cloudflare?.env as { SANTRI_BUCKET?: R2Bucket } | undefined)?.SANTRI_BUCKET;
  if (!bucket) throw new Error('SANTRI_BUCKET binding belum diatur');
  await bucket.put(key, data, { httpMetadata: { contentType } });
  return `https://app.santrionline.com/files/${key}`;
}
