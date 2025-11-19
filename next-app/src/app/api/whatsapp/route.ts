import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const schema = z.object({
  phone: z.string(),
  message: z.string().min(3)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const url = process.env.MOONWA_API_URL;
  const key = process.env.MOONWA_API_KEY;
  if (!url || !key) return NextResponse.json({ error: "Missing WA config" }, { status: 500 });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      to: parsed.data.phone,
      message: parsed.data.message
    })
  });

  const data = await res.json();
  return NextResponse.json({ ok: res.ok, data }, { status: res.ok ? 200 : 502 });
}
