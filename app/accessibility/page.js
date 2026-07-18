import Link from "next/link";
import { ArrowLeft, Accessibility } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Accessibility Statement | SnapFreeTools",
  description: "Read our Accessibility Statement. Learn about our commitment to making our utility tools and calculators usable for everyone.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/accessibility"
  }
};

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://snapfreetools.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Accessibility",
        "item": "https://snapfreetools.com/accessibility"
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-800">Accessibility</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <Accessibility size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Accessibility Statement</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Last Updated: July 14, 2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-650 text-sm leading-relaxed">
            <p>
              SnapFreeTools ("we," "our," or "us") is committed to ensuring digital accessibility for all visitors, including individuals with disabilities. We continuously work to improve our site's user experience and apply relevant accessibility standards.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">1. Accessibility Goal</h2>
            <p>
              We strive to make our browser-based utility tools, semester GPA calculators, text counters, and converters accessible and usable for all people, including screen-reader users, keyboard-only navigators, and individuals who require high-contrast layout configurations.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">2. Implementation Standards & Best Practices</h2>
            <p>
              To support universal usability, our design process incorporates the following web accessibility considerations:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Keyboard Navigation:</strong> All interactive elements, dropdowns, and calculator controls are focusable and navigable via standard keyboard tab targets.
              </li>
              <li>
                <strong>Descriptive Landmarks & Labels:</strong> We utilize HTML5 semantic tags (such as `nav`, `footer`, and `main`) along with clear `aria-label` definitions to assist screen-reader navigation.
              </li>
              <li>
                <strong>Contrast and Typography:</strong> Text colors and background ratios are selected to meet readable guidelines, and clear font scaling is supported.
              </li>
              <li>
                <strong>Responsive Layout:</strong> Content naturally scales to fit diverse viewport sizes, including mobile, tablet, and desktop screens without clipping.
              </li>
            </ul>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">3. Feedback & Contact</h2>
            <p>
              If you experience any accessibility issues or have recommendations on how we can improve usability, please let us know. You can submit suggestions or report bugs through our Contact page. We value your feedback and will make reasonable efforts to resolve identified issues.
            </p>

            <div className="pt-8 border-t border-slate-100 mt-8 text-center sm:text-left flex flex-wrap justify-between items-center gap-4">
              <Link 
                href="/contact" 
                className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                Contact Support via our Contact Page &rarr;
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
