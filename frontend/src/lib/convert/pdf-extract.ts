/**
 * Reading a PDF in the browser.
 *
 * PDF is the most-searched input on this site — "pdf to word" and "pdf to
 * excel" are the two biggest queries in the harvest — and it is also the one
 * the conversion server cannot help with: LibreOffice opens a PDF in Draw and
 * re-exports it as a picture of itself, losing the text layer entirely. So the
 * browser has to do it, using the text layer pdf.js already exposes.
 *
 * WHAT THIS CAN AND CANNOT DO
 * A PDF has no paragraphs, no tables and no headings. It has glyphs at
 * coordinates. Everything below is inference from those coordinates, and it is
 * honest about being inference: lines are grouped by shared baseline, columns
 * by horizontal gaps. It recovers the content, not the design.
 *
 * A scanned PDF has no text layer at all — only an image of one — so there is
 * nothing here to find. That case is detected and reported rather than
 * returning an empty file that looks like a failed conversion.
 */

import type { TextItem } from "./types-pdf";

/** One visual line: the text, and where it sat on the page. */
export interface Line {
  y: number;
  /** Each run of text with its left edge, used to infer columns. */
  cells: { x: number; text: string }[];
  text: string;
}

/**
 * Two glyphs belong to the same line if their baselines are within this many
 * points. Not zero: subscripts, differing font sizes and rounding all nudge a
 * baseline slightly, and demanding exact equality shatters one line into five.
 */
const LINE_TOLERANCE = 2.5;

/**
 * How much wider than a word space a gap must be to count as a column gutter.
 *
 * This is a multiplier, not a fixed distance, because a constant cannot be
 * right for two font sizes at once: 12pt separates columns in body text but
 * merges them in a larger header row, which is exactly how "Qty" and "Price"
 * ended up in one cell. The word-space width is measured from the page itself
 * and the threshold scales with it.
 */
const GUTTER_RATIO = 0.8;

/** Used only when a line is too short to measure its own spacing. */
const FALLBACK_GUTTER = 12;

export class EmptyPdfError extends Error {}

/**
 * Pull the text layer out, page by page, as positioned lines.
 */
export async function extractLines(file: File): Promise<Line[][]> {
  const { pdfjsLib } = await import("@/lib/pdfjs");
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const pages: Line[][] = [];
  let glyphs = 0;

  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      const items = (content.items as TextItem[]).filter(
        (i) => typeof i.str === "string" && i.str.trim() !== ""
      );
      glyphs += items.length;

      // transform is [a, b, c, d, e, f]; a is the horizontal scale, which for
      // text is effectively the font size, and e/f are the x and y translation.
      const placed = items.map((i) => ({
        x: i.transform[4],
        y: i.transform[5],
        size: Math.abs(i.transform[0]) || 10,
        text: i.str,
      }));

      // Group by baseline, top of page first. PDF y grows upward, so sort
      // descending to read in the order a human would.
      type Part = { x: number; size: number; text: string };
      const byLine: { y: number; parts: Part[] }[] = [];
      for (const p of placed.sort((a, b) => b.y - a.y || a.x - b.x)) {
        const line = byLine.find((l) => Math.abs(l.y - p.y) <= LINE_TOLERANCE);
        const part: Part = { x: p.x, size: p.size, text: p.text };
        if (line) line.parts.push(part);
        else byLine.push({ y: p.y, parts: [part] });
      }

      pages.push(
        byLine.map((l) => {
          const parts = l.parts.sort((a, b) => a.x - b.x);

          // A glyph is roughly half its point size wide, so this estimates the
          // right edge of a run well enough to measure the gap after it. The
          // threshold then scales with the line's own type size, which is what
          // makes a header row behave like the body rows around it.
          const width = (p: Part) => p.text.length * p.size * 0.5;
          const lineSize = Math.max(...parts.map((p) => p.size));
          const gutter = lineSize > 0 ? lineSize * GUTTER_RATIO : FALLBACK_GUTTER;

          const cells: { x: number; text: string }[] = [];
          let last: { x: number; text: string; right: number } | null = null;

          for (const part of parts) {
            const right = part.x + width(part);
            if (last && part.x - last.right < gutter) {
              last.text += (part.x - last.right > 1 ? " " : "") + part.text;
              last.right = right;
            } else {
              last = { x: part.x, text: part.text, right };
              cells.push(last);
            }
          }
          return { y: l.y, cells, text: cells.map((c) => c.text).join(" ").trim() };
        })
      );
    }
  } finally {
    // Release the worker's copy of the document; a converter can be used many
    // times in one session and these are not small.
    await doc.destroy?.();
  }

  if (glyphs === 0) {
    throw new EmptyPdfError(
      "This PDF has no text layer — it's a scan or an image. Try the OCR tool instead."
    );
  }

  return pages;
}

/** Flatten to plain text, with a blank line between pages. */
export function linesToText(pages: Line[][]): string {
  return pages.map((p) => p.map((l) => l.text).join("\n")).join("\n\n");
}

/**
 * Rows for a spreadsheet, inferred from column positions.
 *
 * Only lines that split into two or more cells can be table rows; a paragraph
 * of prose is one wide cell and would otherwise become a row with a single
 * very long value, which is worse than leaving it out.
 */
export function linesToRows(pages: Line[][]): string[][] {
  const rows: string[][] = [];
  for (const page of pages) {
    for (const line of page) {
      if (line.cells.length > 1) rows.push(line.cells.map((c) => c.text.trim()));
    }
  }
  // Nothing looked like a table. Fall back to one line per row so the user
  // still gets their content, rather than an empty spreadsheet.
  if (!rows.length) {
    for (const page of pages) for (const line of page) if (line.text) rows.push([line.text]);
  }
  return rows;
}
