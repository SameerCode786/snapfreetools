import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import PDFToTextFeature from "@/features/pdf-to-text";
import { FAQS_DATA } from "@/features/pdf-to-text/content/educationalContent";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-text");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree PDF to Text Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Extract text from PDF files online free inside your browser. Convert PDF to plain text (.txt) instantly without uploads, registration, or file limits."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/pdf-to-text/#webpage",
        "url": "https://www.snapfreetools.com/pdf-to-text",
        "name": "PDF to Text Converter - Extract Text from PDF Online Free | SnapFreeTools",
        "description": "Extract text from PDF files online free inside your browser. Convert PDF to plain text (.txt) instantly without uploads, registration, or file limits.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-to-text/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-to-text/#breadcrumb",
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
            "name": "PDF to Text",
            "item": "https://www.snapfreetools.com/pdf-to-text"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_DATA.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <PDFToTextFeature faqs={FAQS_DATA} />
    </>
  );
}
