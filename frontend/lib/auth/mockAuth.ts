/**
 * Mock Auth Store — localStorage-backed session for demo/development.
 * Swap this file out for the real Supabase-based version when keys are ready.
 */

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

const SESSION_KEY = "gmac_mock_session";

// A demo JWT token (base64-encoded) that the backend will accept
// The backend verifies HS256 tokens with secret "change-me"
// This token encodes: sub, email, name, role  (exp: year 2030)
const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJ1c2VyLWRlbW8tMDAxIiwiZW1haWwiOiJkZW1vQGdtYWNncm91cC5vcmciLCJuYW1lIjoiRGVtbyBVc2VyIiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjE4OTM0NTYwMDB9." +
  "Fj2k9Xo3mP8vQnRlT5yWsZaGbHcDeIuYvNxKpLqMrOA";

export function getMockSession(): { user: MockUser; token: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setMockSession(user: MockUser): void {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ user, token: DEMO_TOKEN })
  );
  // Notify any listeners (cross-component state sync)
  window.dispatchEvent(new Event("gmac_auth_change"));
}

export function clearMockSession(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("gmac_auth_change"));
}

export function getMockToken(): string | null {
  return getMockSession()?.token ?? null;
}
