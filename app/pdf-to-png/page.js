import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { PDF_TO_PNG_FAQS } from "@/features/pdf-to-png/content/faqs";

import PdfToPngFeature from "@/features/pdf-to-png";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-png");
}

export default function Page() {
  const faqSchemaItems = PDF_TO_PNG_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/pdf-to-png/#webpage",
        "url": "https://www.snapfreetools.com/pdf-to-png",
        "name": "PDF to PNG Converter Free – Convert PDF to PNG Online | SnapFreeTools",
        "description": "Convert PDF pages into high-quality PNG images online for free. Convert selected or all PDF pages directly in your browser with private client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-to-png/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-to-png/#breadcrumb",
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
            "name": "PDF to PNG",
            "item": "https://www.snapfreetools.com/pdf-to-png"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/pdf-to-png/#software",
        "name": "PDF to PNG Converter",
        "url": "https://www.snapfreetools.com/pdf-to-png",
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
        "@id": "https://www.snapfreetools.com/pdf-to-png/#faqpage",
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
        <PdfToPngFeature />
      </Suspense>
    </>
  );
}
