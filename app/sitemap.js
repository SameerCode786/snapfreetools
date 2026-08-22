import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { BLOG_ARTICLES } from "@/features/blog/data/articles";
import { BLOG_CATEGORIES } from "@/features/blog/data/categories";

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
    "/blog",
    ...toolRoutes
  ]));

  const blogArticleRoutes = BLOG_ARTICLES.map(article => `/blog/${article.slug}`);
  const blogCategoryRoutes = BLOG_CATEGORIES.map(category => `/blog/category/${category.slug}`);

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
    ...blogArticleRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    })),
    ...blogCategoryRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
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
