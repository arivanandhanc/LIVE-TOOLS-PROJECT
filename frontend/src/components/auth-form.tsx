"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRecaptcha, preloadRecaptcha } from "@/lib/recaptcha";
import { getOAuthStatus, startOAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/tools/panel";
import { Logo } from "@/components/layout/logo";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { login, register, verifyOtp, resendOtp } = useAuth();
  const { execute } = useRecaptcha();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [socialMsg, setSocialMsg] = React.useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = React.useState(false);
  const [stage, setStage] = React.useState<"form" | "otp">("form");
  const [otp, setOtp] = React.useState("");
  const [resent, setResent] = React.useState(false);

  const isSignup = mode === "signup";

  // Load reCAPTCHA so the v3 badge is visible on this page.
  React.useEffect(() => {
    preloadRecaptcha();
    getOAuthStatus().then((s) => setGoogleEnabled(s.google)).catch(() => undefined);
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("error") === "oauth") {
      setError("Google sign-in didn't complete. Please try again.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const token = await execute(mode).catch(() => null);
      const outcome = isSignup
        ? await register(email, password, name, token)
        : await login(email, password, token);
      if (outcome.verificationRequired) {
        setStage("otp");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === "Failed to fetch"
            ? "Couldn't reach the server. Accounts require the backend + a database."
            : err.message
          : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(email, otp);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    setError(null);
    setResent(false);
    try {
      await resendOtp(email);
      setResent(true);
    } catch {
      setError("Couldn't resend the code. Please try again.");
    }
  }

  if (stage === "otp") {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="text-xl" />
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Verify your email</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>. Enter it below.
          </p>
        </div>
        <form onSubmit={onVerify} className="space-y-4">
          <Field label="Verification code">
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="text-center text-lg tracking-[0.5em]"
              required
            />
          </Field>
          {error && (
            <p className="flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </p>
          )}
          {resent && <p className="text-sm text-success">A new code is on its way.</p>}
          <Button type="submit" className="w-full" size="lg" disabled={busy || otp.length < 6}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            Verify &amp; continue
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <button type="button" onClick={onResend} className="text-primary hover:underline">
            Resend code
          </button>
          <button type="button" onClick={() => { setStage("form"); setOtp(""); setError(null); }} className="text-muted-foreground hover:text-foreground">
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo className="text-xl" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignup ? "Save your history, favorites and files." : "Sign in to access your dashboard."}
        </p>
      </div>

      <div className="grid gap-2">
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => (googleEnabled ? startOAuth("google") : setSocialMsg("Google sign-in isn't enabled on this deployment yet — please use email."))}
        >
          <GoogleIcon /> Continue with Google
        </Button>
      </div>
      {socialMsg && <p className="mt-2 text-center text-xs text-muted-foreground">{socialMsg}</p>}

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isSignup && (
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
          </Field>
        )}
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </Field>
        <Field label="Password" hint={isSignup ? "At least 8 characters." : undefined}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </Field>

        {error && (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          {isSignup ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New to ConvertFlow? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-primary hover:underline">
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and{" "}
        <a href="https://policies.google.com/terms" className="underline">Terms</a> apply.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
