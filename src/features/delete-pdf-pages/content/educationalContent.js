import React from "react";
import { ShieldCheck, FileX, FileCheck2, CheckCircle2, Trash2, ArrowRight } from "lucide-react";

export default function DeletePdfEducationalContent() {
  return (
    <div className="space-y-12 text-left">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
            <Trash2 size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Remove Unwanted Pages</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Quickly remove blank sheets, extra cover pages, or confidential sections from any multi-page PDF document.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Processing runs locally inside your browser memory. Your sensitive files are never uploaded to remote servers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <FileCheck2 size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Preserve Text & Formatting</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Pages are removed at the structural level. Selectable text, searchable fonts, and vector graphics remain untouched.
          </p>
        </div>
      </div>

      {/* Step-by-step Guide */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50 inline-block">
            STEP-BY-STEP TUTORIAL
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How to Delete Pages from a PDF File Online
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Removing unwanted pages from your PDF file takes less than 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Upload Your PDF</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Drag and drop your PDF into the upload area or click browse to choose a file from your computer or phone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Select Pages to Delete</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Click on page thumbnails or use batch tools to mark unwanted pages for deletion. Marked pages will highlight red.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Click Delete Selected Pages</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Review the summary to ensure at least one page is kept, then click the delete button.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Download New PDF</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Save your cleaned PDF document immediately to your device. No signups or waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structural Deletion vs Rasterization */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full inline-block">
            STRUCTURAL INTEGRITY
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Structural Page Copying vs Rasterization
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
            Unlike tools that convert PDF pages into low-quality JPEG images before re-compiling, SnapFreeTools extracts original page objects natively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 text-xs font-semibold">
          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold">
              <CheckCircle2 size={16} />
              <span>Preserves Text & Vector Art</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Fonts, vectors, and selectable text are copied directly from the original document tree.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
              <CheckCircle2 size={16} />
              <span>Exact Page Order Maintained</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Remaining pages retain their exact original order (e.g. keeping 1, 3, 5).
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
