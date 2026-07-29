import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import ScholarshipCalculatorFeature from "@/features/calculators/student-admission/scholarship-calculator";

export function generateMetadata() {
  return generatePageMetadata("scholarship-calculator");
}

export default function Page() {
  const faqs = [
    {
      question: "What is a scholarship calculator?",
      answer: "A scholarship calculator helps you estimate your tuition savings by subtracting your awarded scholarship amount (percentage or fixed) from your base tuition fee."
    },
    {
      question: "How do I calculate a percentage scholarship?",
      answer: "Multiply your tuition fee by the scholarship percentage, then divide by 100 to get the scholarship amount. Subtract this from your tuition fee to find the remaining payable fee."
    },
    {
      question: "How do I calculate tuition after a fixed scholarship?",
      answer: "Simply subtract the fixed scholarship amount from your total tuition fee for that period. The remaining balance is your payable fee."
    },
    {
      question: "Does this calculator predict scholarship eligibility?",
      answer: "No. This tool estimates financial savings based on an award you already know you will receive or are hoping to receive. It does not predict eligibility based on GPA, university, or test scores."
    },
    {
      question: "Can I calculate annual scholarship savings?",
      answer: "Yes. By selecting a 'Per Month' or 'Per Semester' fee cycle and entering optional projection numbers, the calculator will estimate your total annual savings and program savings."
    },
    {
      question: "Does the calculator support different currencies?",
      answer: "Yes. You can select different currencies (USD, PKR, EUR, etc.) from the dropdown. This changes the display formatting but does not perform any exchange rate conversion."
    },
    {
      question: "Can I calculate total program savings?",
      answer: "Yes, by providing the total number of semesters or study years, the calculator will project the total scholarship amount across your entire degree program."
    },
    {
      question: "Are my details stored or uploaded?",
      answer: "No, all calculations are performed locally in your browser. No financial data or personal information is uploaded to our servers."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "Scholarship Calculator",
    "Calculate your scholarship amount, remaining tuition fee, and estimated savings using a percentage or fixed award.",
    "https://www.snapfreetools.com/scholarship-calculator"
  );
  
  const faqSchema = getFAQSchema(faqs);
  
  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
            <ScholarshipCalculatorFeature faqs={faqs} />
    </>
  );
}
