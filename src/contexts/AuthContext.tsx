import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginCredentials, RegisterCredentials, AuthState } from "@/types/auth";
import { authService } from "@/services/auth/authService";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.refreshSession();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      } catch {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.register(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const loginWithGoogle = useCallback(() => {
    authService.initiateGoogleLogin();
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loginWithGoogle,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
