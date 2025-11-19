import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

const updateSchema = z.object({
  amount: z.number().int().positive().optional(),
  status: z.enum(["LUNAS", "BELUM", "TERLAMBAT"]).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const payment = await prisma.payment.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(payment);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  await prisma.payment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
