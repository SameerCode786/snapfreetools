import FillPdfFormsFeature from "@/features/fill-pdf-forms";
import { FILL_PDF_FORMS_FAQS } from "@/features/fill-pdf-forms/content/faqs";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Fill PDF Forms Online Free — Complete & Edit PDF Fields",
  description:
    "Fill PDF forms online free inside your browser. Complete fillable PDF text fields, checkboxes, dropdowns, and radio buttons without server uploads.",
  alternates: {
    canonical: "https://www.snapfreetools.com/fill-pdf-forms",
  },
  openGraph: {
    title: "Fill PDF Forms Online Free — Complete & Edit PDF Fields",
    description:
      "Fill PDF forms online free inside your web browser. Complete fillable text fields, check boxes, select dropdowns, and download finished PDF documents.",
    url: "https://www.snapfreetools.com/fill-pdf-forms",
    siteName: "SnapFreeTools",
    type: "website",
  },
};

export default function FillPdfFormsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.snapfreetools.com/fill-pdf-forms/#software",
        "name": "Fill PDF Forms Online",
        "url": "https://www.snapfreetools.com/fill-pdf-forms",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Free online PDF form filling tool. Complete fillable AcroForm text fields, checkboxes, dropdowns, and radio groups directly in your web browser.",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/fill-pdf-forms/#webpage",
        "url": "https://www.snapfreetools.com/fill-pdf-forms",
        "name": "Fill PDF Forms Online Free — Complete & Edit PDF Fields",
        "description":
          "Fill PDF forms online free inside your browser. Complete fillable PDF text fields, checkboxes, dropdowns, and radio buttons without server uploads.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/fill-pdf-forms/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/fill-pdf-forms/#breadcrumb",
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
            "name": "Fill PDF Forms",
            "item": "https://www.snapfreetools.com/fill-pdf-forms",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/fill-pdf-forms/#faq",
        "mainEntity": FILL_PDF_FORMS_FAQS.map((faq) => ({
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
      <FillPdfFormsFeature faqs={FILL_PDF_FORMS_FAQS} />
    </>
  );
}
