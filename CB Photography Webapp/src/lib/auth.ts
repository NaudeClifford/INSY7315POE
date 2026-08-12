// Authentication and Session Management for CB Photography Webapp

export interface AuthUser {
  email: string;
  name: string;
  role: "admin" | "photographer" | "client";
}

const AUTH_KEY = "cb_auth_user";

// Default Demo Accounts
export const DEMO_ACCOUNTS = {
  admin: { email: "admin@cbphotography.co.za", name: "Studio Admin", role: "admin" as const },
  photographer: { email: "camryn@cbphotography.co.za", name: "Camryn Burger", role: "photographer" as const },
  client: { email: "nadine.dp@gmail.com", name: "Nadine Du Plessis", role: "client" as const }
};

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value};path=/;max-age=604800;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;path=/;max-age=0`;
}

// Retrieve active session user
export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.role && parsed.email) {
        return parsed;
      }
    }
  } catch {}

  const cRole = getCookie("cb_auth_role") as "admin" | "photographer" | "client" | null;
  const cEmail = getCookie("cb_auth_email");
  if (cRole && cEmail) {
    const user: AuthUser = {
      email: cEmail,
      name: cEmail.split("@")[0],
      role: cRole
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {}
    return user;
  }

  return null;
}

// Log in user and persist session
export function loginUser(role: "admin" | "photographer" | "client", email?: string, name?: string): AuthUser {
  const defaultAcc = DEMO_ACCOUNTS[role];
  const userEmail = email && email.trim() ? email.trim().toLowerCase() : defaultAcc.email;
  const userName = name || defaultAcc.name;

  const user: AuthUser = {
    email: userEmail,
    name: userName,
    role
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch {}
    setCookie("cb_auth_role", role);
    setCookie("cb_auth_email", userEmail);
  }

  return user;
}

// Logout active session
export function logoutUser() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
    deleteCookie("cb_auth_role");
    deleteCookie("cb_auth_email");
  }
}
