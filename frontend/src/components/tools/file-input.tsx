"use client";

import { Upload } from "lucide-react";

export function FileInput({
  accept,
  fileName,
  onFile,
  hint = "Click to choose a file",
}: {
  accept: string;
  fileName?: string;
  onFile: (file: File) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary">
      <Upload className="size-6 text-muted-foreground" />
      <span className="text-sm">{fileName || hint}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </label>
  );
}
