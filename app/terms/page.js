import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Terms of Use | SnapFreeTools",
  description: "Read our terms of use. Understand user responsibilities, intellectual property policies, and educational disclaimers on SnapFreeTools.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/terms"
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
        "name": "Terms of Use",
        "item": "https://snapfreetools.com/terms"
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
          <span className="text-slate-800">Terms of Use</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">Terms of Use</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Last Updated: July 14, 2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-650 text-sm leading-relaxed">
            <p>
              Welcome to SnapFreeTools ("we," "our," or "us"). By accessing or using our website and browser-based utility tools, you agree to comply with and be bound by the following Terms of Use. If you do not agree, please do not use our services.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">1. Acceptance of Terms</h2>
            <p>
              By using our services, you confirm that you have read, understood, and agreed to these Terms. We reserve the right to update or modify these Terms at any time without prior notice. Continued use of the website after changes are posted constitutes acceptance of the new terms.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">2. Permitted Use & Browser-Side Processing</h2>
            <p>
              Our tools (including the PDF to Word converter, GPA calculators, image compressor, and word counter) are provided free of charge for personal and professional use. Certain tools process files and text locally within your web browser using JavaScript, meaning your processing files never touch our servers. You agree to use these tools only for lawful purposes.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">3. Prohibited Misuse</h2>
            <p>
              You agree not to upload or attempt to process any material that contains computer viruses, malware, or software designed to disrupt the performance of this website. You must not attempt to gain unauthorized access to our hosting infrastructure or disrupt the platform's availability for other users.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">4. File and Content Responsibility</h2>
            <p>
              You maintain full ownership and responsibility for any files, text, or content you process using our website. We do not store, review, or control the content you process. You are responsible for ensuring you have the legal right, permissions, and authorizations to edit, convert, or compress any document you supply to the tools.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">5. Intellectual Property</h2>
            <p>
              The design, code, logos, layout, and registry architecture of SnapFreeTools are protected by copyright and intellectual property laws. You may not copy, distribute, modify, or reverse-engineer any portion of the site's code, structure, or assets without our explicit prior written consent.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">6. Accuracy & Calculator Disclaimer</h2>
            <p>
              While we strive to provide reliable utilities, all tools, converters, and calculators are provided on an "as is" and "as available" basis. Calculation results (such as academic GPA scores, percentages, and conversions) are intended strictly for educational planning purposes. They should be independently reviewed and verified where accuracy is critical (e.g., official college admissions, scholarship applications, or financial planning).
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">7. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              SnapFreeTools makes no warranties, express or implied, regarding the reliability, availability, or suitability of our tools. We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools, including data loss or calculation discrepancies.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">8. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be interpreted and governed in accordance with neutral legal principles. In the event of a dispute, we encourage users to contact us directly through the Contact page to seek a friendly and informal resolution.
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
