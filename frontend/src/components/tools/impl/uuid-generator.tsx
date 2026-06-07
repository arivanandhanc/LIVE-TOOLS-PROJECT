"use client";

import * as React from "react";
import { RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function UuidGenerator() {
  const [count, setCount] = React.useState(5);
  const [uuids, setUuids] = React.useState<string[]>([]);

  const generate = React.useCallback(() => {
    const n = Math.min(Math.max(count, 1), 1000);
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  }, [count]);

  React.useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = uuids.join("\n");

  return (
    <ToolPanel className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="How many?">
          <Input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-32"
          />
        </Field>
        <Button onClick={generate}>
          <RefreshCw /> Generate
        </Button>
        <div className="ml-auto flex gap-2">
          <CopyButton value={value} label="Copy all" />
          <Button
            variant="outline"
            size="sm"
            disabled={!value}
            onClick={() => downloadBlob(value, "uuids.txt")}
          >
            <Download /> Download
          </Button>
        </div>
      </div>
      <Textarea readOnly value={value} className="min-h-64" aria-label="Generated UUIDs" />
      <p className="text-xs text-muted-foreground">RFC 4122 version 4 UUIDs, generated locally.</p>
    </ToolPanel>
  );
}
