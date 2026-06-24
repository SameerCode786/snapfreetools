import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import CGPACalculatorFeature from "@/features/student-hub/calculators/cgpa";

export function generateMetadata() {
  return generatePageMetadata("cgpa-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "How is CGPA calculated from GPA?",
      answer: "To calculate CGPA, multiply each semester's GPA by its credit hours to get semester grade points. Sum these grade points, and divide by the total cumulative credit hours attempted."
    },
    {
      question: "Can I convert CGPA to a 4.0 scale?",
      answer: "Yes, if your CGPA is on a different scale (like 5.0 or 10.0), you can convert it proportionally or using academic charts to match standard 4.0 equivalents."
    },
    {
      question: "How do I raise my CGPA?",
      answer: "To raise your CGPA, focus on earning high GPAs in future semesters with higher credit weights, as courses with more credits impact your cumulative average more heavily."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "SnapFree CGPA Calculator",
    "Calculate your Cumulative Grade Point Average (CGPA) online. Aggregates multiple semester GPAs and credit hours.",
    "https://snapfreetools.com/cgpa-calculator"
  );
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "CGPA Calculator", url: "https://snapfreetools.com/cgpa-calculator" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <CGPACalculatorFeature faqs={faqs} />
    </>
  );
}
