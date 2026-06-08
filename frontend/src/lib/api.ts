import { siteConfig } from "./site";

/**
 * Thin API client with in-memory access token + automatic refresh.
 * Access token lives in memory only (XSS-safe); the refresh token is an
 * httpOnly cookie set by the backend.
 */

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  retry?: boolean;
}

export async function apiFetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { auth = false, retry = true, headers, ...rest } = opts;
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

  const doFetch = () =>
    fetch(`${siteConfig.apiUrl}/api/ai/${tool}`, {
      method: "POST",
      credentials: "include",
      headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
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
    const res = await fetch(`${siteConfig.apiUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { accessToken: string };
    accessToken = data.accessToken;
    return true;
  } catch {
    return false;
  }
}
