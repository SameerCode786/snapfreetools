import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { BMI_FAQS } from "@/features/calculators/health/bmi-calculator/content/faqs";
import BMICalculatorFeature from "@/features/calculators/health/bmi-calculator";

export function generateMetadata() {
  return generatePageMetadata("bmi-calculator");
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "BMI Calculator & Body Mass Index Analysis",
    "Calculate your Body Mass Index (BMI) in metric or imperial units. See your BMI category, healthy weight range, and analysis. Free and accurate.",
    "https://www.snapfreetools.com/bmi-calculator"
  );
  appSchema.applicationCategory = "HealthApplication";

  const faqSchema = getFAQSchema(BMI_FAQS);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Calculators", url: "https://www.snapfreetools.com/calculators" },
    { name: "BMI Calculator", url: "https://www.snapfreetools.com/bmi-calculator" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}
      <BMICalculatorFeature faqs={BMI_FAQS} />
    </>
  );
}
