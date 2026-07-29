import { generatePageMetadata } from "@/seo/metadata";
import AdvertisingDisclosureFeature from "@/features/advertising-disclosure";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("advertising-disclosure");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/advertising-disclosure/#webpage",
        "url": "https://www.snapfreetools.com/advertising-disclosure",
        "name": "Advertising Disclosure | SnapFreeTools",
        "description": "Learn about advertising transparency on SnapFreeTools. Read about planned Google AdSense integration, editorial independence, and user privacy choices.",
        "dateModified": "2026-07-19",
        "isPartOf": {
          "@id": "https://www.snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/advertising-disclosure/#breadcrumb",
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
            "name": "Advertising Disclosure",
            "item": "https://www.snapfreetools.com/advertising-disclosure"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="advertising-disclosure-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdvertisingDisclosureFeature />
    </>
  );
}
