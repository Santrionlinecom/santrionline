import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

const createSchema = z.object({
  userId: z.string(),
  surahId: z.number().int(),
  startAyah: z.number().int().min(1),
  endAyah: z.number().int().min(1),
  note: z.string().optional()
});

export async function GET() {
  const prisma = getPrisma();
  const sessions = await prisma.hafalanSession.findMany({ include: { surah: true, user: true } });
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const prisma = getPrisma();
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const session = await prisma.hafalanSession.create({ data: { ...parsed.data, status: "PENDING" } });
  return NextResponse.json(session, { status: 201 });
}
