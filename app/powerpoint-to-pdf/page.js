import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import PowerPointToPDFFeature from "@/features/powerpoint-to-pdf";
import { FAQS_DATA } from "@/features/powerpoint-to-pdf/content/faqData";

export function generateMetadata() {
  return generatePageMetadata("powerpoint-to-pdf");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree PowerPoint to PDF Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Convert PowerPoint presentations (.pptx) into PDF documents online for free. 100% private in-browser conversion without file uploads."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/powerpoint-to-pdf/#webpage",
        "url": "https://www.snapfreetools.com/powerpoint-to-pdf",
        "name": "PowerPoint to PDF Converter Free – Convert PPTX to PDF | SnapFreeTools",
        "description": "Convert PowerPoint to PDF online for free. Turn PPTX presentations into PDF documents while preserving slide layout and formatting. Fast and easy conversion with SnapFreeTools.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/powerpoint-to-pdf/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/powerpoint-to-pdf/#breadcrumb",
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
            "name": "PowerPoint to PDF",
            "item": "https://www.snapfreetools.com/powerpoint-to-pdf"
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
      <PowerPointToPDFFeature faqs={FAQS_DATA} />
    </>
  );
}
