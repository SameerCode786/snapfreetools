import React from "react";
import Link from "next/link";
import { Shield, Scale, HelpCircle, FileText, AlertTriangle, MessageSquare, Gavel } from "lucide-react";

export default function DMCAFeature() {
  const currentDate = "July 19, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">
          COPYRIGHT NOTICE
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          DMCA Copyright Policy
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          SnapFreeTools is committed to respecting intellectual property rights and complying with the Digital Millennium Copyright Act (DMCA).
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective date: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Shield size={16} className="text-emerald-500" /> Copyright Respected
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Scale size={16} className="text-emerald-500" /> Fair Review
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Gavel size={16} className="text-emerald-500" /> Good Faith Process
          </span>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Shield className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Respect Copyright</h3>
            <p className="text-sm text-slate-600 leading-relaxed">We expect all users of SnapFreeTools to respect the intellectual property of others.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Report Infringement</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Copyright owners may submit clear notices if they believe their work has been infringed.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Scale className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Fair Review</h3>
            <p className="text-sm text-slate-600 leading-relaxed">We will review valid notices in accordance with applicable laws where appropriate.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Gavel className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Good Faith</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Notices must be submitted in good faith. False claims may result in liability.</p>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-sm min-w-0">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Our Commitment</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SnapFreeTools operates as a provider of online productivity utilities. We are committed to responding to clear, valid notices of alleged copyright infringement in accordance with the Digital Millennium Copyright Act (DMCA) and other applicable intellectual property laws.
            </p>
          </section>

          {/* Important Notice Callout */}
          <section className="mb-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-2">
                <AlertTriangle size={20} className="text-amber-600" /> Important Notice
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Only the copyright owner, or their authorized representative, should submit a DMCA notice. Knowingly misrepresenting that material is infringing may expose you to legal consequences, including damages and attorney's fees.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How to Submit a Copyright Notice</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you believe that your copyrighted work has been infringed on SnapFreeTools, you may submit a notice containing the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
              <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the allegedly infringing material and its specific location on SnapFreeTools (e.g., exact URLs).</li>
              <li>Your contact information, including name, address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Review Process</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Upon receiving a complete and valid notice, SnapFreeTools may investigate the claim. Where appropriate, and if required by law, we may remove or disable access to the allegedly infringing material. We may also notify the user responsible for the material, if applicable.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. False or Fraudulent Claims</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Notices must be submitted in good faith. If a notice is determined to be false, abusive, or incomplete, we may disregard it. SnapFreeTools reserves the right to take appropriate action against users or reporters who abuse this process.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Contact for Copyright Issues</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To submit a copyright notice or inquire about intellectual property issues, please use our official contact channels.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-sm">
                Submit Notice via Contact Form
              </Link>
            </div>
          </section>

        </article>
      </main>

      {/* Final Contact Section */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <MessageSquare className="text-emerald-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-3">Questions about copyright?</h2>
          <p className="text-slate-300 mb-6 text-sm max-w-xl mx-auto">
            Contact SnapFreeTools if you need to report an infringement or have questions regarding this policy.
          </p>
          <div className="flex justify-center mb-6">
            <Link href="/contact" className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
              Contact Support
            </Link>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-400 font-semibold">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
