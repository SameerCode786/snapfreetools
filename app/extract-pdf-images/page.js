import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import ExtractPdfImagesFeature from "@/features/extract-pdf-images";
import { FAQS_DATA } from "@/features/extract-pdf-images/content/educationalContent";

export function generateMetadata() {
  return generatePageMetadata("extract-pdf-images");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree Extract PDF Images",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Extract images from PDF online free inside your browser. Pull embedded photos, logos, and graphics from PDF files instantly as original JPG or PNG files without server uploads."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/extract-pdf-images/#webpage",
        "url": "https://www.snapfreetools.com/extract-pdf-images",
        "name": "Extract Images from PDF Online Free - Save PDF Pictures | SnapFreeTools",
        "description": "Extract images from PDF online free inside your browser. Pull embedded photos, logos, and graphics from PDF files instantly as original JPG or PNG files without server uploads.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/extract-pdf-images/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/extract-pdf-images/#breadcrumb",
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
            "name": "Extract PDF Images",
            "item": "https://www.snapfreetools.com/extract-pdf-images"
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
      <ExtractPdfImagesFeature />
    </>
  );
}
