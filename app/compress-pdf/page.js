import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { COMPRESS_PDF_FAQS } from "@/features/compress-pdf/content/faqs";
import CompressPDFFeature from "@/features/compress-pdf";

export function generateMetadata() {
  return generatePageMetadata("compress-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Compress PDF Online",
    "Compress PDF files online free. Reduce PDF document file size while preserving selectable text, vector graphics, and original document layout inside your browser.",
    "https://www.snapfreetools.com/compress-pdf"
  );
  
  appSchema.applicationCategory = "UtilitiesApplication";
  
  const faqSchema = getFAQSchema(COMPRESS_PDF_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "Compress PDF", url: "https://www.snapfreetools.com/compress-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <CompressPDFFeature faqs={COMPRESS_PDF_FAQS} />
    </>
  );
}
