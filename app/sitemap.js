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
    "/tools",
    "/ai-tools",
    "/about",
    "/contact",
    "/calculators",
    "/pdf-tools",
    "/blog",
    ...toolRoutes
  ]));

  // Dedicated academic guides and grading scale documentation
  const academicGuideRoutes = [
    "/how-to-calculate-gpa",
    "/what-is-gpa",
    "/what-is-a-good-gpa",
    "/gpa-vs-cgpa",
    "/cgpa-to-percentage-formula"
  ];

  // Pre-rendered university-specific calculator scale pages
  const universityCalculatorRoutes = [
    "/gpa-calculator/fast",
    "/gpa-calculator/nust",
    "/gpa-calculator/comsats",
    "/gpa-calculator/uet",
    "/gpa-calculator/lums",
    "/gpa-calculator/pakistan",
    "/merit-calculator/fast",
    "/merit-calculator/nust",
    "/merit-calculator/comsats",
    "/merit-calculator/uet"
  ];

  // Key educational and comparative resource hubs
  const resourceHubRoutes = [
    "/guides",
    "/faqs",
    "/comparisons"
  ];

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
    ...academicGuideRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    })),
    ...universityCalculatorRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    })),
    ...resourceHubRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
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
