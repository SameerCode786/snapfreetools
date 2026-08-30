import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { JPG_TO_PDF_FAQS } from "@/features/jpg-to-pdf/content/faqs";
import JPGToPDFFeature from "@/features/jpg-to-pdf";

export function generateMetadata() {
  return generatePageMetadata("jpg-to-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "JPG to PDF Converter",
    "Convert JPG, JPEG, and PNG images into a high-quality PDF document locally in your browser. Free, secure, fast, and no file limit.",
    "https://www.snapfreetools.com/jpg-to-pdf"
  );
  appSchema.applicationCategory = "DesignApplication";

  const faqSchema = getFAQSchema(JPG_TO_PDF_FAQS);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "JPG to PDF", url: "https://www.snapfreetools.com/jpg-to-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <JPGToPDFFeature faqs={JPG_TO_PDF_FAQS} />
    </>
  );
}
