import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorsHubFeature from "@/features/calculators-hub";
import { CALCULATORS_FAQS } from "@/features/calculators-hub/content/faqs";
import { getCalculatorsList } from "@/features/calculators-hub/utils/registryHelpers";

export const metadata = {
  title: "Free Online Calculators – Finance, Math, Education & More | SnapFreeTools",
  description: "Use free online calculators for finance, loans, investments, savings, math, education, and everyday planning. Fast, accurate, easy to use, and no sign-up required.",
  alternates: {
    canonical: "https://www.snapfreetools.com/calculators"
  }
};

export default function CalculatorsHubPage() {
  const faqSchema = getFAQSchema(CALCULATORS_FAQS);
  
  // Extract live calculators for the ItemList schema
  const calculators = getCalculatorsList().filter(c => c.status === "live");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/calculators/#webpage",
        "url": "https://www.snapfreetools.com/calculators",
        "name": "Free Online Calculators – Finance, Math, Education & More | SnapFreeTools",
        "description": "Use free online calculators for finance, loans, investments, savings, math, education, and everyday planning.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/calculators/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/calculators/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Calculators",
            "item": "https://www.snapfreetools.com/calculators"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.snapfreetools.com/calculators/#collection",
        "name": "Free Online Calculators",
        "description": "Explore free online calculators for finance, education, math, planning, and everyday needs.",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": calculators.map((calc, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": calc.name,
            "url": `https://www.snapfreetools.com/${calc.slug}`
          }))
        }
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={faqSchema} />
      
      <CalculatorsHubFeature faqs={CALCULATORS_FAQS} />
    </>
  );
}
