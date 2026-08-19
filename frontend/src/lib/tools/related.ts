import { tools, getToolsByCategory, categories } from "./registry";
import { isIndexable } from "./content";
import type { Tool, ToolCategoryId } from "./types";

/**
 * Internal-link graph for tool pages.
 *
 * Measured against the market: iLovePDF and Smallpdf surface 30–40 internal
 * tool links per page; we surfaced 12. Internal links are how crawl equity
 * moves around a site and how new pages get discovered, so this is one of the
 * cheapest structural wins available — no new content required.
 *
 * The ordering rule matters more than the count. Pages carrying `noindex` still
 * pass equity (they are `noindex, follow`), but equity that lands on them is
 * spent on a page that can never rank. So every list below puts INDEXABLE tools
 * first and uses the rest only as filler. As more tools gain hand-written
 * content, links reorganise around them automatically.
 */

/** Indexable tools first, original order preserved within each group. */
function indexableFirst(list: Tool[]): Tool[] {
  return [...list.filter((t) => isIndexable(t.slug)), ...list.filter((t) => !isIndexable(t.slug))];
}

/** Same-category siblings — the strongest topical signal. */
export function getSiblingTools(tool: Tool, limit = 8): Tool[] {
  return indexableFirst(
    getToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug)
  ).slice(0, limit);
}

/**
 * A spread of tools from OTHER categories, sampled evenly rather than taken
 * from whichever category happens to sort first. An even spread keeps every
 * category reachable within two clicks of any tool page, which is what stops
 * sections of the site becoming orphaned.
 */
export function getCrossCategoryTools(tool: Tool, perCategory = 3): { category: string; slug: string; tools: Tool[] }[] {
  return categories
    .filter((c) => c.id !== tool.category)
    .map((c) => ({
      category: c.name,
      slug: c.slug,
      tools: indexableFirst(getToolsByCategory(c.id as ToolCategoryId)).slice(0, perCategory),
    }))
    .filter((group) => group.tools.length > 0);
}

/**
 * Featured tools, used on category hubs. Falls back to indexable tools so the
 * block is never empty on a category where nothing is flagged featured.
 */
export function getFeaturedTools(limit = 8): Tool[] {
  const featured = tools.filter((t) => t.featured && isIndexable(t.slug));
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = tools.filter((t) => isIndexable(t.slug) && !featured.includes(t));
  return [...featured, ...rest].slice(0, limit);
}
