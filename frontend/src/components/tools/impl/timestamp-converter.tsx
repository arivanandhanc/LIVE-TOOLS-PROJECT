"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2">
        <code className="text-sm">{value}</code>
        <CopyButton value={value} />
      </span>
    </div>
  );
}

export default function TimestampConverter() {
  const [value, setValue] = React.useState(() => String(Math.floor(Date.now() / 1000)));
  const [now, setNow] = React.useState(Math.floor(Date.now() / 1000));

  // Accept seconds or milliseconds.
  const num = Number(value.trim());
  let date: Date | null = null;
  if (Number.isFinite(num) && value.trim()) {
    date = new Date(num > 1e12 ? num : num * 1000);
    if (isNaN(date.getTime())) date = null;
  }

  return (
    <div className="space-y-4">
      <ToolPanel className="space-y-4">
        <Field label="Unix timestamp" hint="Seconds or milliseconds since 1970-01-01 UTC.">
          <div className="flex gap-2">
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="1700000000" className="font-mono" />
            <Button variant="outline" onClick={() => { const n = Math.floor(Date.now() / 1000); setNow(n); setValue(String(n)); }}>
              Now
            </Button>
          </div>
        </Field>
        <p className="text-xs text-muted-foreground">Current epoch: <code>{now}</code></p>
      </ToolPanel>

      {date ? (
        <ToolPanel className="grid gap-2">
          <Row label="ISO 8601 (UTC)" value={date.toISOString()} />
          <Row label="UTC" value={date.toUTCString()} />
          <Row label="Local" value={date.toString()} />
          <Row label="Date only" value={date.toISOString().slice(0, 10)} />
        </ToolPanel>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a valid Unix timestamp.</p>
      )}
    </div>
  );
}
