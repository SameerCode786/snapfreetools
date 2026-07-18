import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Cookie Policy | SnapFreeTools",
  description: "Read our Cookie Policy. Understand how we use essential, functional, analytics, and advertising cookies to improve your user experience.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/cookie-policy"
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
        "name": "Cookie Policy",
        "item": "https://snapfreetools.com/cookie-policy"
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
          <span className="text-slate-800">Cookie Policy</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <Cookie size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Cookie Policy</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Last Updated: July 14, 2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-650 text-sm leading-relaxed">
            <p>
              This Cookie Policy explains how SnapFreeTools ("we," "our," or "us") uses cookies and similar tracking technologies to improve your experience on our website.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, remember your user preferences, and provide analytical data to website owners.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">2. Categories of Cookies We May Use</h2>
            <p>
              We categorize the cookies used on our website as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Strictly Necessary Storage:</strong> These cookies or local storage settings are essential for the core functionality of the website. For example, local processing of file formats (e.g. PDF conversion configurations) uses browser memory and caching.
              </li>
              <li>
                <strong>Functional Preferences:</strong> Used to remember selections and custom settings you adjust (e.g. your quality compression scale in the Image Compressor) so you do not have to reset them on future visits.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> We may utilize third-party web analytics tools (such as Google Analytics) to gather general, aggregated information about site visits and link paths. This analytics data is used strictly to optimize page loading speed and tool structures.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> When display advertisements are integrated, third-party advertising platforms (such as Google AdSense) may place cookies to serve relevant, personalized, or non-personalized ads. <em>Please note that third-party advertising cookies are only activated in compliance with local consent regulations.</em>
              </li>
            </ul>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">3. Consent Records & User Choice</h2>
            <p>
              Where required by law, you will be provided with choice controls regarding non-essential cookies. You can choose to accept, reject, or manage cookie categories. You can also configure your web browser to reject all cookies or notify you when a cookie is placed.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">4. Third-Party Cookies and Links</h2>
            <p>
              Our website may link to third-party tools, platforms, or sponsorships. These third-party sites set their own independent cookies. We have no control over their policies and recommend reviewing the privacy and cookie settings of external services you navigate to.
            </p>

            <div className="pt-8 border-t border-slate-100 mt-8 text-center sm:text-left flex flex-wrap justify-between items-center gap-4">
              <Link 
                href="/contact" 
                className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                Contact support via our Contact Page &rarr;
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
