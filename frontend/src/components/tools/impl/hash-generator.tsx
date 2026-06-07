"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel } from "@/components/tools/panel";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function hash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [text, setText] = React.useState("");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    let cancelled = false;
    if (!text) {
      setHashes({});
      return;
    }
    Promise.all(ALGOS.map(async (a) => [a, await hash(a, text)] as const)).then((entries) => {
      if (!cancelled) setHashes(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <ToolPanel className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text to hash…"
        className="min-h-32 font-sans"
        aria-label="Text to hash"
      />
      <div className="space-y-2">
        {ALGOS.map((algo) => (
          <div key={algo} className="rounded-lg border border-border bg-background p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold">{algo}</span>
              <CopyButton value={hashes[algo] ?? ""} size="sm" variant="ghost" />
            </div>
            <code className="block break-all font-mono text-xs text-muted-foreground">
              {hashes[algo] || "—"}
            </code>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Hashing runs locally via the Web Crypto API. MD5 is intentionally omitted — it&apos;s
        cryptographically broken; use SHA-256 or stronger.
      </p>
    </ToolPanel>
  );
}
