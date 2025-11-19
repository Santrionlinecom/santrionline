import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET() {
  const prisma = getPrisma();
  const sessions = await prisma.hafalanSession.findMany();
  const ayahTotal = sessions.reduce((sum, s) => sum + (s.endAyah - s.startAyah + 1), 0);
  const approved = sessions.filter((s) => s.status === "APPROVED").reduce(
    (sum, s) => sum + (s.endAyah - s.startAyah + 1),
    0
  );
  return NextResponse.json({ totalAyah: ayahTotal, approvedAyah: approved });
}
