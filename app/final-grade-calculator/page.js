import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import FinalGradeCalculatorFeature from "@/features/student-hub/calculators/final-grade";

export function generateMetadata() {
  return generatePageMetadata("final-grade-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "How do you figure out what grade you need on a final?",
      answer: "Use the final grade formula: Exam Score = [Target Grade - Current Grade * (1 - Final Weight)] / Final Weight. This reveals the percentage grade required on the test."
    },
    {
      question: "What does it mean if my required final exam score is negative?",
      answer: "If the calculator gives a negative result or 0%, it means your current grade is high enough that you have already secured your target grade, even if you fail the final exam."
    },
    {
      question: "How do weighted classes impact final grades?",
      answer: "In a weighted class, grades are split into categories (like tests, homework, and finals). The final exam category weight represents the percentage it counts towards your total final class grade."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "Final Grade Calculator",
    "Calculate the exact grade you need on your final exam to pass your class or reach an A average.",
    "https://snapfreetools.com/final-grade-calculator"
  );
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "Final Grade Calculator", url: "https://snapfreetools.com/final-grade-calculator" }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <FinalGradeCalculatorFeature faqs={faqs} />
    </>
  );
}
