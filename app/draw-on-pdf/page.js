import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { DRAW_PDF_FAQS } from "@/features/draw-on-pdf/content/faqs";

import DrawPdfFeature from "@/features/draw-on-pdf";

export function generateMetadata() {
  return generatePageMetadata("draw-on-pdf");
}

export default function Page() {
  const faqSchemaItems = DRAW_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/draw-on-pdf/#webpage",
        "url": "https://www.snapfreetools.com/draw-on-pdf",
        "name": "Draw on PDF Online Free - Annotate PDF Pages | SnapFreeTools",
        "description": "Draw on PDF files online for free. Add freehand drawings, highlights, shapes, arrows, and text annotations directly to PDF pages in your browser with private client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/draw-on-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/draw-on-pdf/#breadcrumb",
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
            "name": "Draw on PDF",
            "item": "https://www.snapfreetools.com/draw-on-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/draw-on-pdf/#software",
        "name": "Draw on PDF",
        "url": "https://www.snapfreetools.com/draw-on-pdf",
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
        "@id": "https://www.snapfreetools.com/draw-on-pdf/#faqpage",
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
        <DrawPdfFeature />
      </Suspense>
    </>
  );
}
