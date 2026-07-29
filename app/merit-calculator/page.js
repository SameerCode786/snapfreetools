import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import MeritCalculatorFeature from "@/features/student-hub/calculators/merit";

export function generateMetadata() {
  return generatePageMetadata("merit-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "What is an admission merit calculator?",
      answer: "A merit calculator computes academic aggregates using scores from Matric/O-Levels, FSc/A-Levels, and specialized university entry tests to assess admission eligibility."
    },
    {
      question: "How is NUST aggregate merit computed?",
      answer: "NUST calculates aggregate merit as: 75% weight for NUST Entry Test (NET) score, 15% weight for HSSC/FSc intermediate grades, and 10% weight for SSC/Matric scores."
    },
    {
      question: "How does entry test weight impact overall merit?",
      answer: "Since entry tests are heavily weighted (e.g. 50% to 75% depending on the university), a high entry test score significantly raises your aggregate admission index."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "Admission Merit Calculator",
    "Calculate your university admission aggregate merit score online for standard universities.",
    "https://www.snapfreetools.com/merit-calculator"
  );
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      <MeritCalculatorFeature faqs={faqs} />
    </>
  );
}
