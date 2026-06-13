"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Download, Search, Users, FileStack, Activity, Shield, Globe,
  ScrollText, ToggleLeft, HeartPulse, Trash2, X, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { apiFetch, getAccessToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/tools/panel";
import { Badge } from "@/components/ui/badge";
import { downloadBlob, formatBytes, cn } from "@/lib/utils";

// ───────────────────────────── types ─────────────────────────────
interface Stats {
  totalUsers: number; activeUsers: number; suspendedUsers: number; adminUsers: number;
  newUsers7d: number; totalFiles: number; totalJobs: number; usageLast30: number;
  usageLast24h: number; consentCount: number; analyticsOptIn: number; marketingOptIn: number;
  storageBytes: number; jobStatus: Record<string, number>; revenue: number;
}
interface ToolStat { tool: string; uses: number; failures: number; avgDurationMs: number }
interface AdminUser { id: string; email: string; name: string | null; role: string; status: string; planTier: string; createdAt: string }
interface UsagePoint { date: string; uses: number; failures: number }
interface Region { country: string; count: number }
interface UserDetail {
  user: AdminUser & { mfaEnabled: boolean; emailVerified: string | null; updatedAt: string };
  fileCount: number; jobCount: number; usageCount: number; activeSessions: number;
  recentJobs: { id: string; tool: string; status: string; durationMs: number | null; createdAt: string }[];
}
interface FileRow { id: string; originalName: string; mimeType: string; size: number; ownerType: string; userId: string | null; createdAt: string; expiresAt: string }
interface JobRow { id: string; tool: string; status: string; userId: string | null; guestId: string | null; error: string | null; durationMs: number | null; createdAt: string }
interface ConsentRow { id: string; createdAt: string; ip: string | null; country: string | null; browser: string | null; necessary: boolean; analytics: boolean; marketing: boolean; consentVersion: string; userId: string | null }
interface AuditRow { id: string; action: string; actorEmail: string | null; targetId: string | null; ip: string | null; metadata: unknown; createdAt: string }
interface ServiceFlag { key: string; label: string; enabled: boolean }
interface Health {
  checks: Record<string, { ok: boolean; detail: string }>;
  uptimeSeconds: number; memoryMb: number; nodeEnv: string; timestamp: string;
}

type Tab = "overview" | "users" | "consents" | "activity" | "audit" | "services" | "system";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "users", label: "Users", icon: Users },
  { id: "consents", label: "Consents", icon: Globe },
  { id: "activity", label: "Files & Jobs", icon: FileStack },
  { id: "audit", label: "Audit log", icon: ScrollText },
  { id: "services", label: "Services", icon: ToggleLeft },
  { id: "system", label: "System", icon: HeartPulse },
];

const fmtDate = (s: string) => new Date(s).toLocaleString();
const fmtDay = (s: string) => new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });

// ───────────────────────────── page ─────────────────────────────
export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("overview");
  const [error, setError] = React.useState<string | null>(null);

  // Only bounce to /login when there is genuinely NO session. An authenticated
  // non-admin is shown an inline message instead of being thrown to the login
  // page (which looks like a bug). Send a return path so re-login lands here.
  React.useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/admin");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <Shield className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          You&apos;re signed in as <span className="font-medium">{user.email}</span>, but this account
          doesn&apos;t have the ADMIN role. Ask an administrator to grant access.
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Go to dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Shield className="size-7 text-primary" /> Admin control center
        </h1>
        <p className="mt-1 text-muted-foreground">Analytics, users, consents, services and system health.</p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(null); }}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error} {error.includes("database") && "Admin features need DATABASE_URL + an ADMIN account."}
        </div>
      )}

      {tab === "overview" && <OverviewTab onError={setError} />}
      {tab === "users" && <UsersTab onError={setError} />}
      {tab === "consents" && <ConsentsTab onError={setError} />}
      {tab === "activity" && <ActivityTab onError={setError} />}
      {tab === "audit" && <AuditTab onError={setError} />}
      {tab === "services" && <ServicesTab onError={setError} />}
      {tab === "system" && <SystemTab onError={setError} />}
    </div>
  );
}

type ErrFn = (m: string) => void;

function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList, onError: ErrFn) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const reload = React.useCallback(() => {
    setLoading(true);
    fn().then(setData).catch((e) => onError(e instanceof Error ? e.message : "Failed to load.")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  React.useEffect(() => { reload(); }, [reload]);
  return { data, loading, reload, setData };
}

function Spinner() {
  return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;
}

// ───────────────────────────── overview ─────────────────────────────
function BarChart({ data }: { data: UsagePoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.uses));
  return (
    <div className="flex h-40 items-end gap-0.5">
      {data.map((d) => (
        <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end" title={`${d.date}: ${d.uses} uses, ${d.failures} fails`}>
          <div className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary" style={{ height: `${(d.uses / max) * 100}%` }} />
          {d.failures > 0 && <div className="absolute bottom-0 w-full rounded-t bg-destructive/70" style={{ height: `${(d.failures / max) * 100}%` }} />}
        </div>
      ))}
    </div>
  );
}

function OverviewTab({ onError }: { onError: ErrFn }) {
  const stats = useAsync(() => apiFetch<Stats>("/api/admin/stats", { auth: true }), [], onError);
  const series = useAsync(() => apiFetch<{ series: UsagePoint[] }>("/api/admin/usage/series?days=30", { auth: true }), [], onError);
  const regions = useAsync(() => apiFetch<{ regions: Region[] }>("/api/admin/usage/regions", { auth: true }), [], onError);
  const tools = useAsync(() => apiFetch<{ tools: ToolStat[] }>("/api/admin/tools", { auth: true }), [], onError);

  if (stats.loading) return <Spinner />;
  const s = stats.data;
  return (
    <div className="space-y-6">
      {s && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Total users" value={s.totalUsers} />
          <Stat label="Active" value={s.activeUsers} />
          <Stat label="New (7d)" value={s.newUsers7d} />
          <Stat label="Admins" value={s.adminUsers} />
          <Stat label="Uses (24h)" value={s.usageLast24h} />
          <Stat label="Uses (30d)" value={s.usageLast30} />
          <Stat label="Files" value={s.totalFiles} />
          <Stat label="Storage" value={formatBytes(s.storageBytes)} />
          <Stat label="Jobs" value={s.totalJobs} />
          <Stat label="Failed jobs" value={s.jobStatus.FAILED ?? 0} />
          <Stat label="Consents" value={s.consentCount} />
          <Stat label="Analytics opt-in" value={s.analyticsOptIn} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary" /> Tool usage — last 30 days</CardTitle></CardHeader>
          <CardContent>
            {series.loading ? <Spinner /> : series.data && series.data.series.length > 0 ? (
              <>
                <BarChart data={series.data.series} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{fmtDay(series.data.series[0].date)}</span>
                  <span className="flex gap-3"><span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-primary/80" /> uses</span><span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-destructive/70" /> fails</span></span>
                  <span>{fmtDay(series.data.series[series.data.series.length - 1].date)}</span>
                </div>
              </>
            ) : <p className="text-sm text-muted-foreground">No usage recorded yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="size-4 text-primary" /> Top regions</CardTitle></CardHeader>
          <CardContent>
            {regions.loading ? <Spinner /> : regions.data && regions.data.regions.length > 0 ? (
              <div className="space-y-2">
                {regions.data.regions.slice(0, 8).map((r) => (
                  <div key={r.country} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{r.country}</span>
                    <Badge variant="muted">{r.count}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No region data yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary" /> Tool analytics</CardTitle></CardHeader>
        <CardContent>
          {tools.loading ? <Spinner /> : tools.data && tools.data.tools.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Tool</th><th className="pb-2">Uses</th><th className="pb-2">Fails</th><th className="pb-2">Avg ms</th></tr></thead>
                <tbody>
                  {tools.data.tools.map((t) => (
                    <tr key={t.tool} className="border-t border-border">
                      <td className="py-2 font-medium">{t.tool}</td><td className="py-2">{t.uses}</td>
                      <td className="py-2">{t.failures > 0 ? <span className="text-destructive">{t.failures}</span> : 0}</td>
                      <td className="py-2">{t.avgDurationMs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-muted-foreground">No usage recorded yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ───────────────────────────── users ─────────────────────────────
const PLANS = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"];

function UsersTab({ onError }: { onError: ErrFn }) {
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<string | null>(null);

  const load = React.useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await apiFetch<{ users: AdminUser[] }>(`/api/admin/users?q=${encodeURIComponent(q)}`, { auth: true });
      setUsers(data.users);
    } catch (e) { onError(e instanceof Error ? e.message : "Failed to load users."); }
    finally { setLoading(false); }
  }, [onError]);

  React.useEffect(() => { load(""); }, [load]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-primary" /> Users</CardTitle></CardHeader>
        <CardContent>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => { setQuery(e.target.value); load(e.target.value); }} placeholder="Search users…" className="pl-9" />
          </div>
          {loading ? <Spinner /> : (
            <div className="max-h-[28rem] space-y-2 overflow-y-auto">
              {users.length === 0 ? <p className="text-sm text-muted-foreground">No users found.</p> : users.map((u) => (
                <button key={u.id} onClick={() => setSelected(u.id)} className={cn("flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors hover:bg-muted/50", selected === u.id ? "border-primary" : "border-border")}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{u.name ?? u.email}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  {u.role === "ADMIN" && <Badge variant="default">admin</Badge>}
                  <Badge variant="muted">{u.planTier}</Badge>
                  <Badge variant={u.status === "ACTIVE" ? "success" : "muted"}>{u.status}</Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailPanel id={selected} onError={onError} onChanged={() => load(query)} onClose={() => setSelected(null)} />
    </div>
  );
}

function UserDetailPanel({ id, onError, onChanged, onClose }: { id: string | null; onError: ErrFn; onChanged: () => void; onClose: () => void }) {
  const [detail, setDetail] = React.useState<UserDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!id) { setDetail(null); return; }
    setLoading(true);
    try { setDetail(await apiFetch<UserDetail>(`/api/admin/users/${id}`, { auth: true })); }
    catch (e) { onError(e instanceof Error ? e.message : "Failed to load user."); }
    finally { setLoading(false); }
  }, [id, onError]);
  React.useEffect(() => { load(); }, [load]);

  async function patch(body: Record<string, string>) {
    if (!id) return;
    setBusy(true);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "PATCH", auth: true, body: JSON.stringify(body) });
      await load(); onChanged();
    } catch (e) { onError(e instanceof Error ? e.message : "Update failed."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!id || !confirm("Permanently delete this user and all their data? This cannot be undone.")) return;
    setBusy(true);
    try { await apiFetch(`/api/admin/users/${id}`, { method: "DELETE", auth: true }); onChanged(); onClose(); }
    catch (e) { onError(e instanceof Error ? e.message : "Delete failed."); }
    finally { setBusy(false); }
  }

  if (!id) return <Card><CardContent className="flex h-full min-h-[20rem] items-center justify-center text-sm text-muted-foreground">Select a user to manage their account.</CardContent></Card>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">User details</CardTitle>
        <Button size="sm" variant="ghost" onClick={onClose}><X className="size-4" /></Button>
      </CardHeader>
      <CardContent>
        {loading || !detail ? <Spinner /> : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{detail.user.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{detail.user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">Joined {fmtDate(detail.user.createdAt)} · {detail.user.emailVerified ? "verified" : "unverified"} · MFA {detail.user.mfaEnabled ? "on" : "off"}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Files" value={detail.fileCount} />
              <Stat label="Jobs" value={detail.jobCount} />
              <Stat label="Uses" value={detail.usageCount} />
              <Stat label="Sessions" value={detail.activeSessions} />
            </div>

            <div className="space-y-3 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Status</span>
                <div className="flex gap-2">
                  {detail.user.status === "ACTIVE"
                    ? <Button size="sm" variant="outline" disabled={busy} onClick={() => patch({ status: "SUSPENDED" })}>Suspend</Button>
                    : <Button size="sm" variant="outline" disabled={busy} onClick={() => patch({ status: "ACTIVE" })}>Activate</Button>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Role</span>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => patch({ role: detail.user.role === "ADMIN" ? "USER" : "ADMIN" })}>
                  {detail.user.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Plan</span>
                <select
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                  value={detail.user.planTier} disabled={busy}
                  onChange={(e) => patch({ planTier: e.target.value })}
                >
                  {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Button size="sm" variant="destructive" className="w-full" disabled={busy} onClick={remove}>
                <Trash2 className="size-4" /> Delete user permanently
              </Button>
            </div>

            {detail.recentJobs.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">Recent jobs</p>
                <div className="space-y-1 text-xs">
                  {detail.recentJobs.map((j) => (
                    <div key={j.id} className="flex items-center justify-between gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground">{j.tool}</span>
                      <Badge variant={j.status === "COMPLETED" ? "success" : j.status === "FAILED" ? "muted" : "muted"}>{j.status}</Badge>
                      <span>{fmtDate(j.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ───────────────────────────── consents ─────────────────────────────
function ConsentsTab({ onError }: { onError: ErrFn }) {
  const [page, setPage] = React.useState(0);
  const [country, setCountry] = React.useState("");
  const list = useAsync(() => apiFetch<{ items: ConsentRow[]; total: number; take: number }>(`/api/admin/consent?page=${page}${country ? `&country=${encodeURIComponent(country)}` : ""}`, { auth: true }), [page, country], onError);

  async function exportConsent(format: "xlsx" | "csv") {
    const res = await fetch(`/api/admin/consent/export${format === "csv" ? "?format=csv" : ""}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` }, credentials: "include",
    });
    if (!res.ok) return onError("Export failed.");
    downloadBlob(await res.blob(), `consent-records.${format}`, format === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  }

  async function delConsent(id: string) {
    if (!confirm("Delete this consent record? (GDPR right-to-erasure)")) return;
    try { await apiFetch(`/api/admin/consent/${id}`, { method: "DELETE", auth: true }); list.reload(); }
    catch (e) { onError(e instanceof Error ? e.message : "Delete failed."); }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base"><Globe className="size-4 text-primary" /> Consent records {list.data && <span className="text-sm font-normal text-muted-foreground">({list.data.total})</span>}</CardTitle>
        <div className="flex gap-2">
          <Input value={country} onChange={(e) => { setCountry(e.target.value); setPage(0); }} placeholder="Filter country (e.g. IN)" className="h-9 w-44" />
          <Button size="sm" variant="outline" onClick={() => exportConsent("xlsx")}><Download className="size-4" /> Excel</Button>
          <Button size="sm" variant="outline" onClick={() => exportConsent("csv")}>CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        {list.loading ? <Spinner /> : list.data && list.data.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground">
                  <th className="pb-2">Date</th><th className="pb-2">IP</th><th className="pb-2">Country</th><th className="pb-2">Browser</th>
                  <th className="pb-2">Analytics</th><th className="pb-2">Marketing</th><th className="pb-2">Ver</th><th className="pb-2">User</th><th className="pb-2"></th>
                </tr></thead>
                <tbody>
                  {list.data.items.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="py-2 whitespace-nowrap">{fmtDate(c.createdAt)}</td>
                      <td className="py-2 font-mono text-xs">{c.ip ?? "—"}</td>
                      <td className="py-2">{c.country ?? "—"}</td>
                      <td className="py-2">{c.browser ?? "—"}</td>
                      <td className="py-2">{c.analytics ? <Badge variant="success">yes</Badge> : <Badge variant="muted">no</Badge>}</td>
                      <td className="py-2">{c.marketing ? <Badge variant="success">yes</Badge> : <Badge variant="muted">no</Badge>}</td>
                      <td className="py-2">{c.consentVersion}</td>
                      <td className="py-2 max-w-[8rem] truncate text-xs text-muted-foreground">{c.userId ?? "guest"}</td>
                      <td className="py-2"><Button size="sm" variant="ghost" onClick={() => delConsent(c.id)}><Trash2 className="size-4 text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} take={list.data.take} total={list.data.total} onPage={setPage} />
          </>
        ) : <p className="text-sm text-muted-foreground">No consent records found.</p>}
      </CardContent>
    </Card>
  );
}

// ───────────────────────────── files & jobs ─────────────────────────────
function ActivityTab({ onError }: { onError: ErrFn }) {
  const [filePage, setFilePage] = React.useState(0);
  const [jobPage, setJobPage] = React.useState(0);
  const [jobStatus, setJobStatus] = React.useState("");
  const files = useAsync(() => apiFetch<{ items: FileRow[]; total: number; take: number }>(`/api/admin/files?page=${filePage}`, { auth: true }), [filePage], onError);
  const jobs = useAsync(() => apiFetch<{ items: JobRow[]; total: number; take: number }>(`/api/admin/jobs?page=${jobPage}${jobStatus ? `&status=${jobStatus}` : ""}`, { auth: true }), [jobPage, jobStatus], onError);

  async function delFile(id: string) {
    if (!confirm("Delete this file from storage and database?")) return;
    try { await apiFetch(`/api/admin/files/${id}`, { method: "DELETE", auth: true }); files.reload(); }
    catch (e) { onError(e instanceof Error ? e.message : "Delete failed."); }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileStack className="size-4 text-primary" /> Files {files.data && <span className="text-sm font-normal text-muted-foreground">({files.data.total})</span>}</CardTitle></CardHeader>
        <CardContent>
          {files.loading ? <Spinner /> : files.data && files.data.items.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Name</th><th className="pb-2">Type</th><th className="pb-2">Size</th><th className="pb-2">Owner</th><th className="pb-2">Created</th><th className="pb-2"></th></tr></thead>
                  <tbody>
                    {files.data.items.map((f) => (
                      <tr key={f.id} className="border-t border-border">
                        <td className="py-2 max-w-[14rem] truncate font-medium">{f.originalName}</td>
                        <td className="py-2 text-xs">{f.mimeType}</td>
                        <td className="py-2">{formatBytes(f.size)}</td>
                        <td className="py-2"><Badge variant="muted">{f.ownerType}</Badge></td>
                        <td className="py-2 whitespace-nowrap text-xs">{fmtDate(f.createdAt)}</td>
                        <td className="py-2"><Button size="sm" variant="ghost" onClick={() => delFile(f.id)}><Trash2 className="size-4 text-destructive" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={filePage} take={files.data.take} total={files.data.total} onPage={setFilePage} />
            </>
          ) : <p className="text-sm text-muted-foreground">No files.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary" /> Jobs {jobs.data && <span className="text-sm font-normal text-muted-foreground">({jobs.data.total})</span>}</CardTitle>
          <select className="rounded-md border border-border bg-background px-2 py-1 text-sm" value={jobStatus} onChange={(e) => { setJobStatus(e.target.value); setJobPage(0); }}>
            <option value="">All statuses</option><option value="QUEUED">Queued</option><option value="PROCESSING">Processing</option><option value="COMPLETED">Completed</option><option value="FAILED">Failed</option>
          </select>
        </CardHeader>
        <CardContent>
          {jobs.loading ? <Spinner /> : jobs.data && jobs.data.items.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Tool</th><th className="pb-2">Status</th><th className="pb-2">Duration</th><th className="pb-2">Error</th><th className="pb-2">Created</th></tr></thead>
                  <tbody>
                    {jobs.data.items.map((j) => (
                      <tr key={j.id} className="border-t border-border">
                        <td className="py-2 font-medium">{j.tool}</td>
                        <td className="py-2"><Badge variant={j.status === "COMPLETED" ? "success" : j.status === "FAILED" ? "muted" : "muted"}>{j.status}</Badge></td>
                        <td className="py-2">{j.durationMs != null ? `${j.durationMs} ms` : "—"}</td>
                        <td className="py-2 max-w-[12rem] truncate text-xs text-destructive">{j.error ?? ""}</td>
                        <td className="py-2 whitespace-nowrap text-xs">{fmtDate(j.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={jobPage} take={jobs.data.take} total={jobs.data.total} onPage={setJobPage} />
            </>
          ) : <p className="text-sm text-muted-foreground">No jobs.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// ───────────────────────────── audit ─────────────────────────────
function AuditTab({ onError }: { onError: ErrFn }) {
  const [page, setPage] = React.useState(0);
  const list = useAsync(() => apiFetch<{ items: AuditRow[]; total: number; take: number }>(`/api/admin/audit?page=${page}`, { auth: true }), [page], onError);
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ScrollText className="size-4 text-primary" /> Audit log {list.data && <span className="text-sm font-normal text-muted-foreground">({list.data.total})</span>}</CardTitle></CardHeader>
      <CardContent>
        {list.loading ? <Spinner /> : list.data && list.data.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Action</th><th className="pb-2">Actor</th><th className="pb-2">Target</th><th className="pb-2">IP</th><th className="pb-2">When</th></tr></thead>
                <tbody>
                  {list.data.items.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="py-2 font-medium">{a.action}</td>
                      <td className="py-2 text-xs">{a.actorEmail ?? "—"}</td>
                      <td className="py-2 max-w-[10rem] truncate text-xs text-muted-foreground">{a.targetId ?? "—"}</td>
                      <td className="py-2 text-xs">{a.ip ?? "—"}</td>
                      <td className="py-2 whitespace-nowrap text-xs">{fmtDate(a.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} take={list.data.take} total={list.data.total} onPage={setPage} />
          </>
        ) : <p className="text-sm text-muted-foreground">No audit entries yet. Admin actions (role/plan/status changes, deletes, service toggles) are recorded here.</p>}
      </CardContent>
    </Card>
  );
}

// ───────────────────────────── services ─────────────────────────────
function ServicesTab({ onError }: { onError: ErrFn }) {
  const { data, loading, setData } = useAsync(() => apiFetch<{ flags: ServiceFlag[] }>("/api/admin/services", { auth: true }), [], onError);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function toggle(key: string, enabled: boolean) {
    setBusy(key);
    try {
      await apiFetch(`/api/admin/services/${key}`, { method: "PUT", auth: true, body: JSON.stringify({ enabled }) });
      setData((d) => d ? { flags: d.flags.map((f) => f.key === key ? { ...f, enabled } : f) } : d);
    } catch (e) { onError(e instanceof Error ? e.message : "Toggle failed."); }
    finally { setBusy(null); }
  }

  if (loading) return <Spinner />;
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ToggleLeft className="size-4 text-primary" /> Service controls</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Enable or disable platform features in real time. Changes take effect immediately and are recorded in the audit log.</p>
        {data?.flags.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.key}</p>
            </div>
            <button
              role="switch" aria-checked={f.enabled} disabled={busy === f.key}
              onClick={() => toggle(f.key, !f.enabled)}
              className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", f.enabled ? "bg-primary" : "bg-muted")}
            >
              <span className={cn("inline-block size-4 transform rounded-full bg-white transition-transform", f.enabled ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ───────────────────────────── system ─────────────────────────────
function SystemTab({ onError }: { onError: ErrFn }) {
  const { data, loading, reload } = useAsync(() => apiFetch<Health>("/api/admin/health", { auth: true }), [], onError);
  if (loading) return <Spinner />;
  if (!data) return null;
  const uptime = (() => { const s = data.uptimeSeconds; const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return `${h}h ${m}m`; })();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Environment" value={data.nodeEnv} />
        <Stat label="Uptime" value={uptime} />
        <Stat label="Memory (RSS)" value={`${data.memoryMb} MB`} />
        <Stat label="Checked" value={new Date(data.timestamp).toLocaleTimeString()} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base"><HeartPulse className="size-4 text-primary" /> Health checks</CardTitle>
          <Button size="sm" variant="outline" onClick={reload}>Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(data.checks).map(([name, c]) => (
            <div key={name} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <span className={cn("size-2.5 rounded-full", c.ok ? "bg-green-500" : "bg-amber-500")} />
                <span className="font-medium capitalize">{name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{c.detail}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ───────────────────────────── shared ─────────────────────────────
function Pager({ page, take, total, onPage }: { page: number; take: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / take);
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">Page {page + 1} of {pages}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={page === 0} onClick={() => onPage(page - 1)}>Previous</Button>
        <Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
