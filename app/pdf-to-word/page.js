import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, JsonLd } from "@/seo/structured-data";

import PDFToWordFeature from "@/features/pdf-to-word";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-word");
}

export default function Page() {
  const schema = getSoftwareApplicationSchema("pdf-to-word");
  return (
    <>
      <JsonLd schema={schema} />
      <PDFToWordFeature />
    </>
  );
}
