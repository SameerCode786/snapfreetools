import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, JsonLd } from "@/seo/structured-data";

import WordCounterFeature from "@/features/word-counter";

export function generateMetadata() {
  return generatePageMetadata("word-counter");
}

export default function Page() {
  const schema = getSoftwareApplicationSchema("word-counter");
  return (
    <>
      <JsonLd schema={schema} />
      <WordCounterFeature />
    </>
  );
}
