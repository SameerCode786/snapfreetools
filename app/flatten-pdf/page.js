import FlattenPdfFeature from "@/features/flatten-pdf";
import { FLATTEN_PDF_FAQS } from "@/features/flatten-pdf/content/faqs";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Flatten PDF Online Free — Flatten PDF Forms & Annotations",
  description:
    "Flatten PDF files online free inside your browser. Bake interactive PDF form fields and annotations into static document content without file uploads.",
  alternates: {
    canonical: "https://www.snapfreetools.com/flatten-pdf",
  },
  openGraph: {
    title: "Flatten PDF Online Free — Flatten PDF Forms & Annotations",
    description:
      "Flatten PDF files online for free. Convert fillable form text fields and interactive annotations into permanent document content with 100% in-browser privacy.",
    url: "https://www.snapfreetools.com/flatten-pdf",
    siteName: "SnapFreeTools",
    type: "website",
  },
};

export default function FlattenPdfPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/flatten-pdf/#software",
        "name": "Flatten PDF Online",
        "url": "https://www.snapfreetools.com/flatten-pdf",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Free online PDF flattening tool. Convert fillable PDF form fields and interactive annotations into static document content directly in your web browser.",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/flatten-pdf/#webpage",
        "url": "https://www.snapfreetools.com/flatten-pdf",
        "name": "Flatten PDF Online Free — Flatten PDF Forms & Annotations",
        "description":
          "Flatten PDF files online free inside your browser. Bake interactive PDF form fields and annotations into static document content without file uploads.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/flatten-pdf/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/flatten-pdf/#breadcrumb",
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
            "name": "Flatten PDF",
            "item": "https://www.snapfreetools.com/flatten-pdf",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/flatten-pdf/#faq",
        "mainEntity": FLATTEN_PDF_FAQS.map((faq) => ({
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
      <FlattenPdfFeature faqs={FLATTEN_PDF_FAQS} />
    </>
  );
}
