import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import type { FirebaseClientConfig } from '~/lib/firebase-auth.server';

declare global {
  interface Window {
    firebase?: any;
  }
}

type FirebaseAppState = {
  auth: any;
  provider: any;
};

async function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Gagal memuat skrip ${src}`));
    document.head.appendChild(script);
  });
}

function ensureFirebaseApp(config: FirebaseClientConfig): FirebaseAppState | null {
  const firebase = window.firebase ?? (globalThis as { firebase?: any }).firebase;
  if (!firebase) return null;

  if (!window.firebase && firebase) {
    window.firebase = firebase;
  }

  const existing = firebase.apps?.find((app: any) => app?.name === 'santrionline-web');
  const app = existing ?? firebase.initializeApp(config, 'santrionline-web');
  const auth = app.auth();
  auth.useDeviceLanguage?.();
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters?.({ prompt: 'select_account' });
  return { auth, provider };
}

type Props = {
  config: FirebaseClientConfig;
  redirectTo?: string;
  label: string;
};

export function FirebaseGoogleButton({ config, redirectTo, label }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [firebaseState, setFirebaseState] = useState<FirebaseAppState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    let cancelled = false;

    async function setupFirebase() {
      try {
        await loadScript('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/11.0.2/firebase-auth-compat.js');
        if (cancelled) return;
        const state = ensureFirebaseApp(config);
        setFirebaseState(state);
        setError(state ? null : 'Firebase belum tersedia di browser.');
      } catch (setupError) {
        console.error('Gagal menyiapkan Firebase:', setupError);
        if (!cancelled) {
          setError('Gagal memuat Firebase. Periksa koneksi internet Anda.');
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    setupFirebase();

    return () => {
      cancelled = true;
    };
  }, [config, isClient]);

  const handleClick = useCallback(async () => {
    if (!firebaseState) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await firebaseState.auth.signInWithPopup(firebaseState.provider);
      const idToken: string | undefined = await result.user?.getIdToken?.();
      if (!idToken) {
        setError('Firebase tidak mengembalikan token ID.');
        setIsSubmitting(false);
        return;
      }

      const form = document.createElement('form');
      form.method = 'post';
      form.action = '/auth/firebase';
      form.style.display = 'none';

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'idToken';
      tokenInput.value = idToken;
      form.appendChild(tokenInput);

      if (redirectTo) {
        const redirectInput = document.createElement('input');
        redirectInput.type = 'hidden';
        redirectInput.name = 'redirectTo';
        redirectInput.value = redirectTo;
        form.appendChild(redirectInput);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (signInError) {
      console.error('Firebase sign-in error:', signInError);
      setError('Gagal masuk dengan Google melalui Firebase. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  }, [firebaseState, redirectTo]);

  const disabled = !isClient || initializing || !firebaseState || isSubmitting;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClick}
        disabled={disabled}
      >
        {label}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
