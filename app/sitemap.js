export default async function sitemap() {
  const baseUrl = "https://snapfreetools.com";
  
  const coreRoutes = [
    "",
    "/about",
    "/contact",
    "/calculators",
    "/gpa-calculator",
    "/cgpa-calculator",
    "/sgpa-calculator",
    "/gpa-to-percentage",
    "/percentage-to-gpa",
    "/required-gpa-calculator",
    "/final-grade-calculator",
    "/merit-calculator",
    "/image-compressor",
    "/word-counter",
    "/pdf-to-word",
    "/pdf-tools"
  ];

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
