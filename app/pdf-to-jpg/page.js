import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { PDF_TO_JPG_FAQS } from "@/features/pdf-to-jpg/content/faqs";
import PDFToJPGFeature from "@/features/pdf-to-jpg";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-jpg");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "PDF to JPG Converter",
    "Convert PDF pages into high-quality JPG or JPEG images online free. Extract photos and visuals from PDF files securely.",
    "https://www.snapfreetools.com/pdf-to-jpg"
  );
  
  appSchema.applicationCategory = "MultimediaApplication";
  
  const faqSchema = getFAQSchema(PDF_TO_JPG_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "PDF to JPG", url: "https://www.snapfreetools.com/pdf-to-jpg" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <PDFToJPGFeature faqs={PDF_TO_JPG_FAQS} />
    </>
  );
}
