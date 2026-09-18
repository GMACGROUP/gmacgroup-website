"use client";

import { useEffect, useState, useCallback } from "react";
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
  access_token: string;
  token_type: string;
  user: UserProfile;
}

const TOKEN_KEY = "gmac_auth_token";
const USER_KEY = "gmac_auth_user";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Verify with backend silently
        apiClient
          .get<UserProfile>("/auth/me")
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          })
          .catch(() => {
            // Token might be expired or invalid
            // We can keep local user or let them re-login if endpoint fails
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await apiClient.post<AuthResponse>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setUser(res.user);
      setToken(res.access_token);
      return res.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload: {
      full_name: string;
      email: string;
      password: string;
      role?: string;
    }): Promise<UserProfile> => {
      setLoading(true);
      try {
        const res = await apiClient.post<AuthResponse>("/auth/register", {
          full_name: payload.full_name,
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          role: payload.role || "student",
        });

        localStorage.setItem(TOKEN_KEY, res.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        setUser(res.user);
        setToken(res.access_token);
        return res.user;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(
    async (data: {
      full_name?: string;
      bio?: string;
      organization?: string;
      phone?: string;
    }): Promise<UserProfile> => {
      const updated = await apiClient.put<UserProfile>("/users/me", data);
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    },
    []
  );

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: Boolean(user),
  };
}
