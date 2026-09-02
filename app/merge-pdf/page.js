import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { MERGE_PDF_FAQS } from "@/features/merge-pdf/content/faqs";
import MergePDFFeature from "@/features/merge-pdf";

export function generateMetadata() {
  return generatePageMetadata("merge-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Merge PDF Online",
    "Merge PDF files online free. Combine multiple PDF documents into a single PDF file quickly and securely inside your browser.",
    "https://www.snapfreetools.com/merge-pdf"
  );
  
  appSchema.applicationCategory = "MultimediaApplication";
  
  const faqSchema = getFAQSchema(MERGE_PDF_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "Merge PDF", url: "https://www.snapfreetools.com/merge-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <MergePDFFeature faqs={MERGE_PDF_FAQS} />
    </>
  );
}
