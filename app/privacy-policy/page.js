import { generatePageMetadata } from "@/seo/metadata";

export function generateMetadata() {
  return generatePageMetadata("privacy-policy");
}

export default function Page() {
  return <h1>Privacy Policy</h1>;
}
