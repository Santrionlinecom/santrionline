import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.hashedPassword) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? token.role ?? "SANTRI";
      }
      const dbUser = token.email
        ? await prisma.user.findUnique({ where: { email: token.email as string } })
        : null;
      if (dbUser) token.role = dbUser.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "SANTRI";
      }
      return session;
    }
  },
  pages: {
    signIn: "/account"
  }
};

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(authConfig);
