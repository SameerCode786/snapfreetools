import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { RESIZE_PDF_FAQS } from "@/features/resize-pdf/content/faqs";

import ResizePdfFeature from "@/features/resize-pdf";

export function generateMetadata() {
  return generatePageMetadata("resize-pdf");
}

export default function Page() {
  const faqSchemaItems = RESIZE_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/resize-pdf/#webpage",
        "url": "https://www.snapfreetools.com/resize-pdf",
        "name": "Resize PDF Pages Online — Change PDF Page Size Free | SnapFreeTools",
        "description": "Resize PDF pages to A4, Letter, Legal, A3 and custom dimensions. Fit, keep, or stretch content directly in your browser with private client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/resize-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/resize-pdf/#breadcrumb",
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
            "name": "Resize PDF Pages",
            "item": "https://www.snapfreetools.com/resize-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/resize-pdf/#software",
        "name": "Resize PDF Pages (Advanced)",
        "url": "https://www.snapfreetools.com/resize-pdf",
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
        "@id": "https://www.snapfreetools.com/resize-pdf/#faqpage",
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
        <ResizePdfFeature />
      </Suspense>
    </>
  );
}
