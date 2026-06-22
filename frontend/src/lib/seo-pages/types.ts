import type { ToolCategoryId } from "@/lib/tools/types";

export interface SeoFaq {
  question: string;
  answer: string;
}

/** Which client tool a landing page mounts. */
export type SeoKind = "compress-pdf" | "compress-image" | "resize-image";

/** Params handed to the client tool runner for each kind. */
export type SeoToolParams =
  | { kind: "compress-pdf"; targetBytes: number; targetDisplay: string }
  | { kind: "compress-image"; format: "jpg" | "png" | "webp"; targetBytes: number; targetDisplay: string }
  | { kind: "resize-image"; width: number; height: number };

export interface SeoCrumb {
  name: string;
  href: string;
}

/**
 * A single programmatic landing page. Everything needed to render a unique,
 * fully-static, client-only page lives here — driven from one data source so
 * clusters scale cheaply without thin/duplicate content.
 */
export interface SeoPage {
  slug: string;
  /** Grouping key for sibling cross-links (e.g. "compress-jpg"). */
  cluster: string;
  /** Heading for the sibling-links block. */
  clusterLabel: string;
  /** Short chip label used in sibling lists (e.g. "to 50 KB"). */
  chip: string;
  title: string;
  description: string;
  h1: string;
  subhead: string;
  keywords: string[];
  intro: string;
  howTo: string[];
  faqs: SeoFaq[];
  /** Breadcrumb crumbs up to (not including) this page. */
  breadcrumb: SeoCrumb[];
  /** Tool category whose live tools are shown under "Related tools". */
  relatedCategory: ToolCategoryId;
  tool: SeoToolParams;
}
