import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { COMPARISON_FAQS } from "@/features/comparisons/data/comparisonMetadata";

import ComparisonsFeature from "@/features/comparisons";

export function generateMetadata() {
  return generatePageMetadata("comparisons");
}

export default function Page() {
  const faqSchemaItems = COMPARISON_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/comparisons/#webpage",
        "url": "https://www.snapfreetools.com/comparisons",
        "name": "Tool Comparisons - Compare PDF, Image & Utility Tools | SnapFreeTools",
        "description": "Compare SnapFreeTools tools side by side to find the right PDF, image, text, and utility tool for your needs. Compare features, privacy, formats, and capabilities.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/comparisons/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/comparisons/#breadcrumb",
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
            "name": "Tool Comparisons",
            "item": "https://www.snapfreetools.com/comparisons"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/comparisons/#faqpage",
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
        <ComparisonsFeature />
      </Suspense>
    </>
  );
}
