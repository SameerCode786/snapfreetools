import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { HTML_TO_PDF_FAQS } from "@/features/html-to-pdf/content/faqs";
import HtmlToPdfFeature from "@/features/html-to-pdf";

export function generateMetadata() {
  return generatePageMetadata("html-to-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "HTML to PDF Converter",
    "Convert public website URLs, raw HTML code, or uploaded .html files into clean PDF documents using our secure Chromium rendering engine.",
    "https://www.snapfreetools.com/html-to-pdf"
  );
  appSchema.applicationCategory = "UtilityApplication";

  const faqSchema = getFAQSchema(HTML_TO_PDF_FAQS);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "HTML to PDF", url: "https://www.snapfreetools.com/html-to-pdf" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.snapfreetools.com/html-to-pdf/#webpage",
    "url": "https://www.snapfreetools.com/html-to-pdf",
    "name": "HTML to PDF Converter Free – Convert Webpages to PDF Online | SnapFreeTools",
    "description": "Convert public website URLs, raw HTML code, or uploaded .html files into clean PDF documents using our secure Chromium rendering engine.",
    "isPartOf": {
      "@id": "https://www.snapfreetools.com/#website"
    }
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <HtmlToPdfFeature faqs={HTML_TO_PDF_FAQS} />
    </>
  );
}
