import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { ROTATE_PDF_FAQS } from "@/features/rotate-pdf/content/faqs";

import RotatePDFFeature from "@/features/rotate-pdf";

export function generateMetadata() {
  return generatePageMetadata("rotate-pdf");
}

export default function Page() {
  const faqSchemaItems = ROTATE_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/rotate-pdf/#webpage",
        "url": "https://www.snapfreetools.com/rotate-pdf",
        "name": "Rotate PDF Online Free – Rotate PDF Pages",
        "description": "Rotate PDF pages online for free. Rotate all pages or individual pages by 90, 180, or 270 degrees in your browser without rasterizing or losing text quality.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/rotate-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/rotate-pdf/#breadcrumb",
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
            "name": "Rotate PDF",
            "item": "https://www.snapfreetools.com/rotate-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/rotate-pdf/#software",
        "name": "Rotate PDF",
        "url": "https://www.snapfreetools.com/rotate-pdf",
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
        "@id": "https://www.snapfreetools.com/rotate-pdf/#faqpage",
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
        <RotatePDFFeature />
      </Suspense>
    </>
  );
}
