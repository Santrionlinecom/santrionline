import { PrismaClient } from "@prisma/client/edge";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function getPrisma() {
  try {
    const { env } = getRequestContext();
    const adapter = new PrismaD1(env.DB as any);
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.prisma;
  } catch (error) {
    // Fallback to local DATABASE_URL when request context is not available (e.g., static builds)
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
    }
    return globalForPrisma.prisma;
  }
}
