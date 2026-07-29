import { generatePageMetadata } from "@/seo/metadata";
import DMCAFeature from "@/features/dmca";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("dmca");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/dmca/#webpage",
        "url": "https://www.snapfreetools.com/dmca",
        "name": "DMCA Copyright Policy | SnapFreeTools",
        "description": "Read the SnapFreeTools DMCA Copyright Policy. Learn how we handle copyright complaints, intellectual property notices, and review processes.",
        "dateModified": "2026-07-19",
        "isPartOf": {
          "@id": "https://www.snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/dmca/#breadcrumb",
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
            "name": "DMCA Copyright Policy",
            "item": "https://www.snapfreetools.com/dmca"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="dmca-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DMCAFeature />
    </>
  );
}
