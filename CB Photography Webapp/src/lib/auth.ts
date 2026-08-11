// Authentication and Session Helper for Client, Photographer, and Admin Portals

export interface AuthUser {
  email: string;
  name: string;
  role: "admin" | "photographer" | "client";
  token?: string;
}

const AUTH_KEY = "cb_auth_user";

// Get cookie value helper
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Set cookie helper
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

// Clear cookie helper
function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Retrieve logged-in user session from localStorage or browser cookies
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  // 1. Try reading from localStorage
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.role && parsed.email) {
        return parsed;
      }
    }
  } catch {}

  // 2. Fallback to cookies
  const cookieRole = getCookie("cb_auth_role") as "admin" | "photographer" | "client" | null;
  const cookieEmail = getCookie("cb_auth_email");

  if (cookieRole && cookieEmail) {
    const user: AuthUser = {
      email: cookieEmail,
      name: cookieEmail.split("@")[0],
      role: cookieRole
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {}
    return user;
  }

  return null;
}

// Authenticate user and persist session to localStorage AND browser cookies
export function loginUser(role: "admin" | "photographer" | "client", email: string, name?: string): AuthUser {
  const user: AuthUser = {
    email: email.trim().toLowerCase(),
    name: name || email.split("@")[0],
    role
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {}
    setCookie("cb_auth_role", role);
    setCookie("cb_auth_email", user.email);
  }

  return user;
}

// Terminate active user session
export function logoutUser() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    deleteCookie("cb_auth_role");
    deleteCookie("cb_auth_email");
  }
}

// Check if user is authenticated with expected role
export function requireAuthRole(expectedRole: "admin" | "photographer" | "client"): boolean {
  const user = getAuthUser();
  if (!user) return false;
  return user.role === expectedRole;
}
