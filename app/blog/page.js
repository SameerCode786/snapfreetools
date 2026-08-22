import React from "react";
import BlogHubFeature from "@/features/blog";
import { METADATA_CONFIG } from "@/seo/metadata";
import { 
  JsonLd, 
  getFAQSchema
} from "@/seo/structured-data";
import { 
  getCollectionPageSchema, 
  getBreadcrumbSchema 
} from "@/features/blog/utils/seoHelpers";
import { BLOG_HUB_FAQS } from "@/features/blog/content/faqs";

export const metadata = {
  title: METADATA_CONFIG["blog"].title,
  description: METADATA_CONFIG["blog"].description,
  keywords: METADATA_CONFIG["blog"].keywords,
  alternates: {
    canonical: `https://www.snapfreetools.com${METADATA_CONFIG["blog"].path}`,
  },
  openGraph: {
    title: METADATA_CONFIG["blog"].title,
    description: METADATA_CONFIG["blog"].description,
    url: `https://www.snapfreetools.com${METADATA_CONFIG["blog"].path}`,
    type: "website",
  }
};

export default function BlogHubPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Blog", url: "https://www.snapfreetools.com/blog" }
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const collectionSchema = getCollectionPageSchema(
    METADATA_CONFIG["blog"].title,
    METADATA_CONFIG["blog"].description,
    `https://www.snapfreetools.com${METADATA_CONFIG["blog"].path}`
  );
  const faqSchema = getFAQSchema(BLOG_HUB_FAQS);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={collectionSchema} />
      <JsonLd schema={faqSchema} />
      <BlogHubFeature />
    </main>
  );
}
