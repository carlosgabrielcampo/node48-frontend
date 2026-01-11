import { UUID } from "node:crypto";
export interface User {
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  id: UUID;
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
