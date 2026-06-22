"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { completeOAuth } = useAuth();
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    // The API redirects here with #token=<accessToken> in the URL fragment.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const token = new URLSearchParams(hash.replace(/^#/, "")).get("token");
    if (!token) {
      setError(true);
      return;
    }
    completeOAuth(token)
      .then(() => router.replace("/dashboard"))
      .catch(() => setError(true));
  }, [completeOAuth, router]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      {error ? (
        <>
          <AlertCircle className="size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t complete sign-in. Please{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">try again</Link>.
          </p>
        </>
      ) : (
        <>
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Signing you in…</p>
        </>
      )}
    </div>
  );
}
