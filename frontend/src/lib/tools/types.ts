import type { LucideIcon } from "lucide-react";

export type ToolCategoryId =
  | "pdf"
  | "image"
  | "csv"
  | "text"
  | "developer"
  | "convert"
  | "ai";

/** Where the tool's work happens. */
export type ToolMode = "client" | "server";

export type ToolStatus = "live" | "soon";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  slug: string;
  description: string;
  /** Tailwind token name for the category accent (maps to --color-cat-*). */
  accent: string;
  icon: LucideIcon;
}

export interface Tool {
  slug: string;
  name: string;
  /** Short one-line description shown on cards. */
  description: string;
  /** Longer description for the tool page + SEO. */
  longDescription?: string;
  category: ToolCategoryId;
  icon: LucideIcon;
  keywords: string[];
  mode: ToolMode;
  status: ToolStatus;
  /** Marked featured tools surface on the landing page. */
  featured?: boolean;
  /** Whether results can be saved (requires optional login). */
  savable?: boolean;
}
