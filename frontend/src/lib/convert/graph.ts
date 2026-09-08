/**
 * Conversion routing.
 *
 * A conversion is three moves: decode the source into its hub, cross to the
 * target's hub if they differ, encode out. The crossings are the only thing
 * that needs hand-writing, and there are few enough of them to reason about —
 * seven in the browser, three more that only a server can do better.
 *
 * Not every crossing is defined, and that is the point. There is no
 * document → image bridge because the router finds document → pdf → image on
 * its own; adding a direct edge would be a second implementation of the same
 * thing, free to drift from the first. Undefined stays undefined until a
 * shorter path is genuinely better than the one routing already finds.
 *
 * What comes back is not just "yes/no" — it is where the work runs and what it
 * costs the file, because both belong in front of the user before they click.
 */

import { FORMATS, getFormat, type FileFormat, type Hub, type Runtime } from "./formats";

/**
 * How much of the original survives.
 *
 * Ordered worst-last so routes can be compared numerically. These are promises
 * to the user, so they are deliberately pessimistic: "high" means it will look
 * right, not that it is byte-identical.
 */
export type Fidelity = "exact" | "high" | "lossy" | "text-only";

const FIDELITY_RANK: Record<Fidelity, number> = {
  exact: 0,
  high: 1,
  lossy: 2,
  "text-only": 3,
};

export interface Bridge {
  from: Hub;
  to: Hub;
  runtime: Runtime;
  fidelity: Fidelity;
  /** Surfaced verbatim in the UI. Describe the loss, not the mechanism. */
  note: string;
}

/**
 * Hub-to-hub crossings.
 *
 * Where a server does materially better than the browser, both are listed and
 * routing picks by preference: the device route always wins on privacy and
 * speed, so the server edge is only taken when it is the only way through or
 * the caller explicitly asked for the better one.
 */
export const BRIDGES: Bridge[] = [
  // ── Browser ──
  { from: "image", to: "pdf", runtime: "device", fidelity: "exact", note: "Each image becomes one page." },
  { from: "image", to: "document", runtime: "device", fidelity: "exact", note: "The image is embedded at full resolution." },
  { from: "pdf", to: "image", runtime: "device", fidelity: "exact", note: "Each page is rendered to an image." },
  { from: "pdf", to: "document", runtime: "device", fidelity: "text-only", note: "Text is extracted; layout, images and columns are lost. A scanned PDF has no text to extract." },
  { from: "pdf", to: "tabular", runtime: "device", fidelity: "lossy", note: "Tables are inferred from where the text sits on the page. Check the result." },
  { from: "document", to: "pdf", runtime: "device", fidelity: "high", note: "Content is re-flowed, so page breaks will not match the original." },
  { from: "document", to: "tabular", runtime: "device", fidelity: "lossy", note: "Only real tables are extracted. Prose around them is dropped." },
  { from: "tabular", to: "document", runtime: "device", fidelity: "exact", note: "Rows become a table." },

  // ── Server (LibreOffice). Better, but the file has to be uploaded. ──
  { from: "document", to: "pdf", runtime: "server", fidelity: "exact", note: "Rendered by LibreOffice, preserving the original layout and pagination." },
  { from: "pdf", to: "document", runtime: "server", fidelity: "high", note: "Layout, images and tables are reconstructed rather than flattened to text." },
  { from: "pdf", to: "tabular", runtime: "server", fidelity: "high", note: "Table structure is detected properly instead of guessed from text positions." },
];

export interface Step {
  kind: "decode" | "bridge" | "encode";
  runtime: Runtime;
  fidelity: Fidelity;
  label: string;
  note?: string;
}

export interface Route {
  from: FileFormat;
  to: FileFormat;
  steps: Step[];
  /** Server if *any* step is — one upload is enough to lose the privacy claim. */
  runtime: Runtime;
  /** The worst step. A chain is only as faithful as its weakest link. */
  fidelity: Fidelity;
  /** Every caveat along the way, for the UI to list under the badge. */
  notes: string[];
}

export interface RouteOptions {
  /**
   * Whether server steps may be used at all. Default true, but a device-only
   * route is always preferred when one exists — see `plan`.
   */
  allowServer?: boolean;
}

/** Cheapest crossing between two hubs, honouring the server ban. */
function findPath(from: Hub, to: Hub, allowServer: boolean): Bridge[] | null {
  if (from === to) return [];

  const usable = BRIDGES.filter((b) => allowServer || b.runtime === "device");

  // Breadth-first over hubs, then keep the best chain of that length. There are
  // four hubs, so this stays trivial and the readability is worth more than the
  // constant factor a Dijkstra would save.
  let frontier: Bridge[][] = [[]];
  const seen = new Set<Hub>([from]);

  for (let depth = 0; depth < 4; depth++) {
    const complete: Bridge[][] = [];
    const next: Bridge[][] = [];

    for (const chain of frontier) {
      const at = chain.length ? chain[chain.length - 1].to : from;
      for (const bridge of usable) {
        if (bridge.from !== at) continue;
        const extended = [...chain, bridge];
        if (bridge.to === to) complete.push(extended);
        else if (!seen.has(bridge.to)) next.push(extended);
      }
    }

    // Prefer, in order: no server hop, then least fidelity lost.
    if (complete.length) {
      return complete.sort((a, b) => cost(a) - cost(b))[0];
    }
    for (const chain of next) seen.add(chain[chain.length - 1].to);
    if (!next.length) return null;
    frontier = next;
  }

  return null;
}

/** Server hops dominate: a route that stays on the device always sorts first. */
function cost(chain: Bridge[]): number {
  const serverHops = chain.filter((b) => b.runtime === "server").length;
  const worst = chain.reduce((acc, b) => Math.max(acc, FIDELITY_RANK[b.fidelity]), 0);
  return serverHops * 100 + worst * 10 + chain.length;
}

function worstFidelity(steps: Step[]): Fidelity {
  let worst: Fidelity = "exact";
  for (const step of steps) {
    if (FIDELITY_RANK[step.fidelity] > FIDELITY_RANK[worst]) worst = step.fidelity;
  }
  return worst;
}

/**
 * Resolve a single route, or null when the pair genuinely cannot be done.
 *
 * Null is a real answer here and the UI should say so plainly. Silently
 * producing a broken file is the failure mode this whole design exists to
 * avoid.
 */
export function route(fromId: string, toId: string, options: RouteOptions = {}): Route | null {
  const allowServer = options.allowServer ?? true;
  const from = getFormat(fromId);
  const to = getFormat(toId);
  if (!from || !to) return null;
  if (!from.decode || !to.encode) return null;
  if (!allowServer && (from.decode === "server" || to.encode === "server")) return null;

  const path = findPath(from.hub, to.hub, allowServer);
  if (!path) return null;

  const steps: Step[] = [
    { kind: "decode", runtime: from.decode, fidelity: "exact", label: `Read ${from.label}`, note: from.note },
    ...path.map(
      (b): Step => ({
        kind: "bridge",
        runtime: b.runtime,
        fidelity: b.fidelity,
        label: `${b.from} → ${b.to}`,
        note: b.note,
      })
    ),
    { kind: "encode", runtime: to.encode, fidelity: "exact", label: `Write ${to.label}`, note: to.note },
  ];

  return {
    from,
    to,
    steps,
    runtime: steps.some((s) => s.runtime === "server") ? "server" : "device",
    fidelity: worstFidelity(steps),
    notes: steps.map((s) => s.note).filter((n): n is string => Boolean(n)),
  };
}

export interface Plan {
  /** What we will actually run. Device whenever one exists. */
  best: Route | null;
  /**
   * A server route that is strictly more faithful than `best`, when one exists.
   * This is what powers "we can do better, but the file leaves your device" —
   * an offer the user accepts, never a silent upgrade.
   */
  upgrade: Route | null;
}

/**
 * Plan a conversion the way the UI needs it: what runs now, and what the user
 * could opt into.
 */
export function plan(fromId: string, toId: string): Plan {
  const device = route(fromId, toId, { allowServer: false });
  const anywhere = route(fromId, toId, { allowServer: true });

  if (!device) return { best: anywhere, upgrade: null };

  const better =
    anywhere &&
    anywhere.runtime === "server" &&
    FIDELITY_RANK[anywhere.fidelity] < FIDELITY_RANK[device.fidelity];

  return { best: device, upgrade: better ? anywhere : null };
}

/** Every target reachable from a source, for populating the picker. */
export function targetsFrom(fromId: string): string[] {
  if (!getFormat(fromId)?.decode) return [];
  return FORMATS.map((f) => f.id).filter(
    (id) => id !== fromId && plan(fromId, id).best !== null
  );
}
