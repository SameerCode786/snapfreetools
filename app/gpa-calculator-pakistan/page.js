import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import GPACalculatorFeature from "@/features/student-hub/calculators/gpa";

export function generateMetadata() {
  return {
    title: "GPA Calculator Pakistan - HEC GPA Calculator Online",
    description: "Calculate your semester or cumulative GPA online using the official Higher Education Commission (HEC) Pakistan standard grading scale.",
    alternates: {
      canonical: "https://www.snapfreetools.com/gpa-calculator-pakistan"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What grading scale does HEC Pakistan use?",
      answer: "The Higher Education Commission (HEC) Pakistan uses a standard 4.00 grading scale where letter grades are mapped to points: A=4.0, A-=3.67, B+=3.33, B=3.0, B-=2.67, C+=2.33, C=2.0, C-=1.67, D+=1.30, D=1.00, F=0.00."
    },
    {
      question: "How do you convert GPA to percentage under HEC rules?",
      answer: "HEC Pakistan uses standard conversion matrices and formula sheets to determine percentages from GPA values for public sector recruitment and job qualifications."
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    "HEC Pakistan GPA Calculator",
    "Calculate your GPA based on Higher Education Commission (HEC) Pakistan standard grade values.",
    "https://www.snapfreetools.com/gpa-calculator-pakistan"
  );
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      
      {/* Mounted with locked preset 'pakistan' HEC scale */}
      <GPACalculatorFeature faqs={faqs} initialScale="pakistan" />
    </>
  );
}
