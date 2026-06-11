import { generatePageMetadata } from "@/seo/metadata";
import AboutFeature from "@/features/about";

export function generateMetadata() {
  return generatePageMetadata("about");
}

export default function Page() {
  return <AboutFeature />;
}
