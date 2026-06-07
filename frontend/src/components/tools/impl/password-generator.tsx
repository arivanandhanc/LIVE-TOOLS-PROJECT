"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { cn } from "@/lib/utils";

const SETS = {
  lower: "abcdefghijkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

type SetKey = keyof typeof SETS;

function randomFrom(chars: string, n: number): string {
  const out: string[] = [];
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  for (let i = 0; i < n; i++) out.push(chars[arr[i] % chars.length]);
  return out.join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = React.useState(16);
  const [enabled, setEnabled] = React.useState<Record<SetKey, boolean>>({
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [password, setPassword] = React.useState("");

  const generate = React.useCallback(() => {
    const pool = (Object.keys(SETS) as SetKey[])
      .filter((k) => enabled[k])
      .map((k) => SETS[k])
      .join("");
    if (!pool) {
      setPassword("");
      return;
    }
    setPassword(randomFrom(pool, length));
  }, [length, enabled]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const strength = Math.min(100, Math.round((length / 24) * 60 + Object.values(enabled).filter(Boolean).length * 10));

  return (
    <ToolPanel className="space-y-5">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
        <code className="flex-1 break-all font-mono text-lg">{password || "—"}</code>
        <CopyButton value={password} />
        <Button variant="outline" size="icon" onClick={generate} aria-label="Regenerate">
          <RefreshCw />
        </Button>
      </div>

      <div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-all",
              strength < 50 ? "bg-destructive" : strength < 80 ? "bg-warning" : "bg-success"
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Strength: {strength < 50 ? "Weak" : strength < 80 ? "Good" : "Strong"}
        </p>
      </div>

      <Field label={`Length: ${length}`}>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
      </Field>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(SETS) as SetKey[]).map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm capitalize"
          >
            <input
              type="checkbox"
              checked={enabled[key]}
              onChange={(e) => setEnabled((s) => ({ ...s, [key]: e.target.checked }))}
              className="accent-[var(--color-primary)]"
            />
            {key}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Generated locally with <code>crypto.getRandomValues</code>. Ambiguous characters are
        excluded for readability.
      </p>
    </ToolPanel>
  );
}
