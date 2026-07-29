import { generatePageMetadata } from "@/seo/metadata";
import DisclaimerFeature from "@/features/disclaimer";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("disclaimer");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/disclaimer/#webpage",
        "url": "https://www.snapfreetools.com/disclaimer",
        "name": "Disclaimer | SnapFreeTools",
        "description": "Read the SnapFreeTools Disclaimer covering calculator estimates, PDF and OCR limitations, image processing, user responsibility, and important result verification.",
        "dateModified": "2026-07-19",
        "isPartOf": {
          "@id": "https://www.snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/disclaimer/#breadcrumb",
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
            "name": "Disclaimer",
            "item": "https://www.snapfreetools.com/disclaimer"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="disclaimer-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DisclaimerFeature />
    </>
  );
}
