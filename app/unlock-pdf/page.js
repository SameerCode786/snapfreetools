import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { UNLOCK_PDF_FAQS } from "@/features/unlock-pdf/content/faqs";
import UnlockPDFFeature from "@/features/unlock-pdf";

export function generateMetadata() {
  return generatePageMetadata("unlock-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Unlock PDF Online",
    "Unlock PDF files online free. Remove password protection and PDF restrictions securely inside your browser. Fast, private, and 100% client-side.",
    "https://www.snapfreetools.com/unlock-pdf"
  );
  
  appSchema.applicationCategory = "SecurityApplication";
  
  const faqSchema = getFAQSchema(UNLOCK_PDF_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "Unlock PDF", url: "https://www.snapfreetools.com/unlock-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <UnlockPDFFeature faqs={UNLOCK_PDF_FAQS} />
    </>
  );
}
