import ExtractPdfFeature from "@/features/extract-pdf-pages";
import { EXTRACT_PDF_FAQS } from "@/features/extract-pdf-pages/content/faqs";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Extract PDF Pages Online Free - Save Selected Pages | SnapFreeTools",
  description:
    "Extract selected pages from a PDF online for free. Select individual pages or ranges and save them as a new PDF directly in your browser with no upload or signup.",
  alternates: {
    canonical: "https://www.snapfreetools.com/extract-pdf-pages",
  },
  openGraph: {
    title: "Extract PDF Pages Online Free - Save Selected Pages | SnapFreeTools",
    description:
      "Extract selected pages from a PDF online for free. Select individual pages or ranges and save them as a new PDF directly in your browser with no upload or signup.",
    url: "https://www.snapfreetools.com/extract-pdf-pages",
    siteName: "SnapFreeTools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract PDF Pages Online Free - Save Selected Pages | SnapFreeTools",
    description:
      "Extract selected pages from a PDF online for free. Select individual pages or ranges and save them as a new PDF directly in your browser with no upload or signup.",
  },
};

export default function ExtractPdfPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/extract-pdf-pages/#software",
        "name": "Extract PDF Pages Online",
        "url": "https://www.snapfreetools.com/extract-pdf-pages",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Free online PDF page extractor tool. Select individual pages or page ranges and save them into a new PDF document inside your browser with 100% privacy.",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/extract-pdf-pages/#webpage",
        "url": "https://www.snapfreetools.com/extract-pdf-pages",
        "name": "Extract PDF Pages Online Free - Save Selected Pages",
        "description":
          "Extract selected pages from a PDF online for free. Select individual pages or ranges and save them as a new PDF directly in your browser with no upload or signup.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/extract-pdf-pages/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/extract-pdf-pages/#breadcrumb",
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
            "name": "Extract PDF Pages",
            "item": "https://www.snapfreetools.com/extract-pdf-pages",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/extract-pdf-pages/#faq",
        "mainEntity": EXTRACT_PDF_FAQS.map((faq) => ({
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
      <ExtractPdfFeature faqs={EXTRACT_PDF_FAQS} />
    </>
  );
}
