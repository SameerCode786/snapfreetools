import React from "react";
import Link from "next/link";
import { AlertTriangle, Calculator, FileText, Image as ImageIcon, CheckCircle, HelpCircle } from "lucide-react";

export default function DisclaimerFeature() {
  const currentDate = "July 19, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-4 block">
          LEGAL NOTICE
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Disclaimer
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          SnapFreeTools provides free online tools for convenience, education, and general productivity. Results may vary and should be independently verified where accuracy matters.
        </p>
        <div className="flex justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <CheckCircle size={16} className="text-emerald-500" /> General information
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <AlertTriangle size={16} className="text-amber-500" /> Results may vary
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <FileText size={16} className="text-emerald-500" /> User verification advised
          </span>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Calculator className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Calculator Results</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Calculator outputs are estimates and may differ from official university, school, admission, or grading systems.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">PDF & OCR Results</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Formatting, text recognition, and layout quality may vary depending on the original PDF, scan quality, language, and document structure.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ImageIcon className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Image Processing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Compression or resizing may affect image quality, metadata, dimensions, or file appearance.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <AlertTriangle className="text-amber-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">User Responsibility</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Review important outputs before using them for academic, professional, legal, financial, or official purposes.</p>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-sm min-w-0">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. General Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SnapFreeTools provides online productivity tools for general informational and convenience purposes. The platform does not guarantee that every output will meet every user requirement, and results should not be relied upon as absolute fact.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Accuracy of Results</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Calculations and conversions may contain errors and depend heavily on user input and selected settings. Official institutions, source documents, and certified professionals take priority over our tools. Users should independently verify important outputs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Tool Limitations</h2>
            <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-4">
              <li>
                <strong>Calculators:</strong> GPA, CGPA, SGPA, merit, percentage, and admission outputs are estimates based on standard formulas.
              </li>
              <li>
                <strong>PDF and OCR tools:</strong> Text recognition and formatting may differ from the source file. Low-quality scans, complex layouts, tables, handwriting, and multiple columns may reduce accuracy.
              </li>
              <li>
                <strong>Image tools:</strong> Compression may reduce image quality or remove metadata. Output may differ across browsers or devices.
              </li>
              <li>
                <strong>Text tools:</strong> Counts and analysis may differ based on punctuation, formatting, language, or input structure.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. No Professional Advice</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SnapFreeTools does not provide legal, financial, medical, academic, admission, or professional advice. Users should consult the relevant institution or a qualified professional when making important decisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. No Warranties and Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Tools are provided on an “as available” basis. SnapFreeTools does not guarantee uninterrupted access, perfect accuracy, or suitability for every purpose. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              To the extent permitted by applicable law, SnapFreeTools is not responsible for losses caused by reliance on inaccurate outputs, failed conversions, data loss, or third-party links. Nothing in this disclaimer excludes rights that cannot legally be excluded.
            </p>
          </section>

          {/* Verification Warning Callout */}
          <section className="mb-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-2">
                <AlertTriangle size={20} className="text-amber-600" /> Please verify important results
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Before submitting grades, applications, official documents, compressed images, or converted files, compare the result with the original source or relevant institution.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">File and Data Responsibility</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Users are responsible for ensuring they have permission to process any file, text, image, or document they provide to a SnapFreeTools tool.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SnapFreeTools may link to external websites. Those services operate under their own terms, privacy policies, and accuracy standards.
            </p>
          </section>

        </article>
      </main>

      {/* Final Contact Section */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <HelpCircle className="text-emerald-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-3">Need clarification?</h2>
          <p className="text-slate-300 mb-6 text-sm max-w-xl mx-auto">
            Contact SnapFreeTools if you have questions about a tool result, limitation, or this Disclaimer. Do not send passwords, financial details, or sensitive documents by email.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/contact" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
              Contact Form
            </Link>
            <a href="mailto:sameerwebdeveloper41@gmail.com" className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm border border-slate-700 shadow-sm">
              sameerwebdeveloper41@gmail.com
            </a>
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
