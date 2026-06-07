import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdf, rotatePdf, addPageNumbers, splitPdf } from "../jobs/processors/pdf";
import type { ProcessorFile } from "../jobs/types";

async function makePdf(pages: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([200, 200]).drawText(`Page ${i + 1}`, { x: 20, y: 100, size: 16 });
  return Buffer.from(await doc.save());
}

const asFile = (buffer: Buffer): ProcessorFile => ({ buffer, originalName: "test.pdf", mimeType: "application/pdf" });

describe("pdf processors", () => {
  it("merges multiple PDFs into one with all pages", async () => {
    const a = await makePdf(2);
    const b = await makePdf(3);
    const out = await mergePdf({ files: [asFile(a), asFile(b)], params: {} });
    const doc = await PDFDocument.load(out.buffer);
    expect(doc.getPageCount()).toBe(5);
    expect(out.mimeType).toBe("application/pdf");
  });

  it("rejects merging a single file", async () => {
    const a = await makePdf(1);
    await expect(mergePdf({ files: [asFile(a)], params: {} })).rejects.toThrow();
  });

  it("rotates without changing page count", async () => {
    const a = await makePdf(2);
    const out = await rotatePdf({ files: [asFile(a)], params: { angle: 90 } });
    const doc = await PDFDocument.load(out.buffer);
    expect(doc.getPageCount()).toBe(2);
  });

  it("splits to a page range", async () => {
    const a = await makePdf(10);
    const out = await splitPdf({ files: [asFile(a)], params: { pages: "2-4" } });
    const doc = await PDFDocument.load(out.buffer);
    expect(doc.getPageCount()).toBe(3);
  });

  it("adds page numbers", async () => {
    const a = await makePdf(3);
    const out = await addPageNumbers({ files: [asFile(a)], params: {} });
    expect(out.buffer.length).toBeGreaterThan(0);
  });
});
