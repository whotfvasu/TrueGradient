import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export interface Organization {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  credits: number;
  activeOrganizationId?: string | null;
}

export interface AuthContext {
  token: string | null;
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, email?: string) => Promise<void>;
  signout: () => void;
  updateCredits: (credits: number) => void;
  updateOrganization: (organization: Organization) => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && !user) {
      loadUserProfile();
    }
  }, [token]);

  const loadUserProfile = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await api.getProfile(token);
      setUser(response.user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.signin(username, password);

      setToken(response.token);
      setUser(response.user);
      setOrganization(response.organization || null);
      localStorage.setItem("token", response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signin failed";
      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("not found")
      ) {
        toast.error("Username or password is incorrect");
      } else if (errorMessage.toLowerCase().includes("network")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(errorMessage);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string, email?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.signup(username, password, email);

      setToken(response.token);
      setUser(response.user);
      setOrganization(response.organization || null);
      localStorage.setItem("token", response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("taken")
      ) {
        toast.error("Username or email already exists");
      } else if (errorMessage.toLowerCase().includes("password")) {
        toast.error("Password requirements not met");
      } else if (errorMessage.toLowerCase().includes("username")) {
        toast.error("Invalid username format");
      } else {
        toast.error(errorMessage);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    setError(null);
    localStorage.removeItem("token");
  };

  const updateCredits = (credits: number) => {
    if (user) {
      setUser({ ...user, credits });
    }
  };

  const updateOrganization = (newOrganization: Organization) => {
    setOrganization(newOrganization);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        organization,
        isLoading,
        error,
        signin,
        signup,
        signout,
        updateCredits,
        updateOrganization,
        clearError,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
