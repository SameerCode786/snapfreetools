import { generatePageMetadata } from "@/seo/metadata";
import CookiePolicyFeature from "@/features/cookie-policy";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("cookie-policy");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/cookie-policy/#webpage",
        "url": "https://www.snapfreetools.com/cookie-policy",
        "name": "Cookie Policy | SnapFreeTools",
        "description": "Learn how SnapFreeTools uses browser storage, cookies, preferences, and how analytics, advertising, Google AdSense, and consent controls may be used in the future.",
        "dateModified": "2026-07-19",
        "isPartOf": {
          "@id": "https://www.snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/cookie-policy/#breadcrumb",
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
            "name": "Cookie Policy",
            "item": "https://www.snapfreetools.com/cookie-policy"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="cookie-policy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CookiePolicyFeature />
    </>
  );
}
