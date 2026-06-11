import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, JsonLd } from "@/seo/structured-data";

import GPACalculatorFeature from "@/features/gpa-calculator";

export function generateMetadata() {
  return generatePageMetadata("gpa-calculator");
}

export default function Page() {
  const schema = getSoftwareApplicationSchema("gpa-calculator");
  return (
    <>
      <JsonLd schema={schema} />
      <GPACalculatorFeature />
    </>
  );
}
