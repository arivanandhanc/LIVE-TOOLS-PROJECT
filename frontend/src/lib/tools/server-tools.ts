/**
 * Server-side tools that are fully wired to the backend processing API.
 * Keep in sync with server/src/jobs/registry.ts. Tools not listed here fall
 * back to the "coming soon" notice.
 */

export interface ParamField {
  name: string;
  label: string;
  type: "text" | "select";
  placeholder?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  hint?: string;
}

export interface ServerToolConfig {
  slug: string;
  accept: string;
  multiple: boolean;
  minFiles: number;
  params: ParamField[];
  cta: string;
}

export const serverTools: Record<string, ServerToolConfig> = {
  "merge-pdf": { slug: "merge-pdf", accept: "application/pdf", multiple: true, minFiles: 2, params: [], cta: "Merge PDFs" },
  "split-pdf": {
    slug: "split-pdf", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{ name: "pages", label: "Pages to extract", type: "text", placeholder: "e.g. 1-3,5,8-10", hint: "Leave blank to keep all pages." }],
    cta: "Split PDF",
  },
  "extract-pages": {
    slug: "extract-pages", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{ name: "pages", label: "Pages to extract", type: "text", placeholder: "e.g. 2,4,6-8" }],
    cta: "Extract pages",
  },
  "remove-pages": {
    slug: "remove-pages", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{ name: "pages", label: "Pages to remove", type: "text", placeholder: "e.g. 1,3,5" }],
    cta: "Remove pages",
  },
  "rotate-pdf": {
    slug: "rotate-pdf", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{
      name: "angle", label: "Rotation", type: "select", defaultValue: "90",
      options: [
        { label: "90° clockwise", value: "90" },
        { label: "180°", value: "180" },
        { label: "270° clockwise", value: "270" },
      ],
    }],
    cta: "Rotate PDF",
  },
  "compress-pdf": { slug: "compress-pdf", accept: "application/pdf", multiple: false, minFiles: 1, params: [], cta: "Compress PDF" },
  "add-page-numbers": {
    slug: "add-page-numbers", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{
      name: "position", label: "Position", type: "select", defaultValue: "bottom-center",
      options: [
        { label: "Bottom center", value: "bottom-center" },
        { label: "Bottom right", value: "bottom-right" },
        { label: "Bottom left", value: "bottom-left" },
      ],
    }],
    cta: "Add page numbers",
  },
  "watermark-pdf": {
    slug: "watermark-pdf", accept: "application/pdf", multiple: false, minFiles: 1,
    params: [{ name: "text", label: "Watermark text", type: "text", placeholder: "CONFIDENTIAL", defaultValue: "CONFIDENTIAL" }],
    cta: "Add watermark",
  },
  "jpg-to-pdf": { slug: "jpg-to-pdf", accept: "image/jpeg,image/png", multiple: true, minFiles: 1, params: [], cta: "Convert to PDF" },
};

export function getServerToolConfig(slug: string): ServerToolConfig | undefined {
  return serverTools[slug];
}
