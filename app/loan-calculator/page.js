import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { LOAN_CALCULATOR_FAQS } from "@/features/calculators/financial/loan-calculator/content/faqs";
import LoanCalculatorFeature from "@/features/calculators/financial/loan-calculator";

export function generateMetadata() {
  return generatePageMetadata("loan-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Loan Calculator & Analysis Suite",
    "Calculate loan payments, explore affordability, compare loans, and see your amortization schedule. Free, secure, and accurate loan analysis tool.",
    "https://www.snapfreetools.com/loan-calculator"
  );
  
  // Update category to FinancialApplication
  appSchema.applicationCategory = "FinancialApplication";
  
  const faqSchema = getFAQSchema(LOAN_CALCULATOR_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Financial Tools", url: "https://www.snapfreetools.com/calculators" }, // Assuming a generic hub
    { name: "Loan Calculator", url: "https://www.snapfreetools.com/loan-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <LoanCalculatorFeature faqs={LOAN_CALCULATOR_FAQS} />
    </>
  );
}
