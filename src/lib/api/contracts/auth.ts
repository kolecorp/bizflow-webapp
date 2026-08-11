import type { AuthUser, SignInInput } from "../types/auth";

export interface AuthRepository {
  signIn(input: SignInInput): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
