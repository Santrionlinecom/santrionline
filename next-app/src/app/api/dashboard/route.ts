import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET() {
  const prisma = getPrisma();
  const [memberCount, paymentStats] = await Promise.all([
    prisma.member.count(),
    prisma.payment.groupBy({
      by: ["status"],
      _sum: { amount: true },
      _count: { _all: true }
    })
  ]);

  const totalCollected = paymentStats.reduce((sum, item) => sum + (item._sum.amount ?? 0), 0);
  const paidCount = paymentStats.find((p) => p.status === "LUNAS")?._count._all ?? 0;
  const lateCount = paymentStats.find((p) => p.status === "TERLAMBAT")?._count._all ?? 0;

  return NextResponse.json({
    memberCount,
    totalCollected,
    paidCount,
    lateCount
  });
}
