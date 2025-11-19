import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

const memberSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["SANTRI", "USTADZ", "ADMIN"]).default("SANTRI")
});

export async function GET() {
  const prisma = getPrisma();
  const members = await prisma.member.findMany({ include: { payments: true } });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const prisma = getPrisma();
  const body = await request.json();
  const parsed = memberSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const member = await prisma.member.create({ data: parsed.data });
  return NextResponse.json(member, { status: 201 });
}
