import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import StudentCalculatorHubFeature from "@/features/student-hub/hub";

export function generateMetadata() {
  return generatePageMetadata("calculators");
}

export default function CalculatorsHubPage() {
  // Central FAQ list for the Hub page
  const faqs = [
    {
      question: "What student calculators are available on SnapFreeTools?",
      answer: "We offer a complete suite of academic tools including GPA, CGPA, SGPA, GPA-to-Percentage, Percentage-to-GPA, Required GPA, Final Grade, and Admission Merit Calculators."
    },
    {
      question: "Are these educational calculators free to use?",
      answer: "Yes, all calculators on SnapFreeTools are 100% free with no sign-ups or subscription fees required."
    },
    {
      question: "Is my academic data processed securely?",
      answer: "Absolutely. All calculations are performed entirely in your browser. None of your academic grades, scores, or credits are ever uploaded to our servers."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      
      <StudentCalculatorHubFeature faqs={faqs} />
    </>
  );
}
