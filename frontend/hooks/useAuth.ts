"use client";

import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  created_at?: string;
  bio?: string | null;
  organization?: string | null;
  phone?: string | null;
}

interface AuthResponse {
  user: UserProfile;
}

// The session itself is an httpOnly cookie set by the API. Only the (non-secret)
// profile is cached in the browser, so the navbar can show the name instantly.
const USER_KEY = "gmac_auth_user";
const LEGACY_TOKEN_KEY = "gmac_auth_token";
const AUTH_CHANGED_EVENT = "gmac-auth-changed";

function cache(user: UserProfile | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch {}
}

function useAuthState() {
  // Keep the initial render identical on the server and in the browser.
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<UserProfile | null> => {
    try {
      const freshUser = await apiClient.get<UserProfile>("/auth/me");
      setUser(freshUser);
      cache(freshUser);
      return freshUser;
    } catch {
      setUser(null);
      cache(null);
      return null;
    }
  }, []);

  // On mount: show the cached profile, then confirm the session with the API.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) setUser(JSON.parse(stored) as UserProfile);
    } catch {}
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    const onChange = () => {
      try {
        const stored = localStorage.getItem(USER_KEY);
        setUser(stored ? (JSON.parse(stored) as UserProfile) : null);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === USER_KEY) onChange();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    setUser(res.user);
    cache(res.user);
    setLoading(false);
    return res.user;
  }, []);

  const register = useCallback(
    async (payload: { full_name: string; email: string; password: string; role?: string }): Promise<UserProfile> => {
      const res = await apiClient.post<AuthResponse>("/auth/register", {
        full_name: payload.full_name,
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        role: payload.role || "student",
      });
      setUser(res.user);
      cache(res.user);
      setLoading(false);
      return res.user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {}
    setUser(null);
    cache(null);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }, []);

  const updateProfile = useCallback(
    async (data: { full_name?: string; bio?: string; organization?: string; phone?: string }): Promise<UserProfile> => {
      const updated = await apiClient.put<UserProfile>("/users/me", data);
      setUser(updated);
      cache(updated);
      return updated;
    },
    []
  );

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: Boolean(user),
  };
}

type AuthContextValue = ReturnType<typeof useAuthState>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState();
  return createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return auth;
}
