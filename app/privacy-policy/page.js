import { generatePageMetadata } from "@/seo/metadata";
import PrivacyPolicyFeature from "@/features/privacy-policy";

export function generateMetadata() {
  return generatePageMetadata("privacy-policy");
}

export default function Page() {
  return <PrivacyPolicyFeature />;
}
