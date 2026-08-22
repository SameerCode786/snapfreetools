import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

/**
 * Safely extracts only the valid calculators from the global tools registry.
 */
export const getCalculatorsList = () => {
  if (!ALL_TOOLS || !Array.isArray(ALL_TOOLS)) return [];

  return ALL_TOOLS.filter((tool) => {
    // Only return tools that explicitly belong to the "Calculators" group
    return tool?.group === "Calculators";
  }).map((tool) => ({
    // Create a safe object with fallbacks
    id: tool.id || "",
    name: tool.name || "Calculator",
    slug: tool.slug || "",
    group: tool.group || "Calculators",
    category: tool.category || "Other",
    description: tool.description || "",
    icon: tool.icon || "Calculator",
    featured: Boolean(tool.featured),
    popular: Boolean(tool.popular),
    status: tool.status || "coming-soon",
    future: Boolean(tool.future),
  }));
};

/**
 * Dynamically derives unique categories from the current calculators in the registry.
 */
export const getCalculatorCategories = (calculators) => {
  if (!calculators || !Array.isArray(calculators)) return ["All"];

  const categoriesSet = new Set();
  calculators.forEach((calc) => {
    if (calc.category) {
      categoriesSet.add(calc.category);
    }
  });

  // Sort them naturally if needed, or return as an array with "All" at the beginning
  const uniqueCategories = Array.from(categoriesSet).sort();
  return ["All", ...uniqueCategories];
};

/**
 * Filters calculators based on search query and selected category.
 */
export const filterCalculators = (calculators, query, category) => {
  if (!calculators || !Array.isArray(calculators)) return [];

  const lowerQuery = (query || "").toLowerCase().trim();
  
  return calculators.filter((calc) => {
    // Check search term
    const matchesQuery = lowerQuery === "" 
      || (calc.name || "").toLowerCase().includes(lowerQuery)
      || (calc.description || "").toLowerCase().includes(lowerQuery)
      || (calc.category || "").toLowerCase().includes(lowerQuery);

    // Check category
    const matchesCategory = category === "All" || calc.category === category;

    return matchesQuery && matchesCategory;
  });
};
