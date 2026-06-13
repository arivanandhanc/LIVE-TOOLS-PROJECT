"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRecaptcha, preloadRecaptcha } from "@/lib/recaptcha";
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
  const [stage, setStage] = React.useState<"form" | "otp">("form");
  const [otp, setOtp] = React.useState("");
  const [resent, setResent] = React.useState(false);

  const isSignup = mode === "signup";

  // Where to go after a successful sign-in. Honour a ?next= return path (e.g.
  // set by the /admin guard), but only same-origin relative paths to avoid an
  // open-redirect. Falls back to the dashboard.
  function destination(): string {
    if (typeof window === "undefined") return "/dashboard";
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  }

  // Load reCAPTCHA so the v3 badge is visible on this page.
  React.useEffect(() => {
    preloadRecaptcha();
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
        router.push(destination());
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
      router.push(destination());
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
        {isSignup ? "Already have an account? " : "New to Arivu's Scrab Tools? "}
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
