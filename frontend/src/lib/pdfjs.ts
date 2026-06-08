"use client";

// Shared pdf.js loader. The worker is emitted as a same-origin asset, which the
// site's CSP allows via `worker-src 'self' blob:`.
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export { pdfjsLib };
