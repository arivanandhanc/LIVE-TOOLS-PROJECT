"use client";

import * as React from "react";
import { apiFetch, setAccessToken, tryRefresh } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  planTier: string;
  mfaEnabled: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, recaptchaToken?: string | null) => Promise<void>;
  register: (email: string, password: string, name: string, recaptchaToken?: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  // On mount, attempt a silent refresh to restore the session.
  React.useEffect(() => {
    (async () => {
      const ok = await tryRefresh();
      if (ok) {
        try {
          const { user } = await apiFetch<{ user: AuthUser }>("/api/auth/me", { auth: true });
          setUser(user);
        } catch {
          /* ignore */
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = React.useCallback(async (email: string, password: string, recaptchaToken?: string | null) => {
    const data = await apiFetch<{ accessToken: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      headers: recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {},
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = React.useCallback(
    async (email: string, password: string, name: string, recaptchaToken?: string | null) => {
      const data = await apiFetch<{ accessToken: string; user: AuthUser }>("/api/auth/register", {
        method: "POST",
        headers: recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {},
        body: JSON.stringify({ email, password, name }),
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
    []
  );

  const logout = React.useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
