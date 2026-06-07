"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download, Search, Users, FileStack, Activity, Shield } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { apiFetch, getAccessToken } from "@/lib/api";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/tools/panel";
import { Badge } from "@/components/ui/badge";
import { downloadBlob } from "@/lib/utils";

interface Stats {
  totalUsers: number; activeUsers: number; totalFiles: number; totalJobs: number; usageLast30: number; consentCount: number; revenue: number;
}
interface ToolStat { tool: string; uses: number; failures: number; avgDurationMs: number }
interface AdminUser { id: string; email: string; name: string | null; role: string; status: string; planTier: string }

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [tools, setTools] = React.useState<ToolStat[]>([]);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loadingData, setLoadingData] = React.useState(true);

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) router.replace("/login");
  }, [loading, user, router]);

  const loadUsers = React.useCallback(async (q: string) => {
    const data = await apiFetch<{ users: AdminUser[] }>(`/api/admin/users?q=${encodeURIComponent(q)}`, { auth: true });
    setUsers(data.users);
  }, []);

  React.useEffect(() => {
    if (loading || !user || user.role !== "ADMIN") return;
    (async () => {
      try {
        const [s, t] = await Promise.all([
          apiFetch<Stats>("/api/admin/stats", { auth: true }),
          apiFetch<{ tools: ToolStat[] }>("/api/admin/tools", { auth: true }),
        ]);
        setStats(s);
        setTools(t.tools);
        await loadUsers("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin data.");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [loading, user, loadUsers]);

  async function setStatus(id: string, status: string) {
    await apiFetch(`/api/admin/users/${id}`, { method: "PATCH", auth: true, body: JSON.stringify({ status }) });
    await loadUsers(query);
  }

  async function exportConsent() {
    const res = await fetch(`${siteConfig.apiUrl}/api/admin/consent/export?format=csv`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
      credentials: "include",
    });
    if (!res.ok) return setError("Export failed.");
    downloadBlob(await res.blob(), "consent-records.csv", "text/csv");
  }

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Shield className="size-7 text-primary" /> Admin
          </h1>
          <p className="mt-1 text-muted-foreground">Platform analytics, users and compliance.</p>
        </div>
        <Button variant="outline" onClick={exportConsent}>
          <Download /> Export consent (CSV)
        </Button>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}{" "}
          {error.includes("database") && "Admin features need DATABASE_URL + an ADMIN-role account."}
        </div>
      )}

      {loadingData ? (
        <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {stats && (
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Total users" value={stats.totalUsers} />
              <Stat label="Active users" value={stats.activeUsers} />
              <Stat label="Files" value={stats.totalFiles} />
              <Stat label="Jobs" value={stats.totalJobs} />
              <Stat label="Uses (30d)" value={stats.usageLast30} />
              <Stat label="Consents" value={stats.consentCount} />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary" /> Tool analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {tools.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No usage recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Tool</th><th className="pb-2">Uses</th><th className="pb-2">Fails</th><th className="pb-2">Avg ms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tools.map((t) => (
                          <tr key={t.tool} className="border-t border-border">
                            <td className="py-2 font-medium">{t.tool}</td>
                            <td className="py-2">{t.uses}</td>
                            <td className="py-2">{t.failures}</td>
                            <td className="py-2">{t.avgDurationMs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-primary" /> Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); loadUsers(e.target.value); }}
                    placeholder="Search users…"
                    className="pl-9"
                  />
                </div>
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found.</p>
                  ) : (
                    users.map((u) => (
                      <div key={u.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{u.name ?? u.email}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <Badge variant={u.status === "ACTIVE" ? "success" : "muted"}>{u.status}</Badge>
                        {u.status === "ACTIVE" ? (
                          <Button size="sm" variant="outline" onClick={() => setStatus(u.id, "SUSPENDED")}>Suspend</Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setStatus(u.id, "ACTIVE")}>Activate</Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <FileStack className="size-4" /> Revenue: ${stats?.revenue ?? 0} — payments are disabled (Stripe-ready).
          </p>
        </>
      )}
    </div>
  );
}
