"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Sparkles, AlertCircle, Upload } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { getAiStatus, runAiTextTool, runAiFileTool } from "@/lib/api";

type Kind = "text" | "prompt" | "image" | "pdf";

const CONFIG: Record<string, { kind: Kind; inputLabel: string; placeholder?: string; accept?: string; cta: string }> = {
  "document-summary": { kind: "text", inputLabel: "Text to summarize", placeholder: "Paste a document, article or notes…", cta: "Summarize" },
  "content-generator": { kind: "prompt", inputLabel: "What should I write?", placeholder: "e.g. A 150-word product description for a privacy-first file converter…", cta: "Generate" },
  "image-analysis": { kind: "image", inputLabel: "Image", accept: "image/*", cta: "Analyze image" },
  "ocr-extraction": { kind: "image", inputLabel: "Image with text", accept: "image/*", cta: "Extract text" },
  "pdf-summary": { kind: "pdf", inputLabel: "PDF document", accept: "application/pdf", cta: "Summarize PDF" },
};

export function AiTool({ slug }: { slug: string }) {
  const cfg = CONFIG[slug];
  const { user, loading } = useAuth();
  const [enabled, setEnabled] = React.useState<boolean | null>(null);
  const [text, setText] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    getAiStatus().then((s) => setEnabled(s.enabled)).catch(() => setEnabled(false));
  }, []);

  if (!cfg) return null;

  const isFile = cfg.kind === "image" || cfg.kind === "pdf";

  async function onRun() {
    setBusy(true);
    setError(null);
    setResult("");
    try {
      if (slug === "pdf-summary") {
        if (!file) throw new Error("Please choose a PDF first.");
        const { pdfjsLib } = await import("@/lib/pdfjs");
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += (content.items as { str?: string }[]).map((it) => it.str ?? "").join(" ") + "\n";
        }
        if (!text.trim()) throw new Error("This PDF has no selectable text (it may be scanned). Try the OCR tool.");
        const { result } = await runAiTextTool("pdf-summary", { text: text.slice(0, 100000) });
        setResult(result);
      } else if (isFile) {
        if (!file) throw new Error("Please choose a file first.");
        const fields = cfg.kind === "image" && question.trim() ? { question: question.trim() } : undefined;
        const { result } = await runAiFileTool(slug, file, fields);
        setResult(result);
      } else {
        const key = cfg.kind === "prompt" ? "prompt" : "text";
        if (!text.trim()) throw new Error("Please enter some input first.");
        const { result } = await runAiTextTool(slug, { [key]: text });
        setResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (enabled === false) {
    return (
      <ToolPanel className="text-center">
        <Sparkles className="mx-auto size-6 text-primary" />
        <p className="mt-3 font-medium">AI tools are being switched on</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          This deployment doesn&apos;t have an AI provider configured yet. Check back soon.
        </p>
      </ToolPanel>
    );
  }

  if (!loading && !user) {
    return (
      <ToolPanel className="text-center">
        <Sparkles className="mx-auto size-6 text-primary" />
        <p className="mt-3 font-medium">Sign in to use AI tools</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          AI tools run on our secure backend and are part of your account. Create a free account or sign in to continue.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild><Link href="/login">Sign in</Link></Button>
          <Button asChild variant="outline"><Link href="/signup">Create account</Link></Button>
        </div>
      </ToolPanel>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel className="space-y-4">
        {isFile ? (
          <Field label={cfg.inputLabel}>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary">
              <Upload className="size-6 text-muted-foreground" />
              <span className="text-sm">{file ? file.name : "Click to choose a file"}</span>
              <input
                type="file"
                accept={cfg.accept}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
        ) : (
          <Field label={cfg.inputLabel}>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={cfg.placeholder}
              className="min-h-48 font-sans"
            />
          </Field>
        )}

        {cfg.kind === "image" && (
          <Field label="Question (optional)" hint="Leave blank for a full description.">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What does the sign say?" />
          </Field>
        )}

        <Button onClick={onRun} disabled={busy} size="lg" className="w-full">
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {busy ? "Working…" : cfg.cta}
        </Button>

        {error && (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}
      </ToolPanel>

      <ToolPanel className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Result</span>
          <CopyButton value={result} />
        </div>
        <Textarea
          readOnly
          value={result}
          placeholder="The AI result will appear here…"
          className="min-h-48 flex-1 font-sans"
        />
      </ToolPanel>
    </div>
  );
}
