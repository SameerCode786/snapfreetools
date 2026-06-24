import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import SGPACalculatorFeature from "@/features/student-hub/calculators/sgpa";

export function generateMetadata() {
  return generatePageMetadata("sgpa-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "How is SGPA calculated?",
      answer: "SGPA is calculated by dividing total semester grade points earned by the total credit hours registered. Each grade letter is mapped to grade points, multiplied by course credits, summed, and divided."
    },
    {
      question: "How do I convert SGPA to CGPA?",
      answer: "To convert multiple SGPAs into a Cumulative GPA (CGPA), you must take the weighted average. Multiply each semester's SGPA by its total credit hours, add them together, and divide by the cumulative sum of all credit hours."
    },
    {
      question: "Does SGPA count failed courses?",
      answer: "Yes, failed classes (grade F, points 0) are factored into your SGPA. The credit hours of the failed class are added to your attempted credits, which lowers your term average."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "SnapFree SGPA Calculator",
    "Calculate your Semester Grade Point Average (SGPA) for individual terms online for free.",
    "https://snapfreetools.com/sgpa-calculator"
  );
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "SGPA Calculator", url: "https://snapfreetools.com/sgpa-calculator" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <SGPACalculatorFeature faqs={faqs} />
    </>
  );
}
