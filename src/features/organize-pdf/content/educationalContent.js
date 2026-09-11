import React from "react";
import { Move, ShieldCheck, Zap, Sparkles, Layers, FileText, CheckCircle2 } from "lucide-react";

export default function OrganizePdfEducationalContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left py-4">
      
      {/* Introduction Section */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How to Organize & Reorder PDF Pages Online Free
        </h2>
        <p className="text-sm font-semibold text-slate-600 leading-relaxed">
          Need to rearrange pages in a PDF report, swap chapters, or fix out-of-order scanned documents? SnapFreeTools provides a powerful, 100% browser-based PDF organizer. Visually drag and drop pages into your custom sequence without uploading files to remote servers or losing text formatting.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Move size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Drag & Drop Simplicity</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Drag thumbnails visually or use tap arrows to swap pages instantly on desktop, mobile, and tablets.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">100% Client-Side Privacy</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Your PDF document is analyzed and reconstructed entirely inside your browser. No files touch our servers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Zero Rasterization</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Pages are assembled natively as vector structures. Selectable text, embedded fonts, and links remain sharp.
          </p>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900">
          3 Simple Steps to Reorder PDF Pages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Select PDF Document</h4>
            <p className="text-xs font-semibold text-slate-500">
              Drag and drop your PDF file or pick it from your device storage.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Arrange & Rotate Pages</h4>
            <p className="text-xs font-semibold text-slate-500">
              Drag thumbnails into your desired order, or use Reverse, Reset, and Rotation controls.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Download Organized PDF</h4>
            <p className="text-xs font-semibold text-slate-500">
              Click 'Organize & Save PDF' to generate your new document instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Structural PDF vs Rasterization Explanation */}
      <section className="space-y-3 border-t border-slate-200/80 pt-6">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Layers size={18} className="text-amber-500" />
          <span>Structural Reordering vs. Image Rasterization</span>
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
          Many generic online PDF tools convert PDF pages into low-resolution JPEG images, reorder the images, and compile them back into a bloated image-only PDF. This destroys selectable text, removes hyperlinks, and reduces print clarity. SnapFreeTools uses high-performance structural PDF copying via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">pdf-lib</code>. Pages are copied as native objects, preserving 100% of text layers, embedded fonts, vector artwork, and document dimensions.
        </p>
      </section>

    </div>
  );
}
