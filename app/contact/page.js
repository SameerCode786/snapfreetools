import { generatePageMetadata } from "@/seo/metadata";

export function generateMetadata() {
  return generatePageMetadata("contact");
}

export default function Page() {
  return <h1>Contact Us</h1>;
}
