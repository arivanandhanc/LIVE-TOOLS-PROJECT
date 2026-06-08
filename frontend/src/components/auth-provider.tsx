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
  login: (email: string, password: string, recaptchaToken?: string | null) => Promise<AuthOutcome>;
  register: (email: string, password: string, name: string, recaptchaToken?: string | null) => Promise<AuthOutcome>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Finish a social/OAuth sign-in: store the access token and load the user. */
  completeOAuth: (accessToken: string) => Promise<void>;
}

/** Either signed in, or an OTP/email verification step is required. */
export type AuthOutcome = { verificationRequired: boolean };

type AuthResponse =
  | { accessToken: string; user: AuthUser }
  | { verificationRequired: true; email: string };

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

  const applyAuth = React.useCallback((data: AuthResponse): AuthOutcome => {
    if ("verificationRequired" in data) return { verificationRequired: true };
    setAccessToken(data.accessToken);
    setUser(data.user);
    return { verificationRequired: false };
  }, []);

  const login = React.useCallback(async (email: string, password: string, recaptchaToken?: string | null) => {
    const data = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      headers: recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {},
      body: JSON.stringify({ email, password }),
    });
    return applyAuth(data);
  }, [applyAuth]);

  const register = React.useCallback(
    async (email: string, password: string, name: string, recaptchaToken?: string | null) => {
      const data = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        headers: recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {},
        body: JSON.stringify({ email, password, name }),
      });
      return applyAuth(data);
    },
    [applyAuth]
  );

  const verifyOtp = React.useCallback(async (email: string, code: string) => {
    const data = await apiFetch<{ accessToken: string; user: AuthUser }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const resendOtp = React.useCallback(async (email: string) => {
    await apiFetch("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) });
  }, []);

  const completeOAuth = React.useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    const { user } = await apiFetch<{ user: AuthUser }>("/api/auth/me", { auth: true });
    setUser(user);
  }, []);

  const logout = React.useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, register, verifyOtp, resendOtp, logout, completeOAuth }),
    [user, loading, login, register, verifyOtp, resendOtp, logout, completeOAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
