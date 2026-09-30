/**
 * Navigation Index Data Layer
 * Provides lightweight navigation selectors and fast pre-indexed query operations for 3,000+ tools.
 * Single source of truth is derived directly from ALL_TOOLS in allToolsRegistry.js.
 */

import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

// Map ALL_TOOLS to include lightweight navigation defaults
export const NAVIGATION_ITEMS = ALL_TOOLS.map((tool) => ({
  id: tool.id,
  name: tool.name,
  slug: tool.slug,
  ecosystem: tool.ecosystem || "utility",
  group: tool.group || "Utilities",
  category: tool.category || "General",
  subcategory: tool.subcategory || tool.category || "General",
  description: tool.description || "",
  icon: tool.icon || "FileText",
  featured: Boolean(tool.featured),
  popular: Boolean(tool.popular),
  status: tool.status || "live",
  future: Boolean(tool.future),
  tags: Array.isArray(tool.tags) ? tool.tags : [],
}));

/**
 * Precomputed live tool count map by group for fast O(1) count queries.
 */
const LIVE_TOOL_COUNTS_BY_GROUP = NAVIGATION_ITEMS.reduce((acc, item) => {
  if (item.status === "live" && !item.future) {
    acc[item.group] = (acc[item.group] || 0) + 1;
  }
  return acc;
}, {});

/**
 * Fast O(1) selector for live tools count for a given group.
 */
export function getLiveToolsCountForGroup(group) {
  return LIVE_TOOL_COUNTS_BY_GROUP[group] || 0;
}

/**
 * Returns all live, non-future tools.
 */
export function getLiveTools() {
  return NAVIGATION_ITEMS.filter((item) => item.status === "live" && !item.future);
}

/**
 * Returns live tools filtered by ecosystem ("utility" | "ai").
 */
export function getToolsByEcosystem(ecosystem = "utility") {
  return NAVIGATION_ITEMS.filter(
    (item) => item.ecosystem === ecosystem && item.status === "live" && !item.future
  );
}

/**
 * Returns unique groups present for a given ecosystem.
 */
export function getGroupsByEcosystem(ecosystem = "utility") {
  const tools = getToolsByEcosystem(ecosystem);
  const groups = Array.from(new Set(tools.map((t) => t.group)));
  return groups;
}

/**
 * Returns unique subcategories for a given group.
 */
export function getSubcategoriesByGroup(group) {
  const tools = NAVIGATION_ITEMS.filter((item) => item.group === group);
  return Array.from(new Set(tools.map((t) => t.subcategory)));
}

/**
 * Returns a curated list of live tools for a group (capped at limit, default 16).
 * Prioritizes popular and featured tools first.
 */
export function getCuratedToolsForGroup(group, limit = 16) {
  const tools = NAVIGATION_ITEMS.filter(
    (item) => item.group === group && item.status === "live" && !item.future
  );

  // Sort by popular/featured first
  const sorted = [...tools].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  return sorted.slice(0, limit);
}

/**
 * Returns top curated tools for a subcategory (capped at limit, default 6).
 */
export function getCuratedToolsForSubcategory(group, subcategory, limit = 6) {
  const tools = NAVIGATION_ITEMS.filter(
    (item) =>
      item.group === group &&
      item.subcategory === subcategory &&
      item.status === "live" &&
      !item.future
  );

  const sorted = [...tools].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.name.localeCompare(b.name);
  });

  return sorted.slice(0, limit);
}

/**
 * Returns the top featured tool for a group.
 */
export function getFeaturedToolForGroup(group) {
  return (
    NAVIGATION_ITEMS.find((t) => t.group === group && t.featured && t.status === "live") ||
    NAVIGATION_ITEMS.find((t) => t.group === group && t.status === "live") ||
    null
  );
}

/**
 * Instant indexed search query method.
 * Searches name, slug, group, category, subcategory, description, and tags.
 * Returns up to limit (default 8) matching live tool entries.
 */
export function searchToolsIndex(query = "", limit = 8) {
  if (!query || typeof query !== "string" || !query.trim()) {
    return [];
  }

  const q = query.trim().toLowerCase();
  const liveTools = getLiveTools();

  const matched = liveTools.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(q);
    const slugMatch = item.slug.toLowerCase().includes(q);
    const groupMatch = item.group.toLowerCase().includes(q);
    const catMatch = item.category.toLowerCase().includes(q);
    const subcatMatch = item.subcategory.toLowerCase().includes(q);
    const descMatch = item.description.toLowerCase().includes(q);
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(q));

    return nameMatch || slugMatch || groupMatch || catMatch || subcatMatch || descMatch || tagMatch;
  });

  return matched.slice(0, limit);
}

export default {
  NAVIGATION_ITEMS,
  getLiveTools,
  getLiveToolsCountForGroup,
  getToolsByEcosystem,
  getGroupsByEcosystem,
  getSubcategoriesByGroup,
  getCuratedToolsForGroup,
  getCuratedToolsForSubcategory,
  getFeaturedToolForGroup,
  searchToolsIndex,
};
