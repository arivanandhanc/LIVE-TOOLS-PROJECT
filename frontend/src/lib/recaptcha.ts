"use client";

import * as React from "react";

/**
 * Google reCAPTCHA — site-wide, score-based (invisible).
 *
 * Supports BOTH product tiers, because they use different script URLs and
 * JS namespaces:
 *   • "enterprise" → recaptcha/enterprise.js  + grecaptcha.enterprise.*
 *   • "classic"    → recaptcha/api.js         + grecaptcha.*
 * Pick with NEXT_PUBLIC_RECAPTCHA_MODE; the server must be configured to match
 * (Enterprise verifies via the Assessments API, classic via siteverify).
 *
 * The script is loaded once on EVERY page (see `<RecaptchaProvider />` in the
 * root layout) so Google can score the whole browsing session, and the badge is
 * visible everywhere as their terms require. `execute()` returns a short-lived
 * token that the BACKEND must verify — the token alone proves nothing.
 */

// Public site key (safe to ship). Defaults to the production Enterprise key so
// the widget works even if the NEXT_PUBLIC env var is missing at build time.
const SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfoQYstAAAAALuAV-YAK6YFosEtf8iTX0wTBgqJ";

const MODE = (process.env.NEXT_PUBLIC_RECAPTCHA_MODE || "enterprise").toLowerCase();
const IS_ENTERPRISE = MODE === "enterprise";

const SCRIPT_URL = IS_ENTERPRISE
  ? `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`
  : `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;

export const RECAPTCHA_ENABLED = Boolean(SITE_KEY);

interface GrecaptchaApi {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi & { enterprise?: GrecaptchaApi };
  }
}

/** The namespace holding ready/execute for the configured tier. */
function api(): GrecaptchaApi | undefined {
  const g = typeof window === "undefined" ? undefined : window.grecaptcha;
  return IS_ENTERPRISE ? g?.enterprise : g;
}

/**
 * API paths that must NOT carry a token. These fire without any user gesture
 * (silent refresh on page load, telemetry beacons), so demanding a token would
 * burn assessment quota and add latency for no anti-abuse gain. Kept in sync
 * with `RECAPTCHA_SKIP_PATHS` on the server.
 */
const SKIP_PATHS = ["/api/auth/refresh", "/api/auth/logout", "/api/auth/oauth", "/api/usage"];

export function needsRecaptcha(path: string, method = "GET"): boolean {
  if (!RECAPTCHA_ENABLED) return false;
  if (["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) return false;
  const clean = path.split("?")[0];
  return !SKIP_PATHS.some((p) => clean === p || clean.startsWith(`${p}/`));
}

/**
 * Google only accepts alphanumerics, slashes and underscores in an action, and
 * the value must not identify a specific user.
 */
export function actionFromPath(path: string): string {
  return path.split("?")[0].replace(/^\/+/, "").replace(/[^A-Za-z0-9/_]/g, "_") || "submit";
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (!SITE_KEY) return Promise.reject(new Error("reCAPTCHA site key not configured"));
  if (api()) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-recaptcha]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = MODE;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow a later retry (flaky network / blocker)
      reject(new Error("Failed to load reCAPTCHA"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Load the reCAPTCHA script so the badge is present and Google starts observing
 * the session. Safe to call on mount of any page; idempotent.
 */
export function preloadRecaptcha() {
  loadScript().catch(() => undefined);
}

/**
 * Get a token for `action`. Never throws — resolves to `null` when reCAPTCHA is
 * unconfigured, blocked by an extension, or offline, so a transient Google
 * outage can't take the whole site down. The server decides how to treat a
 * missing token.
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!RECAPTCHA_ENABLED || typeof window === "undefined") return null;
  try {
    await loadScript();
    const grecaptcha = api();
    if (!grecaptcha) return null;
    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  } catch {
    return null;
  }
}

export function useRecaptcha() {
  const execute = React.useCallback(
    (action: string): Promise<string | null> => executeRecaptcha(action),
    []
  );

  return { execute, enabled: RECAPTCHA_ENABLED };
}
