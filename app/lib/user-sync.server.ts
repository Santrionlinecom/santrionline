import type { AppLoadContext } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import { getDb, type Database } from '~/db/drizzle.server';
import { legacyUser, users, type AppRole } from '~/db/schema';
import { hashPassword } from './crypto.server';
import { isAdminEmail } from '~/utils/admin';

type SyncUserRecordsParams = {
  context: AppLoadContext;
  db?: Database;
  userId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  role?: AppRole;
  passwordHash?: string | null;
  googleId?: string | null;
};

export async function syncUserRecords({
  context,
  db: providedDb,
  userId,
  email,
  name,
  avatarUrl,
  role,
  passwordHash,
  googleId,
}: SyncUserRecordsParams) {
  const db = providedDb ?? getDb(context);
  const normalizedEmail = email.toLowerCase();
  const resolvedName = name && name.length > 0 ? name : normalizedEmail;
  const resolvedAvatar = avatarUrl ?? null;
  const resolvedRole = role ?? (isAdminEmail(normalizedEmail, context) ? 'admin_tech' : 'santri');

  await db
    .insert(users)
    .values({
      id: userId,
      email: normalizedEmail,
      name: resolvedName,
      avatarUrl: resolvedAvatar,
      role: resolvedRole,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: normalizedEmail,
        name: resolvedName,
        avatarUrl: resolvedAvatar,
        role: resolvedRole,
      },
    });

  const existingLegacyUser = await db.query.legacyUser.findFirst({
    where: eq(legacyUser.id, userId),
  });

  const now = new Date();

  if (existingLegacyUser) {
    const updateData: Partial<typeof legacyUser.$inferInsert> = {
      email: normalizedEmail,
      name: resolvedName,
      avatarUrl: resolvedAvatar,
      role: resolvedRole,
      updatedAt: now,
    };

    if (typeof passwordHash === 'string' && passwordHash.length > 0) {
      updateData.passwordHash = passwordHash;
    }

    if (googleId !== undefined) {
      updateData.googleId = googleId;
    }

    await db.update(legacyUser).set(updateData).where(eq(legacyUser.id, userId));
    return;
  }

  const resolvedPasswordHash = passwordHash ?? (await hashPassword(crypto.randomUUID()));

  await db.insert(legacyUser).values({
    id: userId,
    email: normalizedEmail,
    name: resolvedName,
    avatarUrl: resolvedAvatar,
    role: resolvedRole,
    passwordHash: resolvedPasswordHash,
    googleId: googleId ?? null,
    createdAt: now,
    updatedAt: now,
    isPublic: true,
    theme: 'light',
  });
}
