import { User, AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth";

const AUTH_TOKEN_KEY = "node48_auth_token";
const AUTH_USER_KEY = "node48_auth_user";

// Mock users for development
const mockUsers: Map<string, { user: User; password: string }> = new Map();

// Initialize with a test user
mockUsers.set("test@example.com", {
  user: {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date().toISOString(),
  },
  password: "password123",
});

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(800);

    const stored = mockUsers.get(credentials.email);
    if (!stored || stored.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    const response: AuthResponse = {
      user: stored.user,
      accessToken: `mock-token-${Date.now()}`,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

    return response;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay(800);

    if (mockUsers.has(credentials.email)) {
      throw new Error("Email already registered");
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.set(credentials.email, {
      user: newUser,
      password: credentials.password,
    });

    const response: AuthResponse = {
      user: newUser,
      accessToken: `mock-token-${Date.now()}`,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

    return response;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
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
  initiateGoogleLogin: (): void => {
    // In production, this would redirect to your backend OAuth endpoint
    // For mock, we'll simulate the flow
    window.location.href = "/api/auth/google";
  },

  // Handle OAuth callback
  handleOAuthCallback: async (token: string): Promise<AuthResponse> => {
    await delay(300);

    // Mock OAuth user
    const oauthUser: User = {
      id: `google-user-${Date.now()}`,
      email: "google@example.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user",
      createdAt: new Date().toISOString(),
    };

    const response: AuthResponse = {
      user: oauthUser,
      accessToken: token,
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

    return response;
  },

  // Refresh session
  refreshSession: async (): Promise<User | null> => {
    const token = authService.getStoredToken();
    if (!token) return null;

    // In production, validate token with backend
    return authService.getStoredUser();
  },
};
