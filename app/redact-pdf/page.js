import RedactPdfFeature from "@/features/redact-pdf";
import { REDACT_PDF_FAQS } from "@/features/redact-pdf/content/faqs";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Redact PDF Online Free — Permanently Black Out PDF Text",
  description:
    "Redact PDF files online free inside your browser. Permanently remove and black out sensitive information, text, and data from PDF documents with 100% privacy.",
  alternates: {
    canonical: "https://www.snapfreetools.com/redact-pdf",
  },
  openGraph: {
    title: "Redact PDF Online Free — Permanently Black Out PDF Text",
    description:
      "Redact PDF files online free. Remove and black out confidential text, numbers, and images permanently inside your web browser without file uploads.",
    url: "https://www.snapfreetools.com/redact-pdf",
    siteName: "SnapFreeTools",
    type: "website",
  },
};

export default function RedactPdfPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/redact-pdf/#software",
        "name": "Redact PDF Online",
        "url": "https://www.snapfreetools.com/redact-pdf",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Free online PDF redaction tool. Permanently black out and remove sensitive text, private numbers, and confidential data directly in your web browser.",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/redact-pdf/#webpage",
        "url": "https://www.snapfreetools.com/redact-pdf",
        "name": "Redact PDF Online Free — Permanently Black Out PDF Text",
        "description":
          "Redact PDF files online free inside your browser. Permanently remove and black out sensitive information, text, and data from PDF documents with 100% privacy.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/redact-pdf/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/redact-pdf/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PDF Tools",
            "item": "https://www.snapfreetools.com/pdf-tools",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Redact PDF",
            "item": "https://www.snapfreetools.com/redact-pdf",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/redact-pdf/#faq",
        "mainEntity": REDACT_PDF_FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd schema={schema} />
      <RedactPdfFeature faqs={REDACT_PDF_FAQS} />
    </>
  );
}
