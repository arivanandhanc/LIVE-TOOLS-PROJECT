"use client";

import * as React from "react";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

type Algo = "bcrypt" | "sha1";

async function sha1Apache(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return `{SHA}${b64}`;
}

export default function HtaccessGenerator() {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [algo, setAlgo] = React.useState<Algo>("bcrypt");
  const [line, setLine] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function generate() {
    if (!user.trim() || !password) return;
    setBusy(true);
    try {
      const hash = algo === "bcrypt" ? bcrypt.hashSync(password, 10) : await sha1Apache(password);
      setLine(`${user.trim()}:${hash}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel className="space-y-4">
        <Field label="Username">
          <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoComplete="off" />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
        </Field>
        <Field label="Algorithm" hint="bcrypt is recommended; SHA-1 ({SHA}) is supported by older Apache.">
          <div className="flex gap-2">
            {(["bcrypt", "sha1"] as Algo[]).map((a) => (
              <Button key={a} type="button" variant={algo === a ? "default" : "outline"} size="sm" onClick={() => setAlgo(a)}>
                {a === "bcrypt" ? "bcrypt" : "SHA-1"}
              </Button>
            ))}
          </div>
        </Field>
        <Button onClick={generate} disabled={busy || !user.trim() || !password} className="w-full">
          Generate .htpasswd line
        </Button>
      </ToolPanel>

      <ToolPanel className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">.htpasswd entry</span>
          <CopyButton value={line} />
        </div>
        <code className="block min-h-24 break-all rounded-lg border border-border bg-background p-3 text-sm">
          {line || "Your generated entry will appear here…"}
        </code>
        <p className="mt-3 text-xs text-muted-foreground">
          Add this line to your <code>.htpasswd</code> file. Everything runs in your browser — the
          password is never sent anywhere.
        </p>
      </ToolPanel>
    </div>
  );
}
