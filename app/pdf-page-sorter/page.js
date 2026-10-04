import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { PDF_PAGE_SORTER_FAQS } from "@/features/pdf-page-sorter/content/faqs";

import PdfPageSorterFeature from "@/features/pdf-page-sorter";

export function generateMetadata() {
  return generatePageMetadata("pdf-page-sorter");
}

export default function Page() {
  const faqSchemaItems = PDF_PAGE_SORTER_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/pdf-page-sorter/#webpage",
        "url": "https://www.snapfreetools.com/pdf-page-sorter",
        "name": "PDF Page Sorter Free – Sort & Reorder PDF Pages | SnapFreeTools",
        "description": "Sort and reorder PDF pages online for free. Visually drag, drop, and rearrange PDF page order directly in your browser with private client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-page-sorter/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-page-sorter/#breadcrumb",
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
            "name": "PDF Tools",
            "item": "https://www.snapfreetools.com/pdf-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "PDF Page Sorter",
            "item": "https://www.snapfreetools.com/pdf-page-sorter"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/pdf-page-sorter/#software",
        "name": "PDF Page Sorter",
        "url": "https://www.snapfreetools.com/pdf-page-sorter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/pdf-page-sorter/#faqpage",
        "mainEntity": faqSchemaItems
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PdfPageSorterFeature />
      </Suspense>
    </>
  );
}
