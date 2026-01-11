import { User, AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { v4 as uuid } from "uuid";

const AUTH_TOKEN_KEY = "node48_auth_token";
const AUTH_USER_KEY = "node48_auth_user";

const setMockUser = (key) => {
  const mockUserKey = "test@example.com"
  const mockUserValue = {
    id: uuid(),
    user: {
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date().toISOString(),
    },
    password: "password123",
  }
  localStorage.setItem(key, JSON.stringify({[mockUserKey]: mockUserValue}))
  return JSON.parse(localStorage.getItem(key))
}
const getUsers = (key) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : setMockUser(AUTH_USER_KEY)

const mockUsers = getUsers(AUTH_USER_KEY)


const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);

    const stored = mockUsers[credentials.email];
    
    if (!stored || stored.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    const response: AuthResponse = {
      user: stored.user,
      accessToken: stored.id,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, stored.id);

    return response;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const register_id = uuid()

    await delay(800);

    if (mockUsers[credentials.email]) {
      throw new Error("Email already registered");
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const newUser: User = {
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    };

    mockUsers[credentials.email] = {
      id: register_id,
      user: newUser,
      password: credentials.password,
    };

    const response: AuthResponse = {
      id: register_id,
      user: newUser,
      accessToken: register_id,
    };

  
    localStorage.setItem(AUTH_TOKEN_KEY, register_id);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUsers));

    return response;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getStoredUser: (): User | null => {
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY);
      if (!userJson) return null;
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!authService.getStoredToken();
  },

  // Google OAuth - redirect to backend endpoint
  initiateGoogleLogin: async(): Promise<void> => {
    const googleUser = await authService.handleOAuthCallback()
    return authService.login(googleUser)
  },

  // Handle OAuth callback
  handleOAuthCallback: async (): Promise<RegisterCredentials> => {
    await delay(300);

    // Mock OAuth user
    const oauthUser: RegisterCredentials = {
      email: "google@example.com",
      name: "Google User",
      confirmPassword: "password",
      password: "password"
    };

    return oauthUser;
  },

  // Refresh session
  refreshSession: async (): Promise<User | null> => {
    const token = authService.getStoredToken();
    if (!token) return null;

    // In production, validate token with backend
    return authService.getStoredUser();
  },
};
