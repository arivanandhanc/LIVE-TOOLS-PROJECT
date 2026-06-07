"use client";

import * as React from "react";

/**
 * Lightweight Google reCAPTCHA v3 loader.
 *
 * The script is injected on demand (first time a protected action runs) so it
 * never blocks initial page load or hurts Lighthouse. `execute()` returns a
 * short-lived token that the BACKEND must verify against the secret key — the
 * token alone proves nothing without server verification.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (!SITE_KEY) return Promise.reject(new Error("reCAPTCHA site key not configured"));
  if (window.grecaptcha) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function useRecaptcha() {
  const enabled = Boolean(SITE_KEY);

  const execute = React.useCallback(
    async (action: string): Promise<string | null> => {
      if (!enabled) return null; // gracefully no-op when not configured
      await loadScript();
      return new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window
            .grecaptcha!.execute(SITE_KEY!, { action })
            .then(resolve)
            .catch(reject);
        });
      });
    },
    [enabled]
  );

  return { execute, enabled };
}
