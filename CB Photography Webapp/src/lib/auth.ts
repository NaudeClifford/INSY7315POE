// src/lib/auth.ts
// Direct Firebase Authentication & Firestore User Role Management

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
  verifyPasswordResetCode
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

// User profile structure for client-side authentication
export interface AuthUser {
  email: string;
  name: string;
  role: "admin" | "photographer" | "client";
  phone?: string;
  photographerId?: string;
}

const AUTH_KEY = "cb_auth_user";

// Cookie helpers for cross-context compatibility
function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value};path=/;max-age=604800;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;path=/;max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// Retrieves the logged-in user from storage synchronously
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    if (sessionStorage.getItem("cb_logged_out") === "true") return null;
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.email?.toLowerCase().includes("nadine")) {
        localStorage.removeItem(AUTH_KEY);
        deleteCookie("cb_auth_role");
        deleteCookie("cb_auth_email");
        deleteCookie("cb_photographer_id");
        return null;
      }
      if (parsed && parsed.role && parsed.email) return parsed;
    }
  } catch { }
  return null;
}

// Signs in directly through Firebase Authentication SDK and resolves Firestore role
export async function loginUser(
  email: string,
  password: string,
  requestedRole?: "admin" | "photographer" | "client"
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (typeof window !== "undefined") {
    try { sessionStorage.removeItem("cb_logged_out"); } catch { }
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!isFirebaseConfigured() || !auth) {
    return {
      success: false,
      error: "Firebase Authentication is not configured."
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = userCredential.user;

    // Fetch User Profile & Role from Firestore users collection
    let profileData: any = null;
    if (db) {
      try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) {
          profileData = snap.data();
        } else {
          const q = query(collection(db, "users"), where("email", "==", cleanEmail));
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            profileData = querySnap.docs[0].data();
          }
        }
      } catch (err) {
        console.warn("Firestore user profile fetch warning:", err);
      }
    }

    // Resolve Role purely from Firestore profile data
    let userRole: "admin" | "photographer" | "client" = "client";
    const rawRole = (profileData?.role || "").toLowerCase();
    if (rawRole.includes("admin")) {
      userRole = "admin";
    } else if (rawRole.includes("photo")) {
      userRole = "photographer";
    } else {
      userRole = "client";
    }

    // Role Access Gate if a specific portal was requested
    if (requestedRole === "admin" && userRole !== "admin") {
      await signOut(auth);
      return {
        success: false,
        error: "Access denied: Account does not have administrator privileges."
      };
    }
    if (requestedRole === "photographer" && userRole !== "photographer" && userRole !== "admin") {
      await signOut(auth);
      return {
        success: false,
        error: "Access denied: Account does not have photographer privileges."
      };
    }

    const user: AuthUser = {
      email: fbUser.email || cleanEmail,
      name: profileData?.name || fbUser.displayName || cleanEmail.split("@")[0],
      role: userRole,
      phone: profileData?.phone,
      photographerId: profileData?.photographerId
    };

    if (typeof window !== "undefined") {
      try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch { }
      setCookie("cb_auth_role", user.role);
      setCookie("cb_auth_email", user.email);
      window.dispatchEvent(new Event("auth_changed"));
    }

    return { success: true, user };
  } catch (firebaseErr: any) {
    let message = "Invalid email or password. Please verify your credentials.";
    if (
      firebaseErr.code === "auth/invalid-credential" ||
      firebaseErr.code === "auth/wrong-password" ||
      firebaseErr.code === "auth/user-not-found"
    ) {
      message = "Invalid email or password. Please check your credentials.";
    } else if (firebaseErr.code === "auth/too-many-requests") {
      message = "Too many failed attempts. Please try again later.";
    } else if (firebaseErr.message) {
      message = firebaseErr.message;
    }
    return { success: false, error: message };
  }
}

// Creates a new client account directly in Firebase Authentication & Cloud Firestore
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string; verificationSent?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!isFirebaseConfigured() || !auth) {
    return {
      success: false,
      error: "Firebase Authentication is not configured."
    };
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = credential.user;

    if (fullName) {
      await updateProfile(fbUser, { displayName: fullName }).catch(() => {});
    }

    const profile: AuthUser = {
      email: cleanEmail,
      name: fullName || cleanEmail.split("@")[0],
      role: "client",
      phone: phone || ""
    };

    if (db) {
      await setDoc(doc(db, "users", fbUser.uid), {
        id: fbUser.uid,
        email: cleanEmail,
        name: profile.name,
        role: "Client",
        phone: phone || "",
        createdAt: new Date().toISOString().split("T")[0]
      });
    }

    // Automatically send email verification link to new account
    try {
      await sendEmailVerification(fbUser);
    } catch (verifErr) {
      console.warn("sendEmailVerification notice:", verifErr);
    }

    if (typeof window !== "undefined") {
      try { localStorage.setItem(AUTH_KEY, JSON.stringify(profile)); } catch {}
      try { sessionStorage.removeItem("cb_logged_out"); } catch {}
      setCookie("cb_auth_role", profile.role);
      setCookie("cb_auth_email", profile.email);
      window.dispatchEvent(new Event("auth_changed"));
    }

    return { success: true, user: profile, verificationSent: true };
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      return { success: false, error: "An account with this email address already exists. Please sign in instead." };
    }
    return { success: false, error: err.message || "Failed to create account." };
  }
}

// Dispatches a password reset email via Firebase Authentication
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Please enter your email address." };
  }

  if (!isFirebaseConfigured() || !auth) {
    return { success: false, error: "Firebase Authentication is not configured." };
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return { success: true };
  } catch (err: any) {
    let message = "Failed to send password reset email. Please try again.";
    if (err.code === "auth/invalid-email") {
      message = "Please enter a valid email address.";
    } else if (err.code === "auth/user-not-found") {
      // Return success to prevent email enumeration attacks
      return { success: true };
    } else if (err.code === "auth/too-many-requests") {
      message = "Too many requests. Please wait a few moments before trying again.";
    } else if (err.message) {
      message = err.message;
    }
    return { success: false, error: message };
  }
}

// Resends a verification email to the current authenticated user
export async function resendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured() || !auth || !auth.currentUser) {
    return { success: false, error: "No active user session found to send verification email." };
  }

  try {
    await sendEmailVerification(auth.currentUser);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send verification email." };
  }
}

// Verifies a password reset OOB code from an email link
export async function verifyResetCode(
  oobCode: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  if (!isFirebaseConfigured() || !auth) {
    return { success: false, error: "Firebase Authentication is not configured." };
  }

  try {
    const email = await verifyPasswordResetCode(auth, oobCode);
    return { success: true, email };
  } catch (err: any) {
    return { success: false, error: "The password reset link is invalid or has expired." };
  }
}

// Completes password reset using an OOB code from the reset email
export async function completePasswordReset(
  oobCode: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured() || !auth) {
    return { success: false, error: "Firebase Authentication is not configured." };
  }

  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset password." };
  }
}

// Queries Firebase Auth and Cloud Firestore for the active session
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  if (typeof window !== "undefined" && sessionStorage.getItem("cb_logged_out") === "true") {
    return null;
  }

  if (isFirebaseConfigured() && auth) {
    if (typeof auth.authStateReady === "function") {
      try {
        await auth.authStateReady();
      } catch { }
    }

    const fbUser = auth.currentUser;
    if (fbUser && fbUser.email) {
      if (db) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          let data = snap.exists() ? snap.data() : null;
          if (!data) {
            const q = query(collection(db, "users"), where("email", "==", fbUser.email.toLowerCase()));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) data = qSnap.docs[0].data();
          }

          let role: "admin" | "photographer" | "client" = "client";
          const rawRole = (data?.role || "").toLowerCase();
          if (rawRole.includes("admin")) role = "admin";
          else if (rawRole.includes("photo")) role = "photographer";

          const user: AuthUser = {
            email: fbUser.email,
            name: data?.name || fbUser.displayName || fbUser.email.split("@")[0],
            role,
            phone: data?.phone,
            photographerId: data?.photographerId
          };

          if (typeof window !== "undefined") {
            try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch { }
            setCookie("cb_auth_role", user.role);
            setCookie("cb_auth_email", user.email);
          }
          return user;
        } catch { }
      }
    } else {
      // Firebase auth confirmed no active session
      if (typeof window !== "undefined") {
        try { localStorage.removeItem(AUTH_KEY); } catch { }
        deleteCookie("cb_auth_role");
        deleteCookie("cb_auth_email");
        deleteCookie("cb_photographer_id");
      }
      return null;
    }
  }

  return getAuthUser();
}

// Completely signs out of Firebase Authentication and clears local session
export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase signOut error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try { localStorage.removeItem(AUTH_KEY); } catch { }
    try { sessionStorage.setItem("cb_logged_out", "true"); } catch { }
    deleteCookie("cb_auth_role");
    deleteCookie("cb_auth_email");
    deleteCookie("cb_photographer_id");
    window.dispatchEvent(new Event("auth_changed"));
  }
}

// Updates the currently active user profile directly in Firestore
export async function updateUserProfile(updates: Partial<AuthUser>): Promise<AuthUser | null> {
  const current = getAuthUser();
  if (!current) return null;

  const merged: AuthUser = {
    email: current.email,
    name: updates.name || current.name,
    role: current.role,
    phone: updates.phone ?? current.phone,
    photographerId: updates.photographerId ?? current.photographerId
  };

  if (isFirebaseConfigured() && auth && db) {
    const fbUser = auth.currentUser;
    if (fbUser) {
      try {
        if (updates.name && updates.name !== fbUser.displayName) {
          await updateProfile(fbUser, { displayName: updates.name }).catch(() => {});
        }
        await updateDoc(doc(db, "users", fbUser.uid), {
          name: merged.name,
          phone: merged.phone || "",
          updatedAt: new Date().toISOString()
        }).catch(async () => {
          await setDoc(doc(db!, "users", fbUser.uid), {
            id: fbUser.uid,
            email: fbUser.email,
            name: merged.name,
            role: merged.role,
            phone: merged.phone || "",
            updatedAt: new Date().toISOString()
          }, { merge: true });
        });
      } catch (err) {
        console.error("Firestore updateUserProfile error:", err);
      }
    }
  }

  if (typeof window !== "undefined") {
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(merged)); } catch { }
    setCookie("cb_auth_role", merged.role);
    setCookie("cb_auth_email", merged.email);
    window.dispatchEvent(new Event("auth_changed"));
  }

  return merged;
}

// Automatic Auth State Listener syncing Firestore user profile
if (typeof window !== "undefined" && isFirebaseConfigured() && auth) {
  // Purge any stale mock session on initial script load
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw && raw.toLowerCase().includes("nadine")) {
      localStorage.removeItem(AUTH_KEY);
      deleteCookie("cb_auth_role");
      deleteCookie("cb_auth_email");
      deleteCookie("cb_photographer_id");
    }
  } catch { }

  onAuthStateChanged(auth, async (fbUser) => {
    if (sessionStorage.getItem("cb_logged_out") === "true") {
      try { localStorage.removeItem(AUTH_KEY); } catch { }
      deleteCookie("cb_auth_role");
      deleteCookie("cb_auth_email");
      deleteCookie("cb_photographer_id");
      return;
    }
    if (fbUser && fbUser.email) {
      if (db) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          let data = snap.exists() ? snap.data() : null;
          if (!data) {
            const q = query(collection(db, "users"), where("email", "==", fbUser.email.toLowerCase()));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) data = qSnap.docs[0].data();
          }

          let role: "admin" | "photographer" | "client" = "client";
          const rawRole = (data?.role || "").toLowerCase();
          if (rawRole.includes("admin")) role = "admin";
          else if (rawRole.includes("photo")) role = "photographer";

          const user: AuthUser = {
            email: fbUser.email,
            name: data?.name || fbUser.displayName || fbUser.email.split("@")[0],
            role,
            phone: data?.phone,
            photographerId: data?.photographerId
          };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          setCookie("cb_auth_role", user.role);
          setCookie("cb_auth_email", user.email);
          window.dispatchEvent(new Event("auth_changed"));
        } catch { }
      }
    } else {
      // User is logged out in Firebase - clear session
      try { localStorage.removeItem(AUTH_KEY); } catch { }
      deleteCookie("cb_auth_role");
      deleteCookie("cb_auth_email");
      deleteCookie("cb_photographer_id");
      window.dispatchEvent(new Event("auth_changed"));
    }
  });
}
