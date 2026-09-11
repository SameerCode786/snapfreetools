import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { ADD_PAGE_NUMBERS_FAQS } from "@/features/add-page-numbers-pdf/content/faqs";

import AddPageNumbersPDFFeature from "@/features/add-page-numbers-pdf";

export function generateMetadata() {
  return generatePageMetadata("add-page-numbers-pdf");
}

export default function Page() {
  const faqSchemaItems = ADD_PAGE_NUMBERS_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/add-page-numbers-pdf/#webpage",
        "url": "https://www.snapfreetools.com/add-page-numbers-pdf",
        "name": "Add Page Numbers to PDF Online Free | SnapFreeTools",
        "description": "Add page numbers to PDF online free. Custom positions, Page X of Y formats, Roman numerals, cover page skipping, fonts, and colors inside your browser.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/add-page-numbers-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/add-page-numbers-pdf/#breadcrumb",
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
            "name": "Add Page Numbers to PDF",
            "item": "https://www.snapfreetools.com/add-page-numbers-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/add-page-numbers-pdf/#software",
        "name": "Add Page Numbers to PDF",
        "url": "https://www.snapfreetools.com/add-page-numbers-pdf",
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
        "@id": "https://www.snapfreetools.com/add-page-numbers-pdf/#faqpage",
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
        <AddPageNumbersPDFFeature />
      </Suspense>
    </>
  );
}
