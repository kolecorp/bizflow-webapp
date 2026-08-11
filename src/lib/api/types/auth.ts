export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "admin" | "staff" | "user";
  createdAt: string;
}

export interface SignInInput {
  email: string;
  password: string;
}
