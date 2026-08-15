import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { ADMISSION_CALCULATOR_FAQS } from "@/features/calculators/student-admission/admission-calculator/content/faqs";
import AdmissionCalculatorFeature from "@/features/calculators/student-admission/admission-calculator";

export function generateMetadata() {
  return generatePageMetadata("admission-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "SnapFree Admission Calculator",
    "Calculate your university admission aggregate and merit percentage instantly. Plan target scores with our what-if simulator for entry tests.",
    "https://www.snapfreetools.com/admission-calculator"
  );
  
  const faqSchema = getFAQSchema(ADMISSION_CALCULATOR_FAQS);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <AdmissionCalculatorFeature faqs={ADMISSION_CALCULATOR_FAQS} />
    </>
  );
}
