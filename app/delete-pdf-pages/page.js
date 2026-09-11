import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { DELETE_PDF_FAQS } from "@/features/delete-pdf-pages/content/faqs";

import DeletePDFFeature from "@/features/delete-pdf-pages";

export function generateMetadata() {
  return generatePageMetadata("delete-pdf-pages");
}

export default function Page() {
  const faqSchemaItems = DELETE_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/delete-pdf-pages/#webpage",
        "url": "https://www.snapfreetools.com/delete-pdf-pages",
        "name": "Delete PDF Pages Online Free – Remove Pages from PDF",
        "description": "Delete pages from PDF online free. Select and remove unwanted pages from your PDF document instantly in your browser without rasterizing or losing text quality.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/delete-pdf-pages/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/delete-pdf-pages/#breadcrumb",
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
            "name": "Delete PDF Pages",
            "item": "https://www.snapfreetools.com/delete-pdf-pages"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/delete-pdf-pages/#software",
        "name": "Delete PDF Pages",
        "url": "https://www.snapfreetools.com/delete-pdf-pages",
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
        "@id": "https://www.snapfreetools.com/delete-pdf-pages/#faqpage",
        "mainEntity": faqSchemaItems
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <DeletePDFFeature />
      </Suspense>
    </>
  );
}
