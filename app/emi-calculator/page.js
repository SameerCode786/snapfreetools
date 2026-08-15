import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { EMI_CALCULATOR_FAQS } from "@/features/calculators/financial/emi-calculator/content/faqs";
import EMICalculatorFeature from "@/features/calculators/financial/emi-calculator";

export function generateMetadata() {
  return generatePageMetadata("emi-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "EMI Calculator & Loan Repayment Analysis Suite",
    "Calculate Equated Monthly Installments (EMI), view detailed amortization schedules, and compare loans with our free advanced EMI calculator.",
    "https://www.snapfreetools.com/emi-calculator"
  );
  
  appSchema.applicationCategory = "FinancialApplication";
  
  const faqSchema = getFAQSchema(EMI_CALCULATOR_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "EMI Calculator", url: "https://www.snapfreetools.com/emi-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <EMICalculatorFeature faqs={EMI_CALCULATOR_FAQS} />
    </>
  );
}
