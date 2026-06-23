import type { GenSpec } from "./types";
import { textTools } from "./text";
import { cipherTools } from "./cipher";
import { convertTools } from "./convert";
import { numberTools } from "./numbers";
import { webTools } from "./web";
import { generateTools } from "./generate";
import { funTools } from "./fun";
import { dateTools } from "./dates";
import { text2Tools } from "./text2";
import { dev2Tools } from "./dev2";
import { symbolTools } from "./symbols";
import { random2Tools } from "./random2";
import { numbers2Tools } from "./numbers2";
import { web3Tools } from "./web3";
import { convert3Tools } from "./convert3";
import { miscTools } from "./misc";

export const genTools: GenSpec[] = [
  ...textTools,
  ...cipherTools,
  ...convertTools,
  ...numberTools,
  ...webTools,
  ...generateTools,
  ...funTools,
  ...dateTools,
  ...text2Tools,
  ...dev2Tools,
  ...symbolTools,
  ...random2Tools,
  ...numbers2Tools,
  ...web3Tools,
  ...convert3Tools,
  ...miscTools,
];

export const genToolMap: Record<string, GenSpec> = Object.fromEntries(
  genTools.map((g) => [g.slug, g])
);

export type { GenSpec };
