import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import RequiredGPACalculatorFeature from "@/features/student-hub/calculators/required-gpa";

export function generateMetadata() {
  return generatePageMetadata("required-gpa-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "How do I calculate what GPA I need to raise my cumulative GPA?",
      answer: "Use the required GPA equation: Required GPA = [(Target GPA * Total Credits) - (Current GPA * Current Credits)] / Remaining Credits. This calculates the exact semester average needed."
    },
    {
      question: "Is it possible to raise my GPA from 2.5 to 3.5 in one semester?",
      answer: "It depends on how many credits you have completed. If you have completed very few credits (like 15), it is possible. If you have completed many credits (like 90), raising it that fast is mathematically impossible in a single semester."
    },
    {
      question: "How do I calculate GPA needed to graduate with honors?",
      answer: "Find your university's honors cutoff GPA (e.g. 3.5 for Cum Laude). Input your current GPA, current completed credits, and remaining graduation credits into the calculator to find the target semester GPA."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "Required GPA Calculator",
    "Calculate the GPA required in future semesters or classes to achieve your target graduation or scholarship GPA.",
    "https://snapfreetools.com/required-gpa-calculator"
  );
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "Required GPA Calculator", url: "https://snapfreetools.com/required-gpa-calculator" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <RequiredGPACalculatorFeature faqs={faqs} />
    </>
  );
}
