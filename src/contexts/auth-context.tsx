"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SafeUser, UserRole } from "@/types/auth";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false for instant UI

  const refreshUser = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const res = await fetch("/api/auth/me", { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently handle timeout/abort - user just won't be logged in
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Check auth in background without blocking UI
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole,
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/me", { method: "DELETE" });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
