/**
 * Executing a route.
 *
 * graph.ts decides what *should* happen; this decides what actually can, today,
 * with the libraries this app already ships and the one server that exists. The
 * two are deliberately separate: the graph describes the destination, and this
 * file is honest about how far the road is built.
 *
 * Where a pair is not implemented yet it throws a message a person can act on,
 * rather than producing a file that is subtly wrong. A converter that quietly
 * returns a blank PDF is worse than one that says it cannot do it.
 */

import { detectFormat, getFormat, type FileFormat } from "./formats";
import { plan } from "./graph";

/**
 * The conversion server, which is a LibreOffice worker on AWS Lambda.
 * Overridden per environment; the default is the deployed one so the feature
 * works in development without any setup.
 */
export const CONVERT_SERVER =
  process.env.NEXT_PUBLIC_CONVERT_URL ??
  "https://3x5q7btxawvcheyflwpxw7z62m0fjfqn.lambda-url.ap-south-1.on.aws";

/**
 * What the server will accept, mirroring its /capabilities response.
 *
 * PDF is deliberately absent from the sources: LibreOffice opens a PDF in Draw
 * and re-exports it as a picture of itself, losing the text layer. Reading PDFs
 * is better done here in the browser with pdf.js, so pdf → anything stays on
 * the device even though the server is technically willing to try.
 */
const SERVER_SOURCES = new Set([
  "doc", "docx", "odt", "rtf", "txt", "html", "htm",
  "xls", "xlsx", "ods", "csv", "tsv",
  "ppt", "pptx", "odp",
]);
const SERVER_TARGETS = new Set([
  "pdf", "docx", "doc", "odt", "rtf", "txt", "html",
  "xlsx", "xls", "ods", "csv", "pptx", "ppt", "odp",
]);

/** Lambda rejects requests over 6 MB before our code runs; refuse first. */
export const SERVER_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Wake the server early, while the user is still reading their options.
 *
 * A cold Lambda spends ~25 seconds loading a 500 MB image, and that wait is
 * pure dead time if it starts when the button is clicked. Firing it the moment
 * a file is dropped overlaps it with the two to five seconds a person spends
 * choosing a target, which usually removes the cold start from what they
 * actually experience.
 *
 * Deliberately fire-and-forget: it must never delay or fail the real work, and
 * a failure here means nothing — the conversion request will report its own.
 */
let warmedAt = 0;
export function prewarmServer(): void {
  // Lambda holds an environment for several minutes, so re-pinging inside that
  // window buys nothing and only spends the free-tier allowance.
  if (Date.now() - warmedAt < 4 * 60 * 1000) return;
  warmedAt = Date.now();
  void fetch(`${CONVERT_SERVER}/health`, { cache: "no-store" }).catch(() => {});
}

export interface ConversionResult {
  blob: Blob;
  filename: string;
  /** Which half did the work — this is what the badge reports afterwards. */
  where: "device" | "server";
  ms: number;
}

export class ConversionError extends Error {}

/** Whether the server is capable of this pair, ignoring whether it should. */
function serverSupports(from: FileFormat, to: FileFormat): boolean {
  if (from.hub === "image" || to.hub === "image") return false;
  if (from.id === "pdf") return false; // pdf.js reads these better than LibreOffice
  return SERVER_SOURCES.has(from.id) && SERVER_TARGETS.has(to.id);
}

/**
 * The server is the fallback, never the default.
 *
 * It is tempting to route everything the server can do to the server, since it
 * is the more capable converter — but that would upload a CSV to turn it into a
 * spreadsheet the browser could produce instantly and privately. The device
 * wins whenever it is able: it is faster, it costs nothing, and the file never
 * leaves the machine. The server exists for what the browser genuinely cannot
 * do, which is essentially Office layout.
 */
function needsServer(from: FileFormat, to: FileFormat): boolean {
  if (canRunOnDevice(from, to)) return false;
  return serverSupports(from, to);
}

/**
 * Whether a pair can be converted at all, and where it would run.
 * The UI calls this for every candidate target to build the picker.
 */
export function describe(fromId: string, toId: string) {
  const from = getFormat(fromId);
  const to = getFormat(toId);
  if (!from || !to) return null;

  const routed = plan(fromId, toId);
  if (!routed.best) return null;

  const device = canRunOnDevice(from, to);
  const server = !device && serverSupports(from, to);
  return {
    where: device ? ("device" as const) : ("server" as const),
    fidelity: routed.best.fidelity,
    notes: routed.best.notes,
    implemented: device || server,
  };
}

/**
 * The device paths that are actually wired up, as opposed to merely routable.
 *
 * This list must stay narrower than the graph, and exactly as wide as
 * convertOnDevice below. Anything claimed here that the executor cannot do
 * becomes a button that fails when clicked — the one outcome worth engineering
 * against, since the user has already committed by then.
 */
const DEVICE_DOCUMENT_TARGETS = new Set(["html", "md", "txt"]);
const DEVICE_TABULAR_TARGETS = new Set(["csv", "tsv", "xlsx", "json"]);
/**
 * A spreadsheet rendered as text or a web page. These leave the tabular hub, so
 * they are not covered by the tabular rule, but `xlsx` writes all three
 * directly — and uploading a CSV to a server to turn it into a text file would
 * make the home page's privacy claim untrue for no gain.
 */
const DEVICE_TABULAR_AS_DOCUMENT = new Set(["html", "txt"]);

function canRunOnDevice(from: FileFormat, to: FileFormat): boolean {
  if (from.hub === "image" && to.hub === "image") return true;
  if (from.hub === "image" && to.id === "pdf") return true;
  if (from.id === "pdf" && to.hub === "image") return true;
  if (from.hub === "tabular" && to.hub === "tabular") return DEVICE_TABULAR_TARGETS.has(to.id);
  if (from.hub === "tabular" && to.hub === "document") return DEVICE_TABULAR_AS_DOCUMENT.has(to.id);
  if (from.hub === "document" && to.hub === "document") return DEVICE_DOCUMENT_TARGETS.has(to.id);
  return false;
}

export async function runConversion(file: File, targetId: string): Promise<ConversionResult> {
  const began = Date.now();
  const from = detectFormat(file);
  const to = getFormat(targetId);

  if (!from) throw new ConversionError(`We don't recognise ${file.name.split(".").pop()} files yet.`);
  if (!to) throw new ConversionError(`Unknown target format.`);
  if (from.id === to.id) throw new ConversionError(`That file is already ${to.label}.`);

  const base = file.name.replace(/\.[^.]+$/, "") || "converted";
  const filename = `${base}.${to.ext[0]}`;

  if (needsServer(from, to)) {
    if (file.size > SERVER_MAX_BYTES) {
      throw new ConversionError(
        `${to.label} conversion happens on our server, which accepts files up to ${Math.round(
          SERVER_MAX_BYTES / 1024 / 1024
        )} MB. This one is ${(file.size / 1024 / 1024).toFixed(1)} MB.`
      );
    }
    const blob = await convertOnServer(file, to.id);
    return { blob, filename, where: "server", ms: Date.now() - began };
  }

  const blob = await convertOnDevice(file, from, to);
  return { blob, filename, where: "device", ms: Date.now() - began };
}

async function convertOnServer(file: File, target: string): Promise<Blob> {
  const body = new FormData();
  body.append("file", file);

  // A deadline the user can feel. The server's own ceiling is 90s; this is
  // slightly longer so its clean error message wins over a bare network abort.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(`${CONVERT_SERVER}/convert?to=${encodeURIComponent(target)}`, {
      method: "POST",
      body,
      signal: controller.signal,
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: `Server returned ${res.status}.` }));
      throw new ConversionError(error);
    }
    return await res.blob();
  } catch (err) {
    if (err instanceof ConversionError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new ConversionError("The conversion took too long and was stopped. Try a smaller file.");
    }
    throw new ConversionError(
      "Couldn't reach the conversion server. It may be waking up — try once more."
    );
  } finally {
    clearTimeout(timer);
  }
}

async function convertOnDevice(file: File, from: FileFormat, to: FileFormat): Promise<Blob> {
  // Images in, images out — the canvas does the work, and this is the path the
  // existing image converter already proved.
  if (from.hub === "image" && to.hub === "image") {
    const { loadImageFromFile, drawToCanvas, canvasToBlob } = await import("@/lib/image");
    const img = await loadImageFromFile(file);
    const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, to.opaque ? "#ffffff" : undefined);
    return canvasToBlob(canvas, to.mime[0], to.lossy ? 0.92 : undefined);
  }

  if (from.hub === "image" && to.id === "pdf") {
    const { loadImageFromFile, drawToCanvas, canvasToBlob } = await import("@/lib/image");
    const { PDFDocument } = await import("pdf-lib");
    const img = await loadImageFromFile(file);
    const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight, "#ffffff");
    const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.92);
    const pdf = await PDFDocument.create();
    const embedded = await pdf.embedJpg(await jpeg.arrayBuffer());
    // One page, exactly the size of the image, so nothing is cropped or padded.
    const page = pdf.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
    return new Blob([new Uint8Array(await pdf.save())], { type: "application/pdf" });
  }

  if (from.id === "pdf" && to.hub === "image") {
    const { renderPdfPages } = await import("@/lib/pdf-render");
    const { canvasToBlob } = await import("@/lib/image");
    const pages = await renderPdfPages(file, 2);
    if (!pages.length) throw new ConversionError("That PDF has no pages we could render.");
    // Only the first page: a single image cannot hold more, and silently
    // dropping the rest without saying so would be the dishonest option. The
    // UI says "page 1" next to the result.
    return canvasToBlob(pages[0].canvas, to.mime[0], to.lossy ? 0.92 : undefined);
  }

  if (from.hub === "tabular") {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });

    // Text and web output come from the first sheet, because neither format has
    // any way to represent a second one. Saying so beats silently dropping it.
    if (to.id === "html" || to.id === "txt") {
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const text =
        to.id === "html"
          ? XLSX.utils.sheet_to_html(sheet)
          : XLSX.utils.sheet_to_csv(sheet, { FS: "\t" });
      return new Blob([text], { type: to.mime[0] });
    }

    if (to.id === "json") {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      return new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    }

    const out = XLSX.write(wb, { bookType: to.id as never, type: "array" });
    return new Blob([out], { type: to.mime[0] });
  }

  if (from.hub === "document" && to.hub === "document") {
    const text = await file.text();
    let html = text;
    if (from.id === "md") {
      const { marked } = await import("marked");
      html = await marked.parse(text);
    } else if (from.id === "txt") {
      html = `<pre>${text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</pre>`;
    }

    if (to.id === "html") return new Blob([html], { type: "text/html" });
    if (to.id === "md") {
      const TurndownService = (await import("turndown")).default;
      return new Blob([new TurndownService().turndown(html)], { type: "text/markdown" });
    }
    if (to.id === "txt") {
      const stripped = html.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n");
      return new Blob([stripped], { type: "text/plain" });
    }
  }

  throw new ConversionError(
    `${from.label} to ${to.label} isn't wired up yet. It's a valid route — just not built.`
  );
}
