"use client";

import * as React from "react";
import { AlertCircle, Download, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel } from "@/components/tools/panel";
import { downloadBlob, cn } from "@/lib/utils";

export interface TransformAction {
  label: string;
  /** Transform the current input; throw an Error to surface a message. */
  run: (input: string) => string;
  variant?: "default" | "outline" | "secondary";
}

interface TransformerProps {
  actions: TransformAction[];
  inputPlaceholder?: string;
  inputLabel?: string;
  outputLabel?: string;
  downloadName?: string;
  downloadMime?: string;
  /** Run the first action automatically as the user types. */
  live?: boolean;
  sampleInput?: string;
}

export function Transformer({
  actions,
  inputPlaceholder = "Paste your input here…",
  inputLabel = "Input",
  outputLabel = "Output",
  downloadName = "output.txt",
  downloadMime = "text/plain",
  live = false,
  sampleInput,
}: TransformerProps) {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const runAction = React.useCallback((action: TransformAction, value: string) => {
    try {
      setOutput(action.run(value));
      setError(null);
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, []);

  React.useEffect(() => {
    if (live && actions[0]) {
      if (!input) {
        setOutput("");
        setError(null);
        return;
      }
      runAction(actions[0], input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, live]);

  function reset() {
    setInput("");
    setOutput("");
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{inputLabel}</span>
            <div className="flex gap-2">
              {sampleInput && (
                <Button variant="ghost" size="sm" onClick={() => setInput(sampleInput)}>
                  Sample
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={reset} disabled={!input && !output}>
                <RotateCcw /> Reset
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="min-h-64"
            aria-label={inputLabel}
          />
        </ToolPanel>

        <ToolPanel className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{outputLabel}</span>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <Button
                variant="outline"
                size="sm"
                disabled={!output}
                onClick={() => downloadBlob(output, downloadName, downloadMime)}
              >
                <Download /> Download
              </Button>
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Result appears here…"
            className={cn("min-h-64", error && "border-destructive")}
            aria-label={outputLabel}
          />
          {error && (
            <p className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" /> {error}
            </p>
          )}
        </ToolPanel>
      </div>

      {!live && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? "default"}
              onClick={() => runAction(action, input)}
              disabled={!input}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
