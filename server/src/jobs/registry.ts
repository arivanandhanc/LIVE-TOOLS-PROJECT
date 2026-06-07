import type { ToolDefinition } from "./types";
import * as pdf from "./processors/pdf";

const PDF = ["application/pdf"];
const IMG = ["image/jpeg", "image/jpg", "image/png"];

export const toolDefinitions: Record<string, ToolDefinition> = {
  "merge-pdf": { slug: "merge-pdf", processor: pdf.mergePdf, minFiles: 2, maxFiles: 20, accept: PDF },
  "split-pdf": { slug: "split-pdf", processor: pdf.splitPdf, minFiles: 1, maxFiles: 1, accept: PDF },
  "remove-pages": { slug: "remove-pages", processor: pdf.removePages, minFiles: 1, maxFiles: 1, accept: PDF },
  "extract-pages": { slug: "extract-pages", processor: pdf.splitPdf, minFiles: 1, maxFiles: 1, accept: PDF },
  "rotate-pdf": { slug: "rotate-pdf", processor: pdf.rotatePdf, minFiles: 1, maxFiles: 1, accept: PDF },
  "compress-pdf": { slug: "compress-pdf", processor: pdf.compressPdf, minFiles: 1, maxFiles: 1, accept: PDF },
  "add-page-numbers": { slug: "add-page-numbers", processor: pdf.addPageNumbers, minFiles: 1, maxFiles: 1, accept: PDF },
  "watermark-pdf": { slug: "watermark-pdf", processor: pdf.watermarkPdf, minFiles: 1, maxFiles: 1, accept: PDF },
  "jpg-to-pdf": { slug: "jpg-to-pdf", processor: pdf.jpgToPdf, minFiles: 1, maxFiles: 30, accept: IMG },
};

export function getToolDefinition(slug: string): ToolDefinition | undefined {
  return toolDefinitions[slug];
}

export const supportedServerTools = Object.keys(toolDefinitions);
