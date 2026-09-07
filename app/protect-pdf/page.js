import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { PROTECT_PDF_FAQS } from "@/features/protect-pdf/content/faqs";
import ProtectPDFFeature from "@/features/protect-pdf";

export function generateMetadata() {
  return generatePageMetadata("protect-pdf");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Protect PDF Online",
    "Protect PDF files online free. Add strong AES-256 password encryption and restrict permissions for printing, editing, and copying secure documents.",
    "https://www.snapfreetools.com/protect-pdf"
  );

  appSchema.applicationCategory = "SecurityApplication";

  const faqSchema = getFAQSchema(PROTECT_PDF_FAQS);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "PDF Tools", url: "https://www.snapfreetools.com/pdf-tools" },
    { name: "Protect PDF", url: "https://www.snapfreetools.com/protect-pdf" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <ProtectPDFFeature faqs={PROTECT_PDF_FAQS} />
    </>
  );
}



