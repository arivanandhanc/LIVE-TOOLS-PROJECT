"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";
import { AlertCircle } from "lucide-react";

const FLAGS = ["g", "i", "m", "s", "u"] as const;

export default function RegexTester() {
  const [pattern, setPattern] = React.useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = React.useState<string[]>(["g"]);
  const [text, setText] = React.useState("Contact ada@example.com or linus@kernel.org for details.");

  const { error, matches } = React.useMemo(() => {
    if (!pattern) return { error: null, matches: [] as RegExpMatchArray[] };
    try {
      const re = new RegExp(pattern, flags.join(""));
      const found = flags.includes("g")
        ? [...text.matchAll(re)]
        : (() => { const m = text.match(re); return m ? [m] : []; })();
      return { error: null, matches: found };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Invalid pattern", matches: [] };
    }
  }, [pattern, flags, text]);

  function toggleFlag(f: string) {
    setFlags((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  // Build highlighted output.
  const highlighted = React.useMemo(() => {
    if (error || matches.length === 0) return null;
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const m of matches) {
      const start = m.index ?? 0;
      if (start < last) continue;
      parts.push(text.slice(last, start));
      parts.push(<mark key={start} className="rounded bg-primary/30 px-0.5">{m[0]}</mark>);
      last = start + m[0].length;
    }
    parts.push(text.slice(last));
    return parts;
  }, [matches, text, error]);

  return (
    <div className="space-y-4">
      <ToolPanel className="space-y-4">
        <Field label="Regular expression">
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\\d+" className="font-mono" />
        </Field>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFlag(f)}
              className={`rounded-md border px-3 py-1 font-mono text-sm transition-colors ${
                flags.includes(f) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
              }`}
              title={{ g: "global", i: "ignore case", m: "multiline", s: "dotall", u: "unicode" }[f]}
            >
              {f}
            </button>
          ))}
        </div>
        {error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {error}
          </p>
        )}
      </ToolPanel>

      <ToolPanel className="flex flex-col gap-3">
        <span className="text-sm font-medium">Test string</span>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-40" />
      </ToolPanel>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Matches" value={matches.length} />
        <Stat label="Groups (first match)" value={matches[0] ? Math.max(0, matches[0].length - 1) : 0} />
      </div>

      {highlighted && (
        <ToolPanel className="space-y-2">
          <span className="text-sm font-medium">Highlighted</span>
          <p className="whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 text-sm">{highlighted}</p>
        </ToolPanel>
      )}
    </div>
  );
}
