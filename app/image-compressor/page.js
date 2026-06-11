import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, JsonLd } from "@/seo/structured-data";

import ImageCompressorFeature from "@/features/image-compressor";

export function generateMetadata() {
  return generatePageMetadata("image-compressor");
}

export default function Page() {
  const schema = getSoftwareApplicationSchema("image-compressor");
  return (
    <>
      <JsonLd schema={schema} />
      <ImageCompressorFeature />
    </>
  );
}
