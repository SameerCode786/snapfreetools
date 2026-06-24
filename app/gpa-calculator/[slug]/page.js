import { notFound } from "next/navigation";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import GPACalculatorFeature from "@/features/student-hub/calculators/gpa";
import { GRADE_SCALES } from "@/features/student-hub/shared/constants/gradeScales";

// Dynamic configuration mapping for each university route slug
const UNIVERSITY_CONTENT = {
  fast: {
    title: "FAST GPA Calculator - Calculate FAST NUCES GPA Online",
    h1: "FAST GPA Calculator",
    description: "Calculate your FAST GPA instantly. Preconfigured with the official FAST NUCES GPA scale, grade points, and course credit weights.",
    faqs: [
      {
        question: "How is GPA calculated at FAST NUCES?",
        answer: "FAST NUCES calculates GPA using a standard weighted average formula where each letter grade is mapped to point values: A=4.0, A-=3.67, B+=3.33, B=3.0, B-=2.67, C+=2.33, C=2.0, C-=1.67, D+=1.33, D=1.00, F=0.00. The GPA is total points divided by total credits."
      },
      {
        question: "What is the minimum GPA to avoid probation at FAST?",
        answer: "Students at FAST NUCES must maintain a Cumulative GPA (CGPA) of at least 2.00 to avoid academic probation and remain in good standing."
      },
      {
        question: "Does FAST use weighted or unweighted GPA scales?",
        answer: "FAST NUCES uses a standard unweighted 4.00 grading scale for all bachelor and graduate degree courses."
      }
    ]
  },
  nust: {
    title: "NUST GPA Calculator - Calculate NUST GPA Online Free",
    h1: "NUST GPA Calculator",
    description: "Free online GPA calculator for NUST students. Calculate your semester or cumulative GPA using the official NUST grading scale.",
    faqs: [
      {
        question: "What grading scale does NUST use?",
        answer: "NUST uses a standard 4.00 grading scale where: A=4.0, B+=3.5, B=3.0, C+=2.5, C=2.0, D=1.0, F=0.0. Grade points are multiplied by course credits to calculate semester averages."
      },
      {
        question: "What GPA is needed to stay off probation at NUST?",
        answer: "NUST requires students to maintain a minimum CGPA of 2.00. Earning below a 2.00 triggers an academic warning or probation status."
      },
      {
        question: "Can I calculate both SGPA and CGPA for NUST?",
        answer: "Yes, you can calculate your term SGPA here, and then aggregate multiple semesters to track your overall NUST CGPA."
      }
    ]
  },
  comsats: {
    title: "COMSATS GPA Calculator - Calculate COMSATS GPA Online",
    h1: "COMSATS GPA Calculator",
    description: "Calculate your semester GPA at COMSATS University Islamabad. Pre-loaded with the official COMSATS 4.0 scale grade values.",
    faqs: [
      {
        question: "What is the COMSATS GPA scale?",
        answer: "COMSATS uses a 4.00 grading scale: A=4.0, A-=3.7, B+=3.4, B=3.0, B-=2.7, C+=2.4, C=2.0, C-=1.7, D=1.0, F=0.0. These values are used to compute your semester SGPA."
      },
      {
        question: "What CGPA is required to graduate from COMSATS?",
        answer: "A minimum Cumulative GPA of 2.00 is required to successfully qualify for graduation and degree award at COMSATS University."
      }
    ]
  },
  uet: {
    title: "UET GPA Calculator - Calculate UET GPA Online",
    h1: "UET GPA Calculator",
    description: "Easily calculate your UET GPA online. Fully preconfigured with the University of Engineering and Technology GPA grading scale.",
    faqs: [
      {
        question: "What grading scale does UET use?",
        answer: "UET uses a 4.00 grading scale: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D=1.0, F=0.0. Calculate your engineering credit GPA instantly."
      },
      {
        question: "How does UET calculate cumulative grade average?",
        answer: "UET calculates cumulative averages (CGPA) as the sum of grade points earned in all courses across semesters divided by total attempted credits."
      }
    ]
  },
  lums: {
    title: "LUMS GPA Calculator - Calculate LUMS GPA Online Free",
    h1: "LUMS GPA Calculator",
    description: "Online GPA calculator for Lahore University of Management Sciences (LUMS) students. Calculate your GPA using the official LUMS letter-grade point system.",
    faqs: [
      {
        question: "What grading scale does LUMS use?",
        answer: "LUMS uses a standard 4.00 scale: A+=4.0, A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0. This pre-loaded scale will calculate your average instantly."
      },
      {
        question: "What is a good GPA at LUMS?",
        answer: "A GPA of 3.50 or above is considered excellent and typically qualifies undergraduate students for the Dean's Honor List at LUMS."
      }
    ]
  },
  pakistan: {
    title: "GPA Calculator Pakistan - HEC GPA Calculator Online",
    h1: "GPA Calculator Pakistan",
    description: "Calculate your academic GPA using the official Higher Education Commission (HEC) Pakistan standard grading scale online.",
    faqs: [
      {
        question: "What is the HEC GPA scale in Pakistan?",
        answer: "The Higher Education Commission (HEC) Pakistan standardized scale maps: A=4.0, A-=3.67, B+=3.33, B=3.0, B-=2.67, C+=2.33, C=2.0, C-=1.67, D+=1.30, D=1.00, F=0.00."
      },
      {
        question: "Why is HEC standard GPA important?",
        answer: "The HEC scale is used as a benchmark for equivalence certificates and national scholarship qualification processes inside Pakistan."
      }
    ]
  }
};

// Pre-render static pages at build time
export function generateStaticParams() {
  return [
    { slug: "fast" },
    { slug: "nust" },
    { slug: "comsats" },
    { slug: "uet" },
    { slug: "lums" },
    { slug: "pakistan" }
  ];
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = UNIVERSITY_CONTENT[slug];
  
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://snapfreetools.com/gpa-calculator/${slug}`
    }
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const scale = GRADE_SCALES[slug];
  const content = UNIVERSITY_CONTENT[slug];

  if (!scale || !content) {
    notFound();
  }

  const appSchema = getSoftwareApplicationSchema(
    `${scale.name} Calculator`,
    content.description,
    `https://snapfreetools.com/gpa-calculator/${slug}`
  );
  
  const faqSchema = getFAQSchema(content.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "GPA Calculator", url: "https://snapfreetools.com/gpa-calculator" },
    { name: scale.name, url: `https://snapfreetools.com/gpa-calculator/${slug}` }
  ]);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />
      
      {/* Dynamic Header details passed down to components */}
      <GPACalculatorFeature 
        faqs={content.faqs} 
        initialScale={slug} 
      />
    </>
  );
}
