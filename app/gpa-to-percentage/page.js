import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import GPAToPercentageFeature from "@/features/student-hub/calculators/gpa-to-percentage";

export function generateMetadata() {
  return generatePageMetadata("gpa-to-percentage");
}

export default function Page() {
  const faqs = [
    {
      question: "What is a 3.0 GPA in percentage?",
      answer: "Using the standard linear formula, a 3.0 GPA equates to 80% (calculated as (3.0 * 20) + 20). Using the proportional method, a 3.0 GPA represents 75% of the maximum 4.0 scale."
    },
    {
      question: "Why do universities convert GPA to percentages?",
      answer: "Many international academic boards and scholarship applications require grades to be submitted as a percentile score to easily assess applicant standings across varying GPA scales."
    },
    {
      question: "How do I convert a 10.0 scale CGPA to a percentage?",
      answer: "To convert a 10.0 scale CGPA to percentage, you typically use a simple proportional conversion: Percentage = (CGPA / 10) * 100, which means a CGPA of 8.5 is 85%."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "GPA to Percentage Calculator",
    "Convert your Grade Point Average (GPA) to class percentage equivalents instantly using standard or proportional formulas.",
    "https://www.snapfreetools.com/gpa-to-percentage"
  );
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      <GPAToPercentageFeature faqs={faqs} />
    </>
  );
}
