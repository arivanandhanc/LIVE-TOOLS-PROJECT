"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface DropzoneProps {
  accept?: string;
  onFile: (file: File) => void;
  file?: File | null;
  hint?: string;
}

export function Dropzone({ accept = "image/*", onFile, file, hint }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) onFile(files[0]);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/40"
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <UploadCloud className="size-6" />
      </span>
      {file ? (
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">{formatBytes(file.size)} · click to replace</p>
        </div>
      ) : (
        <div>
          <p className="font-medium">Drop a file here or click to browse</p>
          {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
