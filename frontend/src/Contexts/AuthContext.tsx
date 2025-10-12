import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  username: string;
  credits?: number;
}

export interface AuthContext {
  token: string | null;
  user: User | null;
  signin: (token: string, user: User) => void;
  signout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const signin = (t: string, u: User) => {
    setToken(t);
    setUser(u);
  };
  const signout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signin, signout, isAuthenticated: !!token }}
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
