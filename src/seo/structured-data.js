import React from "react";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "name": "SnapFreeTools",
    "url": "https://www.snapfreetools.com",
    "logo": "https://www.snapfreetools.com/brand/logo.png",
    "description": "SnapFreeTools provides free, accessible online productivity utilities."
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SnapFreeTools",
    "url": "https://www.snapfreetools.com",
    "description": "Free online productivity tools - word counter, image compressor, and more.",
    "publisher": getOrganizationSchema(),
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.snapfreetools.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function getSoftwareApplicationSchema(toolKey) {
  // Find tool in the active live registry
  const tool = ALL_TOOLS.find(t => t.slug === toolKey && t.status === "live" && !t.future);
  if (!tool) return null;

  // Map our categories to schema.org categories
  let category = "UtilitiesApplication";
  if (tool.group === "Calculators") category = "EducationalApplication";
  if (tool.group === "Image Tools") category = "MultimediaApplication";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `SnapFree ${tool.name}`,
    "applicationCategory": category,
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": tool.description
  };
}

export function getFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function JsonLd({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getAboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "SnapFreeTools",
      "url": "https://www.snapfreetools.com",
      "description": "SnapFreeTools provides free, accessible online productivity utilities."
    },
    "name": "About SnapFreeTools",
    "url": "https://www.snapfreetools.com/about",
    "description": "Learn why SnapFreeTools was created and how our free online PDF, calculator, image, and text tools make everyday digital tasks easier."
  };
}

export function getAboutBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.snapfreetools.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": "https://www.snapfreetools.com/about"
      }
    ]
  };
}

