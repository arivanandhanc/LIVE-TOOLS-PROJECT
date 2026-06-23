"use client";

import * as React from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";
import { FileInput } from "@/components/tools/file-input";
import { getAiStatus, runAiFileTool } from "@/lib/api";

export default function OcrPdf() {
  const [enabled, setEnabled] = React.useState<boolean | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState("");

  React.useEffect(() => {
    getAiStatus().then((s) => setEnabled(s.enabled)).catch(() => setEnabled(false));
  }, []);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult("");
    try {
      const { pdfjsLib } = await import("@/lib/pdfjs");
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let combined = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Reading page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.9));
        const pageFile = new File([blob], `page-${i}.jpg`, { type: "image/jpeg" });
        const { result } = await runAiFileTool("ocr-extraction", pageFile);
        combined += `\n\n----- Page ${i} -----\n${result.trim()}`;
      }
      setResult(combined.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed. Please try again.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  if (enabled === false) {
    return (
      <ToolPanel className="text-center">
        <Sparkles className="mx-auto size-6 text-primary" />
        <p className="mt-3 font-medium">AI OCR is being switched on</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">This deployment doesn&apos;t have an AI provider configured yet.</p>
      </ToolPanel>
    );
  }
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel className="space-y-4">
        <Field label="Scanned PDF"><FileInput accept="application/pdf" fileName={file?.name} onFile={setFile} hint="Choose a PDF to OCR" /></Field>
        <Button onClick={run} disabled={!file || busy} size="lg" className="w-full">
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} {busy ? progress || "Working…" : "Extract text"}
        </Button>
        {error && <p className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
        <p className="text-xs text-muted-foreground">Each page is rendered and read by AI vision. Large PDFs take longer.</p>
      </ToolPanel>
      <ToolPanel className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Extracted text</span>
          <CopyButton value={result} />
        </div>
        <Textarea readOnly value={result} placeholder="Recognized text appears here…" className="min-h-64 flex-1 font-sans" />
      </ToolPanel>
    </div>
  );
}
