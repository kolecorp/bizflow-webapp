import { BehaviorSubject } from "rxjs";
import { get, writable } from "svelte/store";

export type AuthRole = "OWNER" | "ADMIN" | "STAFF";

export interface AuthBusiness {
  id: string;
  name: string;
  type?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole | string;
  businessId?: string | null;
  business?: AuthBusiness | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  authReady: boolean;
  sessionExpired: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  permissionsLoaded: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface OnboardingInput {
  businessName: string;
  type: string;
  streetAddress: string;
  city: string;
  country: string;
  teamSize: string;
  primaryService: string;
  taxId?: string;
}

interface ApiAuthEnvelope {
  accessToken?: string;
  refreshToken?: string;
  user?: Partial<AuthUser> & { businessId?: string | null };
  email?: string;
  id?: string;
  name?: string;
  role?: string;
  business?: AuthBusiness | null;
  twoFactorRequired?: boolean;
  userId?: string;
}

const AUTH_KEY = "bizflow-auth-session";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

const initialState: AuthState = {
  isAuthenticated: false,
  authReady: false,
  sessionExpired: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  permissions: [],
  permissionsLoaded: false,
};

export const authSession$ = new BehaviorSubject<AuthState>(initialState);
export const authStore = writable<AuthState>(initialState);

function persist(state: AuthState) {
  if (typeof window === "undefined") {
    return;
  }

  if ((!state.isAuthenticated || !state.accessToken) && !state.sessionExpired) {
    window.sessionStorage.removeItem(AUTH_KEY);
    return;
  }

  const snapshot = {
    ...state,
    accessToken: state.sessionExpired ? null : state.accessToken,
    user: state.user ? { ...state.user } : null,
  };

  window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(snapshot));
}

function readSession(): AuthState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      isAuthenticated: !!parsed.isAuthenticated,
      authReady: false,
      sessionExpired: !!parsed.sessionExpired,
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
      permissionsLoaded: !!parsed.permissionsLoaded,
    };
  } catch {
    return null;
  }
}

function setSession(nextState: AuthState) {
  authStore.set(nextState);
  authSession$.next(nextState);
  persist(nextState);
}

export function expireSession() {
  const current = get(authStore);
  if (!current.isAuthenticated && !current.accessToken) return;
  setSession({
    ...current,
    isAuthenticated: false,
    authReady: true,
    sessionExpired: true,
    accessToken: null,
    refreshToken: null,
    permissions: [],
    permissionsLoaded: true,
  });
}

export function handleUnauthorized(response: Response): void {
  if (response.status === 401) expireSession();
}

function normalizeUser(
  input: Partial<AuthUser> | null | undefined,
): AuthUser | null {
  if (!input?.id || (!input.email && !input.businessId && !input.role)) {
    return null;
  }

  const email = input.email ?? "";

  return {
    id: input.id,
    name: input.name ?? (email ? email.split("@")[0] : "Workspace user"),
    email,
    role: input.role ?? "STAFF",
    businessId: input.businessId ?? null,
    business: input.business ?? null,
  };
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
  suppressUnauthorized = false,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    if (!suppressUnauthorized) handleUnauthorized(response);
    const rawText = await response.text();
    let message = response.statusText || "Request failed";

    try {
      const parsed = JSON.parse(rawText) as {
        message?: string;
        error?: string;
        statusCode?: number;
      };
      message = parsed.message ?? parsed.error ?? message;
    } catch {
      if (rawText) {
        message = rawText;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function getAccessToken() {
  return get(authStore).accessToken ?? readSession()?.accessToken ?? null;
}

export async function loadCurrentUser(accessTokenOverride?: string) {
  let accessToken = accessTokenOverride ?? getAccessToken();

  if (!accessToken) {
    return null;
  }

  let user: AuthUser;
  try {
    user = await requestJson<AuthUser>(
      "/auth/me",
      { method: "GET" },
      accessToken,
      true,
    );
  } catch (error) {
    if (get(authStore).accessToken !== accessToken) throw error;
    try {
      const refreshed = await requestJson<ApiAuthEnvelope>(
        "/auth/refresh-token",
        {
          method: "POST",
        },
        undefined,
        true,
      );
      if (!refreshed.accessToken) throw error;
      if (get(authStore).accessToken !== accessToken) throw error;
      accessToken = refreshed.accessToken;
      setSession({ ...get(authStore), accessToken });
      user = await requestJson<AuthUser>(
        "/auth/me",
        { method: "GET" },
        accessToken,
      );
    } catch (refreshError) {
      if (get(authStore).accessToken === accessToken) {
        expireSession();
      }
      throw refreshError;
    }
  }
  const normalized = normalizeUser(user);

  if (!normalized) {
    return null;
  }

  const current = get(authStore);
  const nextState: AuthState = {
    ...current,
    isAuthenticated: true,
    authReady: true,
    sessionExpired: false,
    user: normalized,
    accessToken,
  };

  if (get(authStore).accessToken !== accessToken) {
    throw new Error(
      "Authentication session changed while loading the current user.",
    );
  }
  setSession(nextState);
  await loadPermissions(accessToken);
  return normalized;
}

export async function loadPermissions(accessTokenOverride?: string) {
  const accessToken = accessTokenOverride ?? getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await requestJson<{ permissions?: string[] }>(
      "/rbac/me",
      { method: "GET" },
      accessToken,
    );
    const permissions = Array.isArray(response.permissions)
      ? response.permissions
      : [];
    const current = get(authStore);
    setSession({ ...current, permissions, permissionsLoaded: true });
    return permissions;
  } catch {
    // Fail closed if the authorization state cannot be loaded.
    const current = get(authStore);
    setSession({ ...current, permissions: [], permissionsLoaded: true });
    return [];
  }
}

function toSessionPayload(data: ApiAuthEnvelope): AuthState {
  const normalizedUser = normalizeUser({
    id: data.user?.id ?? data.id ?? "",
    name: data.user?.name ?? data.name ?? "Workspace user",
    email: data.user?.email ?? data.email ?? "",
    role: data.user?.role ?? data.role ?? "STAFF",
    businessId: data.user?.businessId ?? null,
    business: data.user?.business ?? data.business ?? null,
  });

  if (!data.accessToken || !normalizedUser) {
    throw new Error(
      "Authentication response is missing a valid user or access token.",
    );
  }

  return {
    isAuthenticated: true,
    authReady: false,
    sessionExpired: false,
    user: normalizedUser,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    permissions: [],
    permissionsLoaded: false,
  };
}

export function initializeAuth() {
  if (typeof window === "undefined") {
    return;
  }

  const saved = readSession();

  if (saved?.sessionExpired) {
    setSession({
      ...initialState,
      authReady: true,
      sessionExpired: true,
      user: saved.user,
    });
    return;
  }

  if (!saved || !saved.isAuthenticated || !saved.accessToken || !saved.user) {
    setSession({ ...initialState, authReady: true });
    return;
  }

  setSession(saved);

  const tokenAtStart = saved.accessToken;
  void loadCurrentUser(tokenAtStart).catch(() => {
    // Only wipe the session if the token hasn't been replaced by a new
    // signUp / signIn that happened while this request was in-flight.
    if (get(authStore).accessToken === tokenAtStart) {
      setSession({ ...initialState, authReady: true });
    }
  });
}

export async function signIn(input: LoginInput) {
  const payload = await requestJson<ApiAuthEnvelope>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (payload.twoFactorRequired) {
    throw new Error("Two-factor authentication is required for this account.");
  }

  const nextState = toSessionPayload(payload);
  setSession(nextState);
  await loadCurrentUser(nextState.accessToken);
  return nextState;
}

export async function signUp(input: RegisterInput) {
  const payload = await requestJson<ApiAuthEnvelope>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
    }),
  });

  const nextState = toSessionPayload(payload);
  setSession(nextState);
  await loadCurrentUser(nextState.accessToken);
  return nextState;
}

export async function completeOnboarding(
  input: OnboardingInput,
  accessTokenOverride?: string,
) {
  const accessToken = accessTokenOverride ?? getAccessToken();

  if (!accessToken) {
    throw new Error("You must be signed in before completing onboarding.");
  }

  await requestJson<Record<string, unknown>>(
    "/businesses/onboarding",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    accessToken,
  );

  const current = get(authStore);
  await loadCurrentUser(accessToken);
  return get(authStore);
}

export async function signOut() {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      await requestJson<{ success: true }>(
        "/auth/logout",
        { method: "POST" },
        accessToken,
      );
    } catch {
      // Swallow logout failures to ensure the client clears local session state.
    }
  }

  setSession(initialState);
}
