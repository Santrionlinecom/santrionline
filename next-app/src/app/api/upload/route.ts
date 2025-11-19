import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }
  const key = `${Date.now()}-${file.name}`;
  const { env } = getRequestContext();
  // @ts-expect-error Cloudflare R2 binding type provided at runtime
  await env.R2_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });
  const publicEndpoint = (env as any).R2_PUBLIC_ENDPOINT || process.env.R2_PUBLIC_ENDPOINT || "";
  const url = publicEndpoint ? `${publicEndpoint}/${key}` : key;
  return NextResponse.json({ key, url });
}
