import { Suspense } from "react";
import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { SIGN_PDF_FAQS } from "@/features/sign-pdf/content/faqs";

import SignPdfFeature from "@/features/sign-pdf";

export function generateMetadata() {
  return generatePageMetadata("sign-pdf");
}

export default function Page() {
  const faqSchemaItems = SIGN_PDF_FAQS.map((faq) => ({
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
        "@id": "https://www.snapfreetools.com/sign-pdf/#webpage",
        "url": "https://www.snapfreetools.com/sign-pdf",
        "name": "Sign PDF Online Free – Add Your Signature to PDF | SnapFreeTools",
        "description": "Sign PDF documents online for free. Draw, type, or upload your electronic signature and place it on any PDF page. 100% private in-browser processing without file uploads.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/sign-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/sign-pdf/#breadcrumb",
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
            "name": "Sign PDF",
            "item": "https://www.snapfreetools.com/sign-pdf"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/sign-pdf/#software",
        "name": "Sign PDF",
        "url": "https://www.snapfreetools.com/sign-pdf",
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
        "@id": "https://www.snapfreetools.com/sign-pdf/#faqpage",
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
        <SignPdfFeature />
      </Suspense>
    </>
  );
}
