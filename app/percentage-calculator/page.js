import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { PERCENTAGE_FAQS } from "@/features/calculators/utility/percentage-calculator/content/faqs";
import PercentageCalculatorFeature from "@/features/calculators/utility/percentage-calculator";

export function generateMetadata() {
  return generatePageMetadata("percentage-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Percentage Calculator & Analysis Suite",
    "Calculate percentages, percentage change, discounts, taxes, and tips easily with our free online percentage calculator.",
    "https://www.snapfreetools.com/percentage-calculator"
  );
  
  appSchema.applicationCategory = "UtilityApplication";
  
  const faqSchema = getFAQSchema(PERCENTAGE_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "Percentage Calculator", url: "https://www.snapfreetools.com/percentage-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <PercentageCalculatorFeature faqs={PERCENTAGE_FAQS} />
    </>
  );
}
