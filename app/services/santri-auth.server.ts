import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { getSantriDb, soUsers, type Role } from '~/db/santri-app.server';
import { hashPassword, verifyPassword } from '~/utils/password.server';
import { createUserSession } from '~/utils/santri-session.server';

export async function registerUser(
  context: AppLoadContext,
  data: { name: string; email: string; password: string; role?: Role },
) {
  const db = getSantriDb(context);
  const exists = await db.query.soUsers.findFirst({ where: eq(soUsers.email, data.email) });
  if (exists) {
    throw new Error('Email sudah terdaftar');
  }
  const passwordHash = await hashPassword(data.password);
  const id = nanoid();
  await db.insert(soUsers).values({
    id,
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role ?? 'SANTRI',
  });
  const cookie = await createUserSession(context, id);
  return { cookie, userId: id };
}

export async function loginUser(
  context: AppLoadContext,
  { email, password }: { email: string; password: string },
) {
  const db = getSantriDb(context);
  const user = await db.query.soUsers.findFirst({ where: eq(soUsers.email, email) });
  if (!user) throw new Error('Email tidak ditemukan');
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error('Password salah');
  const cookie = await createUserSession(context, user.id);
  return { cookie, userId: user.id };
}

export async function loginWithGoogle(
  context: AppLoadContext,
  profile: { googleId: string; email: string; name: string },
) {
  const db = getSantriDb(context);
  const existing = await db.query.soUsers.findFirst({ where: eq(soUsers.email, profile.email) });
  const id = existing?.id ?? nanoid();

  if (existing) {
    await db.update(soUsers).set({ googleId: profile.googleId, name: profile.name }).where(eq(soUsers.id, id));
  } else {
    await db.insert(soUsers).values({
      id,
      name: profile.name,
      email: profile.email,
      googleId: profile.googleId,
      role: 'SANTRI',
    });
  }

  const cookie = await createUserSession(context, id);
  return { cookie, userId: id };
}
