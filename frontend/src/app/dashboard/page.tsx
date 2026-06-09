"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, FileClock, Star, BarChart3, Settings, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/tools/panel";
import {
  getMyStats, getMyActivity, getMyFavorites,
  type DashboardStats, type ActivityItem, type FavoriteItem,
} from "@/lib/api";
import { getTool } from "@/lib/tools/registry";

function formatBytes(bytes: number): string {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

function toolLabel(slug: string): string {
  return getTool(slug)?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activity, setActivity] = React.useState<ActivityItem[] | null>(null);
  const [favorites, setFavorites] = React.useState<FavoriteItem[] | null>(null);

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  React.useEffect(() => {
    if (!user) return;
    let active = true;
    getMyStats().then((s) => active && setStats(s)).catch(() => active && setStats({ filesProcessed: 0, thisMonth: 0, favorites: 0, storageBytes: 0 }));
    getMyActivity().then((r) => active && setActivity(r.activity)).catch(() => active && setActivity([]));
    getMyFavorites().then((r) => active && setFavorites(r.favorites)).catch(() => active && setFavorites([]));
    return () => { active = false; };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => logout().then(() => router.push("/"))}>
          <LogOut /> Sign out
        </Button>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Files processed" value={stats ? stats.filesProcessed.toLocaleString() : "—"} />
        <Stat label="Favorites" value={stats ? stats.favorites.toLocaleString() : "—"} />
        <Stat label="This month" value={stats ? stats.thisMonth.toLocaleString() : "—"} />
        <Stat label="Storage used" value={stats ? formatBytes(stats.storageBytes) : "—"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashCard icon={FileClock} title="Recent activity">
          {activity === null ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : activity.length === 0 ? (
            <EmptyState text="No activity yet. Run a tool and your history will appear here." cta="Browse tools" href="/tools" />
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    {a.success ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <XCircle className="size-4 text-destructive" />
                    )}
                    <span className="font-medium">{toolLabel(a.tool)}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </DashCard>

        <DashCard icon={Star} title="Favorites">
          {favorites === null ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : favorites.length === 0 ? (
            <EmptyState text="Star a tool to pin it here for quick access." cta="Explore tools" href="/tools" />
          ) : (
            <ul className="flex flex-wrap gap-2">
              {favorites.map((f) => {
                const tool = getTool(f.toolSlug);
                const href = tool ? `/tools/${tool.category}/${tool.slug}` : "/tools";
                return (
                  <li key={f.toolSlug}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      <Star className="size-3.5 fill-primary text-primary" /> {toolLabel(f.toolSlug)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </DashCard>

        <DashCard icon={BarChart3} title="Usage statistics">
          {stats ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total tools run</span><span className="font-medium tabular-nums">{stats.filesProcessed.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">This month</span><span className="font-medium tabular-nums">{stats.thisMonth.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Saved files storage</span><span className="font-medium tabular-nums">{formatBytes(stats.storageBytes)}</span></div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading your stats…</p>
          )}
        </DashCard>

        <DashCard icon={Settings} title="Account & security">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Two-factor auth</span><span className="text-muted-foreground">{user.mfaEnabled ? "Enabled" : "Not set up"}</span></li>
            <li className="flex justify-between"><span>Role</span><span className="text-muted-foreground">{user.role}</span></li>
          </ul>
        </DashCard>
      </div>
    </div>
  );
}

function DashCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function EmptyState({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Button asChild variant="outline" size="sm">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
