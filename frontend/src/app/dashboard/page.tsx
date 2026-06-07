"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, FileClock, Star, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/tools/panel";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

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
          <p className="mt-1 text-muted-foreground">{user.email} · {user.planTier} plan</p>
        </div>
        <Button variant="outline" onClick={() => logout().then(() => router.push("/"))}>
          <LogOut /> Sign out
        </Button>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Files processed" value="0" />
        <Stat label="Favorites" value="0" />
        <Stat label="This month" value="0" />
        <Stat label="Storage used" value="0 MB" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashCard icon={FileClock} title="Recent activity">
          <EmptyState text="No activity yet. Run a tool and your history will appear here." cta="Browse tools" href="/tools" />
        </DashCard>
        <DashCard icon={Star} title="Favorites">
          <EmptyState text="Star a tool to pin it here for quick access." cta="Explore tools" href="/tools" />
        </DashCard>
        <DashCard icon={BarChart3} title="Usage statistics">
          <p className="text-sm text-muted-foreground">
            Your conversion stats and trends will show here as you use ConvertFlow.
          </p>
        </DashCard>
        <DashCard icon={Settings} title="Account & security">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Two-factor auth</span><span className="text-muted-foreground">{user.mfaEnabled ? "Enabled" : "Not set up"}</span></li>
            <li className="flex justify-between"><span>Plan</span><span className="text-muted-foreground">{user.planTier}</span></li>
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
