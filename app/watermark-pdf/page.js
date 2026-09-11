import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { WATERMARK_PDF_FAQS } from "@/features/watermark-pdf/content/faqs";

import WatermarkPDFFeature from "@/features/watermark-pdf";

export function generateMetadata() {
  return generatePageMetadata("watermark-pdf");
}

export default function Page() {
  const faqSchemaItems = WATERMARK_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/watermark-pdf/#webpage",
        "url": "https://www.snapfreetools.com/watermark-pdf",
        "name": "Watermark PDF Online Free – Add Text & Logo Watermarks",
        "description": "Stamp text or logo watermarks onto PDF pages online for free. Custom opacity, font size, rotation, and position in your browser with zero quality loss.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/watermark-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/watermark-pdf/#breadcrumb",
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
            "name": "Watermark PDF",
            "item": "https://www.snapfreetools.com/watermark-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/watermark-pdf/#software",
        "name": "Watermark PDF",
        "url": "https://www.snapfreetools.com/watermark-pdf",
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
        "@id": "https://www.snapfreetools.com/watermark-pdf/#faqpage",
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
        <WatermarkPDFFeature />
      </Suspense>
    </>
  );
}
