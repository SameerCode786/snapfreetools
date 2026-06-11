import { generatePageMetadata } from "@/seo/metadata";
import { getWebSiteSchema, JsonLd } from "@/seo/structured-data";
import HomeFeature from "@/features/home";

export function generateMetadata() {
  return generatePageMetadata("home");
}

export default function Page() {
  const websiteSchema = getWebSiteSchema();

  return (
    <>
      <JsonLd schema={websiteSchema} />
      <HomeFeature />
    </>
  );
}
