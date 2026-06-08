/**
 * Browser-side PDF helpers built on pdf-lib. Everything here runs in the
 * user's browser — files never touch a server, so there is no upload latency
 * and no cold-start wait.
 */
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

export type Bytes = Uint8Array | ArrayBuffer;

export async function readFileBytes(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

/** Load a PDF, tolerating documents with encryption-free quirks. */
export async function loadPdf(file: File): Promise<PDFDocument> {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

/**
 * Parse a 1-based page spec like "1-3,5,8-10" into sorted, de-duplicated
 * 0-based indices. Blank spec → all pages. Throws on out-of-range/invalid.
 */
export function parsePageRanges(spec: string, total: number): number[] {
  const trimmed = spec.trim();
  if (!trimmed) return Array.from({ length: total }, (_, i) => i);

  const out = new Set<number>();
  for (const part of trimmed.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;
    const range = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let [a, b] = [parseInt(range[1], 10), parseInt(range[2], 10)];
      if (a > b) [a, b] = [b, a];
      for (let p = a; p <= b; p++) out.add(p);
    } else if (/^\d+$/.test(chunk)) {
      out.add(parseInt(chunk, 10));
    } else {
      throw new Error(`Invalid page reference: "${chunk}"`);
    }
  }

  const indices = [...out].sort((x, y) => x - y);
  for (const n of indices) {
    if (n < 1 || n > total) {
      throw new Error(`Page ${n} is out of range (document has ${total} page${total > 1 ? "s" : ""}).`);
    }
  }
  return indices.map((n) => n - 1);
}

/** Serialize a pdf-lib document to a downloadable Blob. */
export async function toPdfBlob(doc: PDFDocument): Promise<Blob> {
  const bytes = await doc.save();
  // Copy into a fresh ArrayBuffer so the Blob type is unambiguous.
  return new Blob([bytes.slice()], { type: "application/pdf" });
}

export { PDFDocument, degrees, rgb, StandardFonts };
