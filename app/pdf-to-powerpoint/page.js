import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import PDFToPowerPointFeature from "@/features/pdf-to-powerpoint";
import { FAQS_DATA } from "@/features/pdf-to-powerpoint/content/faqData";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-powerpoint");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree PDF to PowerPoint Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Convert PDF documents into editable or high-fidelity PowerPoint presentation files (.pptx) online for free. 100% private in-browser conversion."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/pdf-to-powerpoint/#webpage",
        "url": "https://www.snapfreetools.com/pdf-to-powerpoint",
        "name": "PDF to PowerPoint Converter Free – Convert PDF to PPTX Online | SnapFreeTools",
        "description": "Convert PDF to PowerPoint online for free. Turn PDF pages into editable or high-fidelity PPTX slides directly in your browser with private client-side processing.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-to-powerpoint/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-to-powerpoint/#breadcrumb",
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
            "name": "PDF to PowerPoint",
            "item": "https://www.snapfreetools.com/pdf-to-powerpoint"
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
      <PDFToPowerPointFeature faqs={FAQS_DATA} />
    </>
  );
}
