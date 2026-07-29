import { notFound } from "next/navigation";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import MeritCalculatorFeature from "@/features/student-hub/calculators/merit";
import { MERIT_SCALES } from "@/features/student-hub/shared/constants/meritScales";

// Pre-render static pages at build time
export function generateStaticParams() {
  return [
    { slug: "fast" },
    { slug: "nust" },
    { slug: "comsats" },
    { slug: "uet" }
  ];
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = MERIT_SCALES[slug];
  
  if (!config) return {};

  return {
    title: `${config.name} - Aggregate Admission Merit Planner`,
    description: `Calculate your aggregate admission index for ${config.university} online. ${config.description}.`,
    alternates: {
      canonical: `https://www.snapfreetools.com/merit-calculator/${slug}`
    }
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const config = MERIT_SCALES[slug];

  if (!config) {
    notFound();
  }

  const faqs = [
    {
      question: `What is the merit formula for ${config.university}?`,
      answer: `The aggregate admission formula is weighted as: ${config.description}.`
    },
    {
      question: `How do I enter my entry test marks in this calculator?`,
      answer: `Input your absolute test marks directly into the corresponding entry field. The calculator automatically converts it to a percentage based on the test scale and applies the correct weight.`
    }
  ];

  const appSchema = getSoftwareApplicationSchema(
    config.name,
    `Admission aggregate merit calculator for ${config.university}.`,
    `https://www.snapfreetools.com/merit-calculator/${slug}`
  );
  
  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      <MeritCalculatorFeature faqs={faqs} initialPreset={slug} />
    </>
  );
}
