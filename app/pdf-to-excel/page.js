import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { PDF_TO_EXCEL_FAQS } from "@/features/pdf-to-excel/content/faqs";

import PdfToExcelFeature from "@/features/pdf-to-excel";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-excel");
}

export default function Page() {
  const faqSchemaItems = PDF_TO_EXCEL_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/pdf-to-excel/#webpage",
        "url": "https://www.snapfreetools.com/pdf-to-excel",
        "name": "PDF to Excel Converter Online Free – Convert PDF Tables to Excel | SnapFreeTools",
        "description": "Convert PDF tables to editable Excel spreadsheets online for free. Extract structured tables from PDF files directly in your browser with privacy-first client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-to-excel/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-to-excel/#breadcrumb",
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
            "name": "PDF to Excel Converter",
            "item": "https://www.snapfreetools.com/pdf-to-excel"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/pdf-to-excel/#software",
        "name": "PDF to Excel Converter",
        "url": "https://www.snapfreetools.com/pdf-to-excel",
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
        "@id": "https://www.snapfreetools.com/pdf-to-excel/#faqpage",
        "mainEntity": faqSchemaItems
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <PdfToExcelFeature />
      </Suspense>
    </>
  );
}
