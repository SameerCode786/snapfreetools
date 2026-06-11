import { generatePageMetadata } from "@/seo/metadata";
import { getWebSiteSchema, JsonLd } from "@/seo/structured-data";

export function generateMetadata() {
  return generatePageMetadata("home");
}

export default function Page() {
  const schema = getWebSiteSchema();
  return (
    <>
      <JsonLd schema={schema} />
      <h1>SnapFreeTools</h1>
    </>
  );
}
