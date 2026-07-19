import { generatePageMetadata } from "@/seo/metadata";
import PrivacyPolicyFeature from "@/features/privacy-policy";
import Script from "next/script";

export function generateMetadata() {
  return generatePageMetadata("privacy-policy");
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://snapfreetools.com/privacy-policy/#webpage",
        "url": "https://snapfreetools.com/privacy-policy",
        "name": "Privacy Policy | SnapFreeTools",
        "description": "Read how SnapFreeTools handles browser-based tool data, contact information, cookies, analytics, advertising technologies, security, retention, and user privacy choices.",
        "dateModified": "2026-07-18",
        "isPartOf": {
          "@id": "https://snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://snapfreetools.com/privacy-policy/#breadcrumb",
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
            "name": "Privacy Policy",
            "item": "https://snapfreetools.com/privacy-policy"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="privacy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicyFeature />
    </>
  );
}
