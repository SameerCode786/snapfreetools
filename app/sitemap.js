import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export default async function sitemap() {
  const baseUrl = "https://www.snapfreetools.com";
  
  // Extract dynamic routes from the registry where status is 'live' and not future
  const toolRoutes = ALL_TOOLS
    .filter(tool => tool.status === "live" && !tool.future)
    .map(tool => `/${tool.slug}`);

  // Need to ensure unique routes just in case
  const coreRoutes = Array.from(new Set([
    "",
    "/about",
    "/contact",
    "/calculators",
    "/pdf-tools",
    ...toolRoutes
  ]));

  const legalRoutes = [
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
    "/disclaimer",
    "/advertising-disclosure",
    "/dmca",
    "/accessibility"
  ];

  const sitemapEntries = [
    ...coreRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1.0 : 0.8
    })),
    ...legalRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    }))
  ];

  return sitemapEntries;
}
