/**
 * Image format capabilities for the universal converter.
 *
 * Decode and encode support are NOT symmetric, and neither is fixed across
 * browsers — Safari decodes AVIF but has historically not encoded it, and no
 * browser encodes GIF or TIFF from a canvas. Rather than hard-code a matrix
 * that silently rots, encoder support is probed once at runtime: `canvas.toBlob`
 * falls back to PNG when asked for a MIME type it can't produce, so we ask for
 * a 1×1 image and check what actually came back.
 */

export interface ImageFormat {
  id: string;
  label: string;
  mime: string;
  extension: string;
  /** Lossy formats expose a quality slider. */
  lossy: boolean;
  /** Formats without an alpha channel need a background colour flattened in. */
  opaque: boolean;
  note?: string;
}

/** Output formats we attempt. Availability is confirmed at runtime. */
export const OUTPUT_FORMATS: ImageFormat[] = [
  {
    id: "png",
    label: "PNG",
    mime: "image/png",
    extension: "png",
    lossy: false,
    opaque: false,
    note: "Lossless with transparency. Best for logos, screenshots and line art.",
  },
  {
    id: "jpeg",
    label: "JPEG",
    mime: "image/jpeg",
    extension: "jpg",
    lossy: true,
    opaque: true,
    note: "Smallest for photographs. No transparency — transparent areas are filled.",
  },
  {
    id: "webp",
    label: "WebP",
    mime: "image/webp",
    extension: "webp",
    lossy: true,
    opaque: false,
    note: "Roughly 25–35% smaller than JPEG at similar quality, and keeps transparency.",
  },
  {
    id: "avif",
    label: "AVIF",
    mime: "image/avif",
    extension: "avif",
    lossy: true,
    opaque: false,
    note: "Best compression available, but encoding is slower and not supported in every browser.",
  },
  {
    id: "bmp",
    label: "BMP",
    mime: "image/bmp",
    extension: "bmp",
    lossy: false,
    opaque: true,
    note: "Uncompressed. Very large files — only useful for legacy software.",
  },
];

/**
 * Input formats the browser can decode. This is broader than the output list:
 * decoding GIF, SVG, ICO and TIFF is common, encoding them is not.
 */
export const INPUT_ACCEPT =
  "image/png,image/jpeg,image/webp,image/avif,image/gif,image/bmp,image/svg+xml,image/x-icon,image/tiff,.heic,.heif";

let cache: Promise<Set<string>> | null = null;

/**
 * Probe which MIME types this browser can actually encode.
 *
 * `toBlob` silently substitutes PNG for unsupported types, so comparing the
 * returned blob's type against what we asked for is the only reliable test.
 */
export function supportedOutputMimes(): Promise<Set<string>> {
  if (cache) return cache;

  cache = (async () => {
    const supported = new Set<string>();
    if (typeof document === "undefined") return supported;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    await Promise.all(
      OUTPUT_FORMATS.map(
        (format) =>
          new Promise<void>((resolve) => {
            try {
              canvas.toBlob(
                (blob) => {
                  if (blob && blob.type === format.mime) supported.add(format.mime);
                  resolve();
                },
                format.mime,
                0.9
              );
            } catch {
              resolve();
            }
          })
      )
    );

    // PNG is mandated by the HTML spec; guarantee at least one option exists
    // even if probing is blocked (e.g. by a hardened privacy extension).
    supported.add("image/png");
    return supported;
  })();

  return cache;
}

/** Human-readable source format from a File, for display only. */
export function describeSource(file: File): string {
  if (file.type) return file.type.replace("image/", "").toUpperCase();
  const ext = file.name.split(".").pop();
  return ext ? ext.toUpperCase() : "Unknown";
}
