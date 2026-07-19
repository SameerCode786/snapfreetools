import { generatePageMetadata } from "@/seo/metadata";
import TermsFeature from "@/features/terms";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("terms");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://snapfreetools.com/terms/#webpage",
        "url": "https://snapfreetools.com/terms",
        "name": "Terms of Use | SnapFreeTools",
        "description": "Read the Terms of Use for SnapFreeTools. Understand permitted use, browser-side processing, file responsibility, intellectual property, and service limitations.",
        "dateModified": "2026-07-18",
        "isPartOf": {
          "@id": "https://snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://snapfreetools.com/terms/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Terms of Use",
            "item": "https://snapfreetools.com/terms"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="terms-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsFeature />
    </>
  );
}
