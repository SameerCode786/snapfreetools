import React from "react";
import { ShieldCheck, RotateCw, FileCheck2, Sparkles, CheckCircle2, Zap, Smartphone, Layers } from "lucide-react";

export default function RotatePdfEducationalContent() {
  return (
    <div className="space-y-12 text-left">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
            <RotateCw size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Permanent PDF Rotation</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Rotate single or multiple PDF pages by 90°, 180°, or 270° permanently across all devices and viewers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">100% In-Browser Privacy</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Your PDF documents are processed locally inside browser memory. Zero files are uploaded to remote servers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <FileCheck2 size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Zero Text Quality Loss</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Rotates page structural attributes directly without rasterization. Vector shapes, text selection, and fonts remain sharp.
          </p>
        </div>
      </div>

      {/* Deep Educational Guide Section */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50 inline-block">
            GUIDE & TUTORIAL
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How to Rotate PDF Pages Online (Step-by-Step)
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Fixing sideways or upside-down scanned PDF pages is simple with SnapFreeTools Rotate PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Upload Your PDF Document</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Drag and drop your PDF into the secure upload zone or click browse to choose a file from your device.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Select Global or Page Rotations</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Click global rotation buttons to rotate all pages at once, or use individual thumbnail rotate controls to rotate specific pages.
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
                <h4 className="text-sm font-black text-slate-900">Preview & Apply Changes</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Watch page previews update instantly on screen. Click "Rotate PDF" to apply structural rotations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">Download Your Rotated PDF</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Save your rotated PDF file directly to your computer or phone. No signups or subscriptions needed.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose Native Rotation Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full inline-block">
            NATIVE SPECIFICATION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Why Native PDF Page Rotation Matters
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
            Inferior online tools convert PDF pages into rasterized JPG images before rotating, destroying text selection and ballooning file size. SnapFreeTools modifies the native `/Rotate` attribute inside the PDF stream.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 text-xs font-semibold">
          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold">
              <CheckCircle2 size={16} />
              <span>Selectable & Searchable Text</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Text, fonts, and hyperlinks remain 100% interactive for copying and search indexing.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-4 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
              <CheckCircle2 size={16} />
              <span>Zero File Size Inflation</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Rotates page dimensions natively without converting pages into heavy image blobs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
