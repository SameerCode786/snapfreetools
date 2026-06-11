import { generatePageMetadata } from "@/seo/metadata";

export function generateMetadata() {
  return generatePageMetadata("about");
}

export default function Page() {
  return <h1>About Us</h1>;
}
