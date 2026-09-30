import React from "react";
import Link from "next/link";
import { EyeOff, ShieldCheck, CheckCircle2, Lock, ArrowRight, FileText, AlertTriangle } from "lucide-react";

export default function RedactPdfEducationalContent() {
  return (
    <div className="space-y-12 text-slate-700">
      
      {/* 3-Step Process Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How to Redact a PDF Document in 3 Simple Steps
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Permanently black out sensitive text, numbers, and images inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Upload PDF File</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Select or drag & drop your PDF document into the browser redaction workspace.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Select Redaction Areas</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Draw redaction boxes over sensitive text, numbers, signatures, or confidential images on any page.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Apply & Download</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Click &quot;Apply Redactions&quot; to sanitize content streams and download your permanently secured PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Deep-Dive Article Sections */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 shadow-xs">
        
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <EyeOff className="text-amber-500 shrink-0" size={22} />
            Permanent Redaction vs. Superficial Black Boxes
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            Many users mistakenly believe that drawing a black highlight or placing a black rectangle shape using standard PDF markup tools redacts content. In reality, superficial shapes merely sit on top of the text layer—anyone opening the file can still select, copy, search, or extract the underlying confidential text!
          </p>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            **True PDF redaction** requires removing the actual text data and character byte streams from the underlying document object structure, while placing opaque graphics over the region. SnapFreeTools&apos; Redact PDF tool sanitizes PDF content streams and removes interactive fields so that search engines, PDF text extractors, and copy-paste shortcuts return **zero trace** of the redacted information.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Common Use Cases for PDF Redaction
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Legal & Court Documents</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Black out personally identifiable information (PII), minor names, Social Security Numbers, and confidential case details prior to public filing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Financial Records & Banking</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Protect bank account numbers, credit card details, credit scores, and tax IDs before sharing statements with external auditors or mortgage lenders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Healthcare & Medical Records</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Ensure HIPAA compliance by removing patient identifiers, medical record numbers, and private diagnosis notes from medical research reports.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Corporate & Human Resources</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Redact employee salaries, home addresses, phone numbers, and trade secrets before releasing internal company proposals or public press releases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            Redact PDF Tool Technical Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-3 font-extrabold text-slate-700">Feature</th>
                  <th className="py-2.5 px-3 font-extrabold text-slate-700">Specification Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Processing Environment</td>
                  <td className="py-2.5 px-3 text-slate-600">100% Client-Side WebBrowser JavaScript Memory</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Redaction Method</td>
                  <td className="py-2.5 px-3 text-slate-600">Content Stream Text Sanitization + Opaque Vector Rectangle Overlay</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Interactive Field Removal</td>
                  <td className="py-2.5 px-3 text-slate-600">AcroForm fields and widget annotations purged on redacted pages</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Server File Uploads</td>
                  <td className="py-2.5 px-3 text-slate-600">None (Files remain strictly on your local device)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">File Output Format</td>
                  <td className="py-2.5 px-3 text-slate-600">Permanently Redacted PDF Document (.pdf)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Highlight */}
        <div className="border-t border-slate-100 pt-6 flex items-start gap-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
          <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900">Complete Document Privacy</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Your confidential documents are processed locally in browser memory. No data is stored, logged, or uploaded to external servers, ensuring maximum privacy for sensitive legal and financial data.
            </p>
          </div>
        </div>

      </section>

      {/* Internal Tool Cross-Links */}
      <section className="space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          Explore Related Security & PDF Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/protect-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Protect PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Add strong password encryption to confidential documents.</p>
            </div>
          </Link>

          <Link
            href="/unlock-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Unlock PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Remove password protection and editing restrictions.</p>
            </div>
          </Link>

          <Link
            href="/flatten-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Flatten PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Bake interactive form fields and annotations into static content.</p>
            </div>
          </Link>

          <Link
            href="/edit-pdf-metadata"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Edit PDF Metadata
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Modify PDF title, author, keywords, and document properties.</p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
