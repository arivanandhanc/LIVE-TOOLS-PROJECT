import type { GenSpec } from "./types";
import { textTools } from "./text";
import { cipherTools } from "./cipher";
import { convertTools } from "./convert";
import { numberTools } from "./numbers";
import { webTools } from "./web";
import { generateTools } from "./generate";
import { funTools } from "./fun";
import { dateTools } from "./dates";

export const genTools: GenSpec[] = [
  ...textTools,
  ...cipherTools,
  ...convertTools,
  ...numberTools,
  ...webTools,
  ...generateTools,
  ...funTools,
  ...dateTools,
];

export const genToolMap: Record<string, GenSpec> = Object.fromEntries(
  genTools.map((g) => [g.slug, g])
);

export type { GenSpec };
