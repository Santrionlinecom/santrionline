import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

const memberSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["SANTRI", "USTADZ", "ADMIN"]).optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const member = await prisma.member.findUnique({ where: { id: params.id }, include: { payments: true } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const body = await request.json();
  const parsed = memberSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const member = await prisma.member.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(member);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  await prisma.payment.deleteMany({ where: { memberId: params.id } });
  await prisma.member.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
