import type { ToolCategoryId } from "../types";

export type GenKind = "transform" | "dual" | "convert" | "generate";

export interface GenSpec {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  category: ToolCategoryId;
  kind: GenKind;
  /** featured on landing page */
  featured?: boolean;

  // kind: "transform" — single input → output
  live?: boolean;
  run?: (input: string) => string;
  placeholder?: string;
  inputLabel?: string;
  outputLabel?: string;

  // kind: "dual" — two buttons (e.g. encode / decode)
  aLabel?: string;
  aRun?: (input: string) => string;
  bLabel?: string;
  bRun?: (input: string) => string;

  // kind: "convert"
  units?: string[];
  convert?: (value: number, from: string, to: string) => number;
  convFrom?: string;
  convTo?: string;
  convValue?: string;
  convNote?: string;

  // kind: "generate" — button produces output
  generate?: () => string;
  generateLabel?: string;
}
