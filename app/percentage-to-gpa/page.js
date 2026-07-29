import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import PercentageToGPAFeature from "@/features/student-hub/calculators/percentage-to-gpa";

export function generateMetadata() {
  return generatePageMetadata("percentage-to-gpa");
}

export default function Page() {
  const faqs = [
    {
      question: "What is 80 percent as a GPA?",
      answer: "Under the standard linear conversion method, 80% translates to a 3.0 GPA (calculated as (80 - 20) / 20). Proportional conversion maps 80% to a 3.20 GPA."
    },
    {
      question: "What is a 90% grade in a GPA score?",
      answer: "A 90% class score maps to a 3.50 GPA using standard linear conversions, which is equivalent to a B+ or A- average in most college ranking systems."
    },
    {
      question: "How do I convert a percentage to 5.0 scale GPA?",
      answer: "To convert percentage to 5.0 scale GPA, use the proportional formula: GPA = (Percentage / 100) * 5. For example, a score of 85% equals a 4.25 GPA."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "Percentage to GPA Calculator",
    "Convert your class grade percentage to standard 4.0 or 5.0 scale GPAs online easily.",
    "https://www.snapfreetools.com/percentage-to-gpa"
  );
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      <PercentageToGPAFeature faqs={faqs} />
    </>
  );
}
