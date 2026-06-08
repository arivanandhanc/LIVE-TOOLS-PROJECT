/**
 * Renders PDF pages to canvases in the browser using pdf.js. Used by tools
 * that need raster output (PDF → JPG) or raster-based compression. The worker
 * is bundled and served same-origin so it satisfies the site's CSP.
 */
// pdf.js touches browser-only globals (DOMMatrix, etc.) at module load, so it
// must never be imported during server-side prerendering. We import it lazily
// inside the (browser-only) functions below.
type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;
async function getPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export interface RenderedPage {
  canvas: HTMLCanvasElement;
  pageNumber: number;
}

/**
 * Render every page of a PDF to a canvas at the given scale.
 * @param scale 1 = native size; higher = sharper/larger.
 */
export async function renderPdfPages(file: File, scale = 1.5): Promise<RenderedPage[]> {
  const pdfjs = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const out: RenderedPage[] = [];
  try {
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported in this browser.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      out.push({ canvas, pageNumber: n });
      page.cleanup();
    }
  } finally {
    await loadingTask.destroy();
  }
  return out;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/jpeg", quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image."))),
      type,
      quality
    );
  });
}
