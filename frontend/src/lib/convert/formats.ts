/**
 * Format table for the universal converter.
 *
 * WHY A TABLE AND NOT A PAIR LIST
 * "Any to any" written literally is N² converters — 25 formats would be 600
 * hand-written pairs, and every new format would add 50 more. Instead each
 * format declares only how to get *into* a shared intermediate (its hub) and
 * how to come back *out*. Pairs are then found by routing (see graph.ts), so
 * adding a format costs two functions, not fifty.
 *
 * `decode` / `encode` are deliberately nullable and asymmetric, because real
 * support is. A browser canvas decodes GIF but cannot encode it; we can read a
 * PDF's text layer but writing one back with the original layout needs a real
 * layout engine. Claiming a capability we don't have is worse than admitting
 * the gap — the UI shows the user what a route will actually cost them.
 */

/** Where a step runs. Drives the on-device / server badge the user sees. */
export type Runtime = "device" | "server";

/**
 * The four intermediates every conversion passes through.
 *
 * Picking hubs is the whole design. Anything that can become a canvas can
 * become any image; anything that can become rows can become any table. The
 * hubs are chosen so that the four of them cover the formats people actually
 * search for.
 */
export type Hub =
  /** ImageBitmap on a canvas — every raster format in and out. */
  | "image"
  /** `unknown[][]` — CSV, TSV, JSON, XML, spreadsheets. */
  | "tabular"
  /** HTML — the lingua franca for prose with formatting. */
  | "document"
  /** Page-oriented, fixed layout. Terminal for the other three. */
  | "pdf";

export interface FileFormat {
  /** Stable id, used in URLs and the format picker. */
  id: string;
  label: string;
  /** First extension is the one we write. */
  ext: string[];
  /** For the file input's `accept` and for sniffing dropped files. */
  mime: string[];
  hub: Hub;
  /** Null when we cannot read this format at all. */
  decode: Runtime | null;
  /** Null when we cannot write it — common, and not a bug. */
  encode: Runtime | null;
  /** Lossy image formats take a quality argument when encoding. */
  lossy?: boolean;
  /** Image formats with no alpha channel need a background flattened in. */
  opaque?: boolean;
  /** Shown in the picker. Say the honest thing, especially about limits. */
  note?: string;
}

export const FORMATS: FileFormat[] = [
  // ───────────────────────────── Image ─────────────────────────────
  // Decoding is whatever the browser will paint; encoding is whatever
  // canvas.toBlob will actually produce, which is probed at runtime in
  // image-formats.ts rather than assumed here.
  { id: "png", label: "PNG", ext: ["png"], mime: ["image/png"], hub: "image", decode: "device", encode: "device", lossy: false, opaque: false, note: "Lossless with transparency." },
  { id: "jpg", label: "JPEG", ext: ["jpg", "jpeg"], mime: ["image/jpeg"], hub: "image", decode: "device", encode: "device", lossy: true, opaque: true, note: "Smallest for photos. No transparency." },
  { id: "webp", label: "WebP", ext: ["webp"], mime: ["image/webp"], hub: "image", decode: "device", encode: "device", lossy: true, opaque: false, note: "25–35% smaller than JPEG, keeps transparency." },
  { id: "avif", label: "AVIF", ext: ["avif"], mime: ["image/avif"], hub: "image", decode: "device", encode: "device", lossy: true, opaque: false, note: "Best compression; encoding is slower and not in every browser." },
  { id: "bmp", label: "BMP", ext: ["bmp"], mime: ["image/bmp"], hub: "image", decode: "device", encode: "device", lossy: false, opaque: true },
  { id: "ico", label: "ICO", ext: ["ico"], mime: ["image/x-icon"], hub: "image", decode: "device", encode: "device", lossy: false, opaque: false, note: "Favicons. Written at 256×256 or smaller." },
  // No browser encodes GIF or TIFF from a canvas — animation and multi-page
  // are lost on the way in, so we read them and say so rather than pretend.
  { id: "gif", label: "GIF", ext: ["gif"], mime: ["image/gif"], hub: "image", decode: "device", encode: null, note: "Read only. Animated GIFs convert as their first frame." },
  { id: "tiff", label: "TIFF", ext: ["tif", "tiff"], mime: ["image/tiff"], hub: "image", decode: "server", encode: null, note: "Multi-page TIFF needs the server." },
  { id: "svg", label: "SVG", ext: ["svg"], mime: ["image/svg+xml"], hub: "image", decode: "device", encode: null, note: "Rasterised on the way in — the result is pixels, not vectors." },
  { id: "heic", label: "HEIC", ext: ["heic", "heif"], mime: ["image/heic"], hub: "image", decode: "server", encode: null, note: "iPhone photos. Safari decodes these natively; other browsers need the server." },

  // ──────────────────────────── Tabular ────────────────────────────
  // `xlsx` (already a dependency) reads and writes nearly all of these, which
  // is why this hub is close to free.
  { id: "csv", label: "CSV", ext: ["csv"], mime: ["text/csv"], hub: "tabular", decode: "device", encode: "device" },
  { id: "tsv", label: "TSV", ext: ["tsv"], mime: ["text/tab-separated-values"], hub: "tabular", decode: "device", encode: "device" },
  { id: "json", label: "JSON", ext: ["json"], mime: ["application/json"], hub: "tabular", decode: "device", encode: "device", note: "Arrays of objects map to rows. Deeply nested JSON is flattened." },
  { id: "xml", label: "XML", ext: ["xml"], mime: ["application/xml"], hub: "tabular", decode: "device", encode: "device" },
  { id: "xlsx", label: "Excel (XLSX)", ext: ["xlsx"], mime: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], hub: "tabular", decode: "device", encode: "device", note: "Values and sheet structure. Formulas become their computed values." },
  { id: "xls", label: "Excel 97–2003 (XLS)", ext: ["xls"], mime: ["application/vnd.ms-excel"], hub: "tabular", decode: "device", encode: null, note: "Read only — we write the modern XLSX format." },
  { id: "ods", label: "OpenDocument Sheet", ext: ["ods"], mime: ["application/vnd.oasis.opendocument.spreadsheet"], hub: "tabular", decode: "device", encode: null },

  // ─────────────────────────── Document ────────────────────────────
  { id: "html", label: "HTML", ext: ["html", "htm"], mime: ["text/html"], hub: "document", decode: "device", encode: "device" },
  { id: "md", label: "Markdown", ext: ["md"], mime: ["text/markdown"], hub: "document", decode: "device", encode: "device", note: "Round-trips through HTML via marked and turndown." },
  { id: "txt", label: "Plain text", ext: ["txt"], mime: ["text/plain"], hub: "document", decode: "device", encode: "device", note: "All formatting is dropped, by definition." },
  { id: "docx", label: "Word (DOCX)", ext: ["docx"], mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], hub: "document", decode: "device", encode: "device", note: "Text, headings, lists and tables. Exact page layout is not preserved." },
  { id: "rtf", label: "Rich Text (RTF)", ext: ["rtf"], mime: ["application/rtf"], hub: "document", decode: "server", encode: null },
  { id: "odt", label: "OpenDocument Text", ext: ["odt"], mime: ["application/vnd.oasis.opendocument.text"], hub: "document", decode: "server", encode: null },
  { id: "epub", label: "EPUB", ext: ["epub"], mime: ["application/epub+zip"], hub: "document", decode: "device", encode: null, note: "An EPUB is zipped HTML, so reading it needs no new library." },
  // PowerPoint is a document only in the loosest sense: we can pull the text
  // out of slides, but nothing about the layout survives. Writing one is a
  // layout problem we are not solving in the browser.
  { id: "pptx", label: "PowerPoint (PPTX)", ext: ["pptx"], mime: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"], hub: "document", decode: "device", encode: "server", note: "Slide text only when read in the browser. Writing slides needs the server." },

  // ───────────────────────────── PDF ───────────────────────────────
  { id: "pdf", label: "PDF", ext: ["pdf"], mime: ["application/pdf"], hub: "pdf", decode: "device", encode: "device", note: "Read via its text layer and page images. Scanned PDFs have no text to extract." },
];

const BY_ID = new Map(FORMATS.map((f) => [f.id, f]));
const BY_EXT = new Map(FORMATS.flatMap((f) => f.ext.map((e) => [e, f] as const)));

export function getFormat(id: string): FileFormat | undefined {
  return BY_ID.get(id);
}

/** Identify a dropped file. Extension beats MIME: browsers lie about MIME. */
export function detectFormat(file: { name: string; type?: string }): FileFormat | undefined {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && BY_EXT.has(ext)) return BY_EXT.get(ext);
  if (!file.type) return undefined;
  return FORMATS.find((f) => f.mime.includes(file.type!));
}

/** Everything we can read — the file picker's `accept` list. */
export const READABLE = FORMATS.filter((f) => f.decode !== null);

/** Everything we can write — the target dropdown. */
export const WRITABLE = FORMATS.filter((f) => f.encode !== null);

/** `accept` attribute covering every readable format. */
export const INPUT_ACCEPT = READABLE.flatMap((f) => f.ext.map((e) => `.${e}`)).join(",");
