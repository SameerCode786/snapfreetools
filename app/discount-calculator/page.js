import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { DISCOUNT_FAQS } from "@/features/calculators/utility/discount-calculator/content/faqs";
import DiscountCalculatorFeature from "@/features/calculators/utility/discount-calculator";

export function generateMetadata() {
  return generatePageMetadata("discount-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "Discount Calculator & Pricing Analysis Suite",
    "Calculate sale prices, percentage discounts, stacked discounts, discount + tax, and total savings. Free, fast, and accurate.",
    "https://www.snapfreetools.com/discount-calculator"
  );
  
  appSchema.applicationCategory = "UtilityApplication";
  
  const faqSchema = getFAQSchema(DISCOUNT_FAQS);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "Discount Calculator", url: "https://www.snapfreetools.com/discount-calculator" }
  ]);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <DiscountCalculatorFeature faqs={DISCOUNT_FAQS} />
    </>
  );
}
