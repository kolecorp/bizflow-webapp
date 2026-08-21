import { writable } from "svelte/store";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const AUTH_KEY = "cafe-management-auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authStore = writable<AuthState>(initialState);

function persist(state: AuthState) {
  if (typeof window === "undefined") {
    return;
  }

  if (!state.isAuthenticated) {
    window.localStorage.removeItem(AUTH_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function initializeAuth() {
  if (typeof window === "undefined") {
    return;
  }

  const saved = window.localStorage.getItem(AUTH_KEY);

  if (!saved) {
    authStore.set(initialState);
    return;
  }

  try {
    const parsed = JSON.parse(saved) as AuthState;

    if (parsed?.isAuthenticated && parsed.user) {
      authStore.set(parsed);
      return;
    }
  } catch {
    // Ignore malformed local state and fall back to signed out.
  }

  authStore.set(initialState);
}

export async function signIn(input: { email: string; password: string }) {
  const nextUser: AuthUser = {
    id: "demo-user-1",
    name: "Aisha Morgan",
    email: input.email,
    role: "Operations Manager",
  };

  const nextState: AuthState = {
    isAuthenticated: true,
    user: nextUser,
  };

  authStore.set(nextState);
  persist(nextState);

  return nextState;
}

export async function signOut() {
  authStore.set(initialState);
  persist(initialState);
}
