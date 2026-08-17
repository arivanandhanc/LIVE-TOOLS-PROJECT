import { siteConfig } from "./site";
import { actionFromPath, executeRecaptcha, needsRecaptcha } from "./recaptcha";

/**
 * Thin API client with in-memory access token + automatic refresh.
 * Access token lives in memory only (XSS-safe); the refresh token is an
 * httpOnly cookie set by the backend.
 */

let accessToken: string | null = null;

/**
 * API base URL. In the browser we call the API SAME-ORIGIN (empty base → "/api/…")
 * so Next.js rewrites proxy to the backend and the refresh cookie stays first-party.
 * On the server (SSR/build) there is no proxy, so use the absolute backend origin.
 */
function apiBase(): string {
  return typeof window === "undefined" ? siteConfig.apiUrl : "";
}

// A non-sensitive hint that a session *might* exist, so guests who never logged
// in don't trigger a 401 on /api/auth/refresh every page load. The real token is
// the httpOnly refresh cookie; this is just a "should we bother trying" flag.
const SESSION_HINT = "st_session";

export function hasSessionHint(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SESSION_HINT) === "1";
  } catch {
    return false;
  }
}

function setSessionHint(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(SESSION_HINT, "1");
    else window.localStorage.removeItem(SESSION_HINT);
  } catch {
    /* ignore storage failures */
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  setSessionHint(!!token);
}
export function getAccessToken() {
  return accessToken;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

/**
 * Mint a fresh reCAPTCHA v3 token for a state-changing call, unless the caller
 * already supplied one. Tokens are single-use and expire in ~2 minutes, so we
 * generate one per request rather than caching. Returns `{}` when reCAPTCHA is
 * off or unavailable — the server decides whether that's acceptable.
 */
async function recaptchaHeader(
  path: string,
  method: string,
  provided?: HeadersInit
): Promise<Record<string, string>> {
  const already = new Headers(provided ?? {}).has("x-recaptcha-token");
  if (already || !needsRecaptcha(path, method)) return {};
  const token = await executeRecaptcha(actionFromPath(path));
  return token ? { "X-Recaptcha-Token": token } : {};
}

export async function apiFetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = false, retry = true, headers, ...rest } = opts;
  const method = (rest.method ?? "GET").toUpperCase();
  const res = await fetch(`${apiBase()}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(await recaptchaHeader(path, method, headers)),
      ...headers,
    },
  });

  // Try a one-time refresh on 401 for authed calls.
  if (res.status === 401 && auth && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(path, { ...opts, retry: false });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

// ───────────────────────────── dashboard data ─────────────────────────────

export interface DashboardStats {
  filesProcessed: number;
  thisMonth: number;
  favorites: number;
  storageBytes: number;
}

export interface ActivityItem {
  id: string;
  tool: string;
  success: boolean;
  durationMs: number | null;
  createdAt: string;
}

export interface FavoriteItem {
  toolSlug: string;
  createdAt: string;
}

// ───────────────────────────── auth / oauth ─────────────────────────────

export function getOAuthStatus() {
  return apiFetch<{ google: boolean }>("/api/auth/oauth/status");
}

/** Start a social sign-in by navigating to the API's OAuth entry point. */
export function startOAuth(provider: "google") {
  window.location.href = `${siteConfig.apiUrl}/api/auth/oauth/${provider}`;
}

// ───────────────────────────── AI tools ─────────────────────────────

export function getAiStatus() {
  return apiFetch<{ enabled: boolean }>("/api/ai/status");
}

export function runAiTextTool(tool: string, payload: Record<string, string>) {
  return apiFetch<{ result: string }>(`/api/ai/${tool}`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

/** AI tools that take a file (image/pdf). Uses multipart so we can't reuse apiFetch's JSON body. */
export async function runAiFileTool(tool: string, file: File, fields?: Record<string, string>): Promise<{ result: string }> {
  const form = new FormData();
  form.append("file", file);
  for (const [k, v] of Object.entries(fields ?? {})) form.append(k, v);

  const path = `/api/ai/${tool}`;
  // A fresh token per attempt — reCAPTCHA tokens are single-use.
  const doFetch = async () =>
    fetch(`${apiBase()}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
        ...(await recaptchaHeader(path, "POST")),
      },
      body: form,
    });

  let res = await doFetch();
  if (res.status === 401 && (await tryRefresh())) res = await doFetch();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as { result: string };
}

export function getGeo() {
  return apiFetch<{ country: string | null; currency: "INR" | "USD" }>("/api/geo");
}

export function getMyStats() {
  return apiFetch<DashboardStats>("/api/me/stats", { auth: true });
}

export function getMyActivity(limit = 15) {
  return apiFetch<{ activity: ActivityItem[] }>(`/api/me/activity?limit=${limit}`, { auth: true });
}

export function getMyFavorites() {
  return apiFetch<{ favorites: FavoriteItem[] }>("/api/me/favorites", { auth: true });
}

export function addFavorite(toolSlug: string) {
  return apiFetch("/api/me/favorites", { method: "POST", auth: true, body: JSON.stringify({ toolSlug }) });
}

export function removeFavorite(toolSlug: string) {
  return apiFetch(`/api/me/favorites/${encodeURIComponent(toolSlug)}`, { method: "DELETE", auth: true });
}

/**
 * Fire-and-forget usage beacon for browser-side tools. Attributes the run to
 * the signed-in user (bearer) or the guest cookie. Never throws.
 */
export function recordToolUsage(tool: string, durationMs?: number) {
  apiFetch("/api/usage", {
    method: "POST",
    auth: true,
    retry: false,
    body: JSON.stringify({ tool, success: true, ...(durationMs != null ? { durationMs } : {}) }),
  }).catch(() => undefined);
}

export async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      setSessionHint(false); // expired/none — stop retrying on future loads
      return false;
    }
    const data = (await res.json()) as { accessToken: string };
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}
