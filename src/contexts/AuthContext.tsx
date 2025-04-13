"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, name?: string) => {
    const dummyName = name || email.split("@")[0];
    // Use Dicebear API to generate a unique avatar based on the user's name
    const avatar = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(dummyName)}.svg`;
    setUser({ name: dummyName, email, avatar });
  };

  const signup = (name: string, email: string, password: string) => {
    const avatar = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(name)}.svg`;
    setUser({ name, email, avatar });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 