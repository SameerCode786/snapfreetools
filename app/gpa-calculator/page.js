import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import GPACalculatorFeature from "@/features/student-hub/calculators/gpa";

export function generateMetadata() {
  return generatePageMetadata("gpa-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "How do I calculate GPA on a 4.0 scale?",
      answer: "A standard 4.0 scale GPA matches letter grades to points: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, F=0.0. To calculate, multiply course grade points by course credits, sum them, and divide by the total credits."
    },
    {
      question: "What is the difference between weighted and unweighted GPA?",
      answer: "Unweighted GPA calculates grades on a 4.0 scale regardless of class difficulty. Weighted GPA assigns extra points (typically +0.5 for honors and +1.0 for AP/IB courses) to reflect academic challenge."
    },
    {
      question: "Does GPA include pass/fail classes?",
      answer: "No. Classes taken as pass/fail (P/F) or satisfactory/unsatisfactory typically award credits but are excluded from grade point average calculations."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "SnapFree GPA Calculator",
    "Calculate semester GPA online free using standard 4.0 scale, standard 5.0 scale, or custom university systems.",
    "https://www.snapfreetools.com/gpa-calculator"
  );
  
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      <GPACalculatorFeature faqs={faqs} />
    </>
  );
}
