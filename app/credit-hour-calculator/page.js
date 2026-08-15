import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { CREDIT_HOUR_CALCULATOR_FAQS } from "@/features/calculators/student-admission/credit-hour-calculator/content/faqs";
import CreditHourCalculatorFeature from "@/features/calculators/student-admission/credit-hour-calculator";

export function generateMetadata() {
  return generatePageMetadata("credit-hour-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "SnapFree Credit Hour Calculator",
    "Calculate your total college credit hours, semester workload, and track your degree progress instantly.",
    "https://www.snapfreetools.com/credit-hour-calculator"
  );
  
  const faqSchema = getFAQSchema(CREDIT_HOUR_CALCULATOR_FAQS);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <CreditHourCalculatorFeature faqs={CREDIT_HOUR_CALCULATOR_FAQS} />
    </>
  );
}
