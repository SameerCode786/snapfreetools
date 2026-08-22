import AgeCalculatorFeature from "@/features/calculators/utility/age-calculator";
import { AGE_CALCULATOR_FAQS } from "@/features/calculators/utility/age-calculator/content/faqs";
import { generatePageMetadata } from "@/seo/metadata";
import { getFAQSchema, getSoftwareApplicationSchema } from "@/seo/structured-data";

export const metadata = generatePageMetadata("age-calculator");

export default function AgeCalculatorPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": metadata.title,
      "description": metadata.description,
      "url": "https://www.snapfreetools.com/age-calculator"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Age Calculator",
          "item": "https://www.snapfreetools.com/age-calculator"
        }
      ]
    },
    getSoftwareApplicationSchema("age-calculator"),
    getFAQSchema(AGE_CALCULATOR_FAQS)
  ].filter(Boolean); // remove null schemas if any

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <AgeCalculatorFeature />
    </>
  );
}
