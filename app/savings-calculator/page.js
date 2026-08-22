import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { SAVINGS_FAQS } from "@/features/calculators/financial/savings-calculator/content/faqs";
import SavingsCalculatorSuite from "@/features/calculators/financial/savings-calculator";

export function generateMetadata() {
  return generatePageMetadata("savings-calculator");
}

export default function SavingsCalculatorPage() {
  const appSchema = getSoftwareApplicationSchema(
    "Savings Calculator & Growth Analysis Suite | SnapFreeTools",
    "Calculate your savings growth, monthly contributions, and compound interest. Plan your emergency fund and reach your savings goals faster.",
    "https://www.snapfreetools.com/savings-calculator"
  );
  
  appSchema.applicationCategory = "FinancialApplication";
  
  const faqSchema = getFAQSchema(SAVINGS_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "Savings Calculator", url: "https://www.snapfreetools.com/savings-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <SavingsCalculatorSuite />
    </>
  );
}
