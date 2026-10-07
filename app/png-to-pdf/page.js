import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { PNG_TO_PDF_FAQS } from "@/features/png-to-pdf/content/faqs";

import PngToPdfFeature from "@/features/png-to-pdf";

export function generateMetadata() {
  return generatePageMetadata("png-to-pdf");
}

export default function Page() {
  const faqSchemaItems = PNG_TO_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/png-to-pdf/#webpage",
        "url": "https://www.snapfreetools.com/png-to-pdf",
        "name": "PNG to PDF Converter Free – Convert PNG Images to PDF Online | SnapFreeTools",
        "description": "Convert PNG images into a single PDF online for free. Combine multiple PNG files, arrange page order, and choose page sizes directly in your browser.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/png-to-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/png-to-pdf/#breadcrumb",
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
            "name": "PNG to PDF",
            "item": "https://www.snapfreetools.com/png-to-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/png-to-pdf/#software",
        "name": "PNG to PDF Converter",
        "url": "https://www.snapfreetools.com/png-to-pdf",
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
        "@id": "https://www.snapfreetools.com/png-to-pdf/#faqpage",
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
        <PngToPdfFeature faqs={PNG_TO_PDF_FAQS} />
      </Suspense>
    </>
  );
}
