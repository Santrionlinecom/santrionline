import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

type CloudflareEnvSubset = {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
  FIREBASE_MEASUREMENT_ID?: string;
  FIREBASE_STORAGE_BUCKET?: string;
};

function getCloudflareEnv(context: LoaderFunctionArgs['context']): CloudflareEnvSubset | undefined {
  return (context as { cloudflare?: { env?: CloudflareEnvSubset } } | undefined)?.cloudflare?.env;
}

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
  measurementId?: string;
  storageBucket?: string;
};

export type FirebaseUserInfo = {
  localId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  providerUserInfo?: Array<{
    providerId?: string;
    rawId?: string;
    displayName?: string;
    photoUrl?: string;
    email?: string;
  }>;
};

function readEnv(context: LoaderFunctionArgs['context'], key: keyof CloudflareEnvSubset) {
  const cloudflareEnv = getCloudflareEnv(context);
  const valueFromContext = cloudflareEnv?.[key];
  if (valueFromContext) {
    return valueFromContext;
  }

  if (typeof process !== 'undefined') {
    return process.env?.[key];
  }

  return undefined;
}

export function getFirebaseClientConfig(
  context: LoaderFunctionArgs['context'],
): FirebaseClientConfig | null {
  const apiKey = readEnv(context, 'FIREBASE_API_KEY');
  const authDomain = readEnv(context, 'FIREBASE_AUTH_DOMAIN');
  const projectId = readEnv(context, 'FIREBASE_PROJECT_ID');
  const appId = readEnv(context, 'FIREBASE_APP_ID');
  const messagingSenderId = readEnv(context, 'FIREBASE_MESSAGING_SENDER_ID');
  const measurementId = readEnv(context, 'FIREBASE_MEASUREMENT_ID');
  const storageBucket = readEnv(context, 'FIREBASE_STORAGE_BUCKET');

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  const config: FirebaseClientConfig = { apiKey, authDomain, projectId, appId };

  if (messagingSenderId) {
    config.messagingSenderId = messagingSenderId;
  }
  if (measurementId) {
    config.measurementId = measurementId;
  }
  if (storageBucket) {
    config.storageBucket = storageBucket;
  }

  return config;
}

export function getFirebaseProjectId(context: LoaderFunctionArgs['context']): string | null {
  const projectId = readEnv(context, 'FIREBASE_PROJECT_ID');
  return projectId ?? null;
}

export function getFirebaseApiKey(context: LoaderFunctionArgs['context']): string | null {
  const apiKey = readEnv(context, 'FIREBASE_API_KEY');
  return apiKey ?? null;
}

export async function lookupFirebaseUser(
  idToken: string,
  apiKey: string,
): Promise<FirebaseUserInfo | null> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Firebase accounts:lookup failed', errorText);
    return null;
  }

  const data = (await response.json()) as { users?: FirebaseUserInfo[] };
  if (!data.users || data.users.length === 0) {
    return null;
  }

  return data.users[0];
}
