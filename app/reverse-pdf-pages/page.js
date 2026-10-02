import ReversePdfFeature from "@/features/reverse-pdf-pages";
import { REVERSE_PDF_FAQS } from "@/features/reverse-pdf-pages/content/faqs";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Reverse PDF Pages Online Free - Reverse PDF Order | SnapFreeTools",
  description:
    "Reverse PDF pages online for free inside your browser. Rearrange a PDF into reverse page order directly with no signup and 100% in-browser privacy.",
  alternates: {
    canonical: "https://www.snapfreetools.com/reverse-pdf-pages",
  },
  openGraph: {
    title: "Reverse PDF Pages Online Free - Reverse PDF Order | SnapFreeTools",
    description:
      "Reverse PDF pages online for free. Rearrange PDF documents into reverse page order with zero quality loss and 100% client-side privacy.",
    url: "https://www.snapfreetools.com/reverse-pdf-pages",
    siteName: "SnapFreeTools",
    type: "website",
  },
};

export default function ReversePdfPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/reverse-pdf-pages/#software",
        "name": "Reverse PDF Pages Online",
        "url": "https://www.snapfreetools.com/reverse-pdf-pages",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Free online PDF page reversal tool. Rearrange PDF pages in reverse order directly in your browser with 100% privacy.",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/reverse-pdf-pages/#webpage",
        "url": "https://www.snapfreetools.com/reverse-pdf-pages",
        "name": "Reverse PDF Pages Online Free - Reverse PDF Order",
        "description":
          "Reverse PDF pages online for free inside your browser. Rearrange a PDF into reverse page order directly with no signup.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/reverse-pdf-pages/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/reverse-pdf-pages/#breadcrumb",
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
            "name": "Reverse PDF Pages",
            "item": "https://www.snapfreetools.com/reverse-pdf-pages",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/reverse-pdf-pages/#faq",
        "mainEntity": REVERSE_PDF_FAQS.map((faq) => ({
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
      <ReversePdfFeature faqs={REVERSE_PDF_FAQS} />
    </>
  );
}
