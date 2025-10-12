import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getDb } from '~/db/drizzle.server';
import { user as userSchema } from '~/db/schema';
import { getFirebaseApiKey, lookupFirebaseUser } from '~/lib/firebase-auth.server';
import { hashPassword } from '~/lib/crypto.server';
import { ensureWallet } from '~/lib/wallet.server';
import { safeRedirect } from '~/utils/safe-redirect';
import { createUserSession } from '~/lib/session.server';

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const idToken = formData.get('idToken');
  const rawRedirectTo = formData.get('redirectTo');
  const redirectTo = rawRedirectTo ? safeRedirect(rawRedirectTo) : '/dashboard';

  if (typeof idToken !== 'string' || !idToken) {
    return json({ error: 'Token Firebase tidak ditemukan.' }, { status: 400 });
  }

  const apiKey = getFirebaseApiKey(context);
  if (!apiKey) {
    return json({ error: 'Firebase Authentication belum dikonfigurasi.' }, { status: 500 });
  }

  const userInfo = await lookupFirebaseUser(idToken, apiKey);
  if (!userInfo) {
    return json({ error: 'Token Firebase tidak valid atau sudah kedaluwarsa.' }, { status: 401 });
  }

  const email = userInfo.email ?? userInfo.providerUserInfo?.find((info) => info.email)?.email;
  if (!email) {
    return json({ error: 'Firebase tidak mengembalikan email yang valid.' }, { status: 400 });
  }

  const firebaseUid = userInfo.localId;
  const db = getDb(context);
  let existingUser = firebaseUid
    ? await db.query.user.findFirst({ where: eq(userSchema.googleId, firebaseUid) })
    : null;

  if (!existingUser) {
    existingUser = await db.query.user.findFirst({ where: eq(userSchema.email, email) });
  }

  const displayName =
    userInfo.displayName ??
    userInfo.providerUserInfo?.find((info) => info.displayName)?.displayName ??
    email;
  const photoUrl =
    userInfo.photoUrl ?? userInfo.providerUserInfo?.find((info) => info.photoUrl)?.photoUrl ?? null;

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    const updates: Partial<typeof userSchema.$inferSelect> = { updatedAt: new Date() };

    if (!existingUser.googleId && firebaseUid) {
      updates.googleId = firebaseUid;
    }
    if (!existingUser.avatarUrl && photoUrl) {
      updates.avatarUrl = photoUrl;
    }
    if (!existingUser.name && displayName) {
      updates.name = displayName;
    }

    if (Object.keys(updates).length > 1) {
      await db.update(userSchema).set(updates).where(eq(userSchema.id, userId));
    }
  } else {
    userId = nanoid();
    const generatedPassword =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : nanoid();
    const passwordHash = await hashPassword(generatedPassword);

    await db.insert(userSchema).values({
      id: userId,
      email,
      name: displayName ?? email,
      passwordHash,
      avatarUrl: photoUrl,
      googleId: firebaseUid,
      createdAt: new Date(),
      role: 'santri',
      isPublic: true,
      theme: 'light',
    } as typeof userSchema.$inferInsert);

    try {
      await ensureWallet(db, userId);
    } catch (walletError) {
      console.warn('Gagal membuat dompet awal untuk pengguna Firebase:', walletError);
    }
  }

  return createUserSession({
    request,
    context,
    userId,
    remember: true,
    redirectTo,
  });
}
