import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { SPLIT_PDF_FAQS } from "@/features/split-pdf/content/faqs";
import SplitPDFFeature from "@/features/split-pdf";

export function generateMetadata() {
  return generatePageMetadata("split-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Split PDF Online",
    "Split PDF files online free. Separate PDF pages, extract page ranges, or split into individual single-page PDFs fast and securely inside your browser.",
    "https://www.snapfreetools.com/split-pdf"
  );
  
  appSchema.applicationCategory = "MultimediaApplication";
  
  const faqSchema = getFAQSchema(SPLIT_PDF_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "Split PDF", url: "https://www.snapfreetools.com/split-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <SplitPDFFeature faqs={SPLIT_PDF_FAQS} />
    </>
  );
}
