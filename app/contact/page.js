import { generatePageMetadata } from "@/seo/metadata";
import ContactFeature from "@/features/contact";

export function generateMetadata() {
  return generatePageMetadata("contact");
}

export default function Page() {
  return <ContactFeature />;
}
