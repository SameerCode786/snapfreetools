import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import GuidesFeature from "@/features/guides";

export function generateMetadata() {
  return generatePageMetadata("guides");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/guides/#webpage",
        "url": "https://www.snapfreetools.com/guides",
        "name": "Guides & Resources | SnapFreeTools",
        "description": "Learn how to resize, compress, convert, protect, and manage images, PDFs, and files with practical guides from SnapFreeTools.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/guides/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/guides/#breadcrumb",
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
            "name": "Guides & Resources",
            "item": "https://www.snapfreetools.com/guides"
          }
        ]
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <GuidesFeature />
      </Suspense>
    </>
  );
}
