import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Analytics, isSupported } from 'firebase/analytics';

// Firebase config for the rendr-components documentation site (this
// Storybook build), read from env vars — see .env.example. Not used by the
// published `rendr-components` package; consumers never pull this in.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let analyticsPromise: Promise<Analytics | null> | undefined;

/** Initializes Firebase once. No-ops (and warns once) if env vars are missing, e.g. in local dev without a `.env`. */
export function getFirebaseApp(): FirebaseApp | undefined {
  if (app) return app;
  if (!firebaseConfig.apiKey) {
    console.warn('[firebase] Skipping init — VITE_FIREBASE_* env vars are not set. Copy .env.example to .env.');
    return undefined;
  }
  app = initializeApp(firebaseConfig);
  return app;
}

/** Analytics only works in a real browser with measurement support (not SSR, not every embedded webview). */
export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (analyticsPromise) return analyticsPromise;
  analyticsPromise = (async () => {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp || typeof window === 'undefined') return null;
    if (!(await isSupported())) return null;
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(firebaseApp);
  })();
  return analyticsPromise;
}
