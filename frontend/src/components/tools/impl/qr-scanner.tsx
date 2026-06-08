"use client";

import * as React from "react";
import jsQR from "jsqr";
import { Upload, AlertCircle } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { ToolPanel, Field } from "@/components/tools/panel";

export default function QrScanner() {
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState("");

  async function onFile(file: File) {
    setError(null);
    setResult("");
    setFileName(file.name);
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Couldn't read that image."));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported in this browser.");
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      if (!code) throw new Error("No QR code found in this image. Try a clearer, closer photo.");
      setResult(code.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const isUrl = /^https?:\/\//i.test(result);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel>
        <Field label="QR code image">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary">
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm">{fileName || "Click to choose an image with a QR code"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        </Field>
        {error && (
          <p className="mt-3 flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}
      </ToolPanel>

      <ToolPanel className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Decoded content</span>
          <CopyButton value={result} />
        </div>
        <div className="min-h-24 break-all rounded-lg border border-border bg-background p-3 text-sm">
          {result || "The QR code's content will appear here…"}
        </div>
        {isUrl && (
          <a href={result} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-primary hover:underline">
            Open link →
          </a>
        )}
      </ToolPanel>
    </div>
  );
}
