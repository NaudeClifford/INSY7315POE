import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Exact Firebase Web SDK configuration for camrynburgerphotography
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBdpHhPWj8VXT3TN7sTAJ02FdES-kTrFmQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "camrynburgerphotography.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "camrynburgerphotography",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "camrynburgerphotography.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "456157736582",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:456157736582:web:7cfdfcc00360a5f8e12b07",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.length > 5 &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.length > 2
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured()) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization skipped or failed:", error);
  }
}

export { app, db, auth, storage, googleProvider };

/**
 * Recursively sanitizes data before writing to Firestore, removing all `undefined`
 * values from objects and arrays to prevent Firestore 'Unsupported field value: undefined' errors.
 */
export function cleanForFirestore<T>(val: T): T {
  if (val === undefined) return undefined as unknown as T;
  if (val === null || typeof val !== "object") return val;
  if (Array.isArray(val)) {
    return val
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirestore(item)) as unknown as T;
  }
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
    if (v !== undefined) {
      const c = cleanForFirestore(v);
      if (c !== undefined) {
        cleaned[k] = c;
      }
    }
  }
  return cleaned as T;
}
