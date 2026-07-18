import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Disclaimer | SnapFreeTools",
  description: "Read our general disclaimer. Understand the accuracy limitations of our calculators, image compressors, and PDF conversion tools.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/disclaimer"
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
        "name": "Disclaimer",
        "item": "https://snapfreetools.com/disclaimer"
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
          <span className="text-slate-800">Disclaimer</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Disclaimer</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Last Updated: July 14, 2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-650 text-sm leading-relaxed">
            <p>
              Please read this Disclaimer carefully before using any of the conversion tools, image compressors, or calculation modules provided on SnapFreeTools.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">1. General Informational & Educational Purpose Only</h2>
            <p>
              The tools, resources, metrics, and content available on this website are provided strictly for general informational, personal, and educational planning purposes. None of the tools or results constitute official, legal, professional, or academic advice.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">2. Calculator & Admission Score Limitations</h2>
            <p>
              Academic calculators (such as our GPA, CGPA, SGPA, and Merit calculators) use standard mathematical formulas to provide estimates. Because grading scales, course weights, admissions policies, and conversion standards vary significantly between universities and regions, the results calculated by our tools may differ from your official university transcript records or admissions aggregate score rankings. Users are responsible for independently verifying calculation outputs with their academic advisors or admissions offices.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">3. File Conversion & OCR Processing Limitations</h2>
            <p>
              Our PDF to Word converter utilizes local, browser-side processing engines. While we work to preserve document formatting, text layouts, and styles, complex elements such as multi-column layouts, tables, and low-resolution scanned documents may not convert perfectly. Our Optical Character Recognition (OCR) tools are designed as helper programs and may produce text interpretation discrepancies.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">4. No Warranties</h2>
            <p>
              SnapFreeTools makes no representation, warranty, or guarantee of any kind, express or implied, regarding the completeness, accuracy, reliability, or availability of the website's resources. All tools are provided "as is" and "as available".
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">5. User Responsibility & Liability Limit</h2>
            <p>
              Your reliance on any calculation, analysis, or file conversion output from this website is solely at your own risk. In no event shall SnapFreeTools be liable for any loss, error, academic discrepancy, or financial liability resulting from your use of the website or tools.
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
