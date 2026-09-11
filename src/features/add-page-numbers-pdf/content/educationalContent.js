import React from "react";
import { Hash, ShieldCheck, Sparkles, Layers, FileText, CheckCircle2 } from "lucide-react";

export default function PageNumberPdfEducationalContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left py-4">
      
      {/* Direct-Answer AEO Section */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Add Page Numbers to PDF Online Free
        </h2>
        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
          SnapFreeTools Add Page Numbers to PDF tool lets you insert customizable page numbers into PDF documents directly in your browser. Stamp page numbers in multiple formats (e.g. 1, 2, 3, Page 1 of N, Roman numerals), skip cover pages, set custom starting offsets, and choose precise positions with 100% client-side privacy.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Hash size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Flexible Formats & Styles</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Choose from Arabic, Roman (i, ii, iii), Letters (A, B, C), Page X of Y, or custom templates with dynamic placeholders.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">100% Client-Side Privacy</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Your document is processed locally in your browser memory. Files are never uploaded to remote servers or third parties.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Zero Quality Loss</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Page numbers are overlaid natively as vector text layers. Selectable text, embedded fonts, and graphics remain sharp.
          </p>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900">
          How to Add Page Numbers to a PDF
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Upload PDF File</h4>
            <p className="text-xs font-semibold text-slate-500">
              Drag and drop your PDF document or pick it from your device storage.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Customize Numbering & Position</h4>
            <p className="text-xs font-semibold text-slate-500">
              Select format, starting number, skip cover pages, position (e.g. Bottom Center), font size, and color.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Download Numbered PDF</h4>
            <p className="text-xs font-semibold text-slate-500">
              Click 'Apply & Download Numbered PDF' to save your newly formatted document.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Use Case Sections */}
      <div className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">How to Skip a Cover Page</h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
            Academic papers, reports, and books frequently have a title or cover page that should not display a page number. With SnapFreeTools, simply set <strong>Skip First N Pages</strong> to <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">1</code>. Page 1 will remain unnumbered, and numbering will cleanly commence on Page 2 as Page 1 or Page 2.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-black text-slate-900">Native Vector Overlay vs. Image Flattening</h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
            Inferior online converters convert PDF pages into low-resolution JPEG screenshots before stamping numbers, destroying selectable text and degrading print quality. SnapFreeTools utilizes native PDF stream modification via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">pdf-lib</code>. Numbers are stamped as vector text streams, preserving 100% of selectable text, embedded fonts, vector artwork, and document resolution.
          </p>
        </section>
      </div>

    </div>
  );
}
