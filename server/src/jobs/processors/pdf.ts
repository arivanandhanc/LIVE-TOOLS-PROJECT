import { PDFDocument, degrees, StandardFonts, rgb } from "pdf-lib";
import type { Processor } from "../types";

/** Parse a page-range string like "1-3,5,8-10" into zero-based indices. */
function parseRanges(spec: string, pageCount: number): number[] {
  if (!spec || !spec.trim()) return Array.from({ length: pageCount }, (_, i) => i);
  const out: number[] = [];
  for (const part of spec.split(",")) {
    const piece = part.trim();
    if (!piece) continue;
    const m = piece.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const start = Math.max(1, parseInt(m[1], 10));
      const end = Math.min(pageCount, parseInt(m[2], 10));
      for (let i = start; i <= end; i++) out.push(i - 1);
    } else {
      const n = parseInt(piece, 10);
      if (n >= 1 && n <= pageCount) out.push(n - 1);
    }
  }
  return out.length ? out : Array.from({ length: pageCount }, (_, i) => i);
}

export const mergePdf: Processor = async ({ files }) => {
  if (files.length < 2) throw new Error("Provide at least two PDF files to merge.");
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  const bytes = await out.save();
  return { buffer: Buffer.from(bytes), filename: "merged.pdf", mimeType: "application/pdf" };
};

export const splitPdf: Processor = async ({ files, params }) => {
  const [file] = files;
  const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
  const indices = parseRanges(String(params.pages ?? ""), src.getPageCount());
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  const bytes = await out.save();
  return { buffer: Buffer.from(bytes), filename: "split.pdf", mimeType: "application/pdf" };
};

export const removePages: Processor = async ({ files, params }) => {
  const [file] = files;
  const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
  const remove = new Set(parseRanges(String(params.pages ?? ""), src.getPageCount()));
  const keep = src.getPageIndices().filter((i) => !remove.has(i));
  if (!keep.length) throw new Error("Cannot remove every page.");
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, keep);
  pages.forEach((p) => out.addPage(p));
  const bytes = await out.save();
  return { buffer: Buffer.from(bytes), filename: "edited.pdf", mimeType: "application/pdf" };
};

export const rotatePdf: Processor = async ({ files, params }) => {
  const [file] = files;
  const angle = Number(params.angle ?? 90);
  const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
  src.getPages().forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  });
  const bytes = await src.save();
  return { buffer: Buffer.from(bytes), filename: "rotated.pdf", mimeType: "application/pdf" };
};

export const compressPdf: Processor = async ({ files }) => {
  const [file] = files;
  const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true, updateMetadata: false });
  // Object streams + dropping metadata yields a meaningful reduction without
  // native tooling. (Deep image recompression would require Ghostscript.)
  const bytes = await src.save({ useObjectStreams: true });
  return { buffer: Buffer.from(bytes), filename: "compressed.pdf", mimeType: "application/pdf" };
};

export const addPageNumbers: Processor = async ({ files, params }) => {
  const [file] = files;
  const doc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width } = page.getSize();
    const text = `${i + 1} / ${pages.length}`;
    const size = 10;
    const textWidth = font.widthOfTextAtSize(text, size);
    const position = String(params.position ?? "bottom-center");
    const x = position.includes("right") ? width - textWidth - 30 : position.includes("left") ? 30 : (width - textWidth) / 2;
    page.drawText(text, { x, y: 20, size, font, color: rgb(0.3, 0.3, 0.3) });
  });
  const bytes = await doc.save();
  return { buffer: Buffer.from(bytes), filename: "numbered.pdf", mimeType: "application/pdf" };
};

export const jpgToPdf: Processor = async ({ files }) => {
  if (!files.length) throw new Error("Provide at least one image.");
  const doc = await PDFDocument.create();
  for (const file of files) {
    const isPng = file.mimeType.includes("png");
    const image = isPng ? await doc.embedPng(file.buffer) : await doc.embedJpg(file.buffer);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const bytes = await doc.save();
  return { buffer: Buffer.from(bytes), filename: "images.pdf", mimeType: "application/pdf" };
};

export const watermarkPdf: Processor = async ({ files, params }) => {
  const [file] = files;
  const text = String(params.text ?? "CONFIDENTIAL");
  const doc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - text.length * 12,
      y: height / 2,
      size: 48,
      font,
      color: rgb(0.6, 0.6, 0.6),
      opacity: 0.3,
      rotate: degrees(45),
    });
  });
  const bytes = await doc.save();
  return { buffer: Buffer.from(bytes), filename: "watermarked.pdf", mimeType: "application/pdf" };
};
