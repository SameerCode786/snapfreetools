import React from "react";
import { Stamp, ShieldCheck, Sparkles, Layers, Image as ImageIcon, FileText } from "lucide-react";

export default function WatermarkPdfEducationalContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left py-4">
      
      {/* Introduction Section */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How to Add Watermarks to PDF Online Free
        </h2>
        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
          Protect sensitive contracts, brand corporate presentations, or mark confidential documents with SnapFreeTools Watermark PDF. Stamp custom text watermarks or brand logo images onto any PDF page with total client-side privacy.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Stamp size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Text & Logo Watermarks</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Choose between custom text or PNG/JPG/WebP image logos with full opacity, rotation, and scale controls.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">100% Client-Side Privacy</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Your document is processed locally in your browser memory. No files are uploaded to remote servers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Zero Quality Loss</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Watermarks are drawn natively over PDF pages without rasterizing text or altering document resolution.
          </p>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900">
          3 Simple Steps to Watermark a PDF
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Select PDF File</h4>
            <p className="text-xs font-semibold text-slate-500">
              Drag and drop your PDF document or choose it from your local storage.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Configure Watermark</h4>
            <p className="text-xs font-semibold text-slate-500">
              Customize text or image logo, set font size, opacity, rotation angle, position, and page range.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Download Watermarked PDF</h4>
            <p className="text-xs font-semibold text-slate-500">
              Click 'Apply & Download Watermark PDF' to save your secure document instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Non-Rasterization Explanation */}
      <section className="space-y-3 border-t border-slate-200/80 pt-6">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Layers size={18} className="text-amber-500" />
          <span>Native Vector Overlay vs. Image Conversion</span>
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
          Standard online PDF watermark tools flatten pages into compressed images before drawing watermarks, destroying selectable text and degrading document clarity. SnapFreeTools uses native vector overlay via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">pdf-lib</code>. Watermark text and logos are stamped as high-resolution layers over existing PDF pages, preserving 100% of selectable text, embedded fonts, and vector graphics.
        </p>
      </section>

    </div>
  );
}
