import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { FAQS_DATA } from "@/features/faqs/data/faqs";

import FaqsFeature from "@/features/faqs";

export function generateMetadata() {
  return generatePageMetadata("faqs");
}

export default function Page() {
  const faqSchemaItems = FAQS_DATA.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/faqs/#webpage",
        "url": "https://www.snapfreetools.com/faqs",
        "name": "FAQs & Help Center | SnapFreeTools",
        "description": "Find quick answers about SnapFreeTools, privacy, client-side file processing, PDF tools, image tools, converters, supported formats, and troubleshooting.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/faqs/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/faqs/#breadcrumb",
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
            "name": "FAQs",
            "item": "https://www.snapfreetools.com/faqs"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/faqs/#faqpage",
        "mainEntity": faqSchemaItems
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
        <FaqsFeature />
      </Suspense>
    </>
  );
}
