import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

const paymentSchema = z.object({
  memberId: z.string(),
  amount: z.number().int().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
  status: z.enum(["LUNAS", "BELUM", "TERLAMBAT"]).default("LUNAS"),
  recordedById: z.string().optional()
});

export async function GET() {
  const prisma = getPrisma();
  const payments = await prisma.payment.findMany({ include: { member: true } });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  const prisma = getPrisma();
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const payment = await prisma.payment.create({ data: parsed.data });
  return NextResponse.json(payment, { status: 201 });
}
