/**
 * The shape of a pdf.js text item, narrowed to what the extractor reads.
 *
 * Declared here rather than imported from pdfjs-dist because the library's own
 * type is a union with marked-content items that carry no `str` at all, and
 * narrowing it at every use site obscures the extraction logic.
 */
export interface TextItem {
  str: string;
  /** [scaleX, skewX, skewY, scaleY, translateX, translateY] */
  transform: number[];
  hasEOL?: boolean;
}
