import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import EditPdfMetadataFeature from "@/features/edit-pdf-metadata";
import { FAQS_DATA } from "@/features/edit-pdf-metadata/content/educationalContent";

export function generateMetadata() {
  return generatePageMetadata("edit-pdf-metadata");
}

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree Edit PDF Metadata",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Edit PDF metadata online free inside your browser. Change PDF title, author, subject, keywords, creator and document properties instantly without server uploads."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/edit-pdf-metadata/#webpage",
        "url": "https://www.snapfreetools.com/edit-pdf-metadata",
        "name": "Edit PDF Metadata Online Free - Change PDF Properties | SnapFreeTools",
        "description": "Edit PDF metadata online free inside your browser. Change PDF title, author, subject, keywords, creator and document properties instantly without server uploads.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/edit-pdf-metadata/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/edit-pdf-metadata/#breadcrumb",
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
            "name": "Edit PDF Metadata",
            "item": "https://www.snapfreetools.com/edit-pdf-metadata"
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
      <EditPdfMetadataFeature />
    </>
  );
}
