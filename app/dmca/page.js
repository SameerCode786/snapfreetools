import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "DMCA Policy | SnapFreeTools",
  description: "Read our DMCA Policy. Understand our copyright compliance procedures and find instructions on how to submit a copyright infringement notice.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/dmca"
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
        "name": "DMCA Policy",
        "item": "https://snapfreetools.com/dmca"
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
          <span className="text-slate-800">DMCA Policy</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">DMCA Copyright Policy</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Last Updated: July 14, 2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none space-y-6 text-slate-650 text-sm leading-relaxed">
            <p>
              SnapFreeTools ("we," "our," or "us") respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act ("DMCA"), we will respond quickly to claims of copyright infringement committed on our website.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">1. Copyright Infringement Claims</h2>
            <p>
              If you are a copyright owner or authorized to act on behalf of one, please report alleged copyright infringements taking place on this website by submitting a detailed notice of infringement.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">2. Notice Content Requirements</h2>
            <p>
              Your DMCA Notice must contain the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Identification of the copyrighted work that you claim has been infringed.
              </li>
              <li>
                Identification of the material on our site that you claim is infringing, including the specific page URL so we can locate it.
              </li>
              <li>
                Your complete contact details, including name, mailing address, telephone number, and email address.
              </li>
              <li>
                A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                A statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.
              </li>
              <li>
                Your physical or electronic signature.
              </li>
            </ul>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">3. Submit Notice</h2>
            <p>
              Please submit copyright notices to us directly via our Contact page. Once received, we will review the notice and take appropriate actions, including the immediate removal of the challenged material where appropriate.
            </p>

            <h2 className="text-lg font-extrabold text-slate-900 pt-4">4. Fraudulent Claim Warning</h2>
            <p>
              Please be aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages, including legal fees.
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
