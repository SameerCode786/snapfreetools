import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { INVESTMENT_FAQS } from "@/features/calculators/financial/investment-calculator/content/faqs";
import InvestmentCalculatorSuite from "@/features/calculators/financial/investment-calculator";

export function generateMetadata() {
  return generatePageMetadata("investment-calculator");
}

export default function InvestmentCalculatorPage() {
  const appSchema = getSoftwareApplicationSchema(
    "Investment Calculator & Growth Analysis Suite | SnapFreeTools",
    "Calculate compound interest, future value, and monthly investment growth. Our premium investment calculator includes inflation analysis and goal planning.",
    "https://www.snapfreetools.com/investment-calculator"
  );
  
  appSchema.applicationCategory = "FinancialApplication";
  
  const faqSchema = getFAQSchema(INVESTMENT_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "Investment Calculator", url: "https://www.snapfreetools.com/investment-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <InvestmentCalculatorSuite />
    </>
  );
}
