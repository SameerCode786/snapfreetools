import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { ORGANIZE_PDF_FAQS } from "@/features/organize-pdf/content/faqs";

import OrganizePDFFeature from "@/features/organize-pdf";

export function generateMetadata() {
  return generatePageMetadata("organize-pdf");
}

export default function Page() {
  const faqSchemaItems = ORGANIZE_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/organize-pdf/#webpage",
        "url": "https://www.snapfreetools.com/organize-pdf",
        "name": "Organize & Reorder PDF Pages Online Free",
        "description": "Organize and reorder PDF pages online free. Drag and drop PDF page thumbnails to rearrange page sequence in your browser without rasterizing or losing text quality.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/organize-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/organize-pdf/#breadcrumb",
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
            "name": "Organize & Reorder PDF Pages",
            "item": "https://www.snapfreetools.com/organize-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/organize-pdf/#software",
        "name": "Organize PDF Pages",
        "url": "https://www.snapfreetools.com/organize-pdf",
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
        "@id": "https://www.snapfreetools.com/organize-pdf/#faqpage",
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
        <OrganizePDFFeature />
      </Suspense>
    </>
  );
}
