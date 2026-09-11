"use client";

import React from "react";
import { CheckCircle2, Download, RotateCw, ShieldCheck, FileCheck2, ArrowRight } from "lucide-react";

export default function RotateSuccess({ resultData, onReset }) {
  const handleDownload = () => {
    if (!resultData || !resultData.downloadUrl) return;
    const a = document.createElement("a");
    a.href = resultData.downloadUrl;
    a.download = resultData.outputFilename || "document-rotated.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xs my-6">
      
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          ROTATION COMPLETE
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
          Your PDF is Ready!
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {resultData.rotatedPageCount > 0
            ? `Successfully rotated ${resultData.rotatedPageCount} page${resultData.rotatedPageCount > 1 ? "s" : ""} without rasterization.`
            : `All ${resultData.totalPages} pages saved.`}
        </p>
      </div>

      {/* File Detail Badge */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
        <div className="flex items-center justify-between font-extrabold text-slate-900">
          <span className="flex items-center gap-2 line-clamp-1">
            <FileCheck2 size={16} className="text-emerald-600 shrink-0" />
            {resultData.outputFilename}
          </span>
          <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            PDF
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-200/60 pt-2">
          <span>{resultData.totalPages} Pages</span>
          <span className="text-emerald-600">100% Selectable Text Preserved</span>
        </div>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={16} />
          <span>Download Rotated PDF</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCw size={14} />
          <span>Rotate Another PDF</span>
        </button>
      </div>

      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 pt-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% Client-Side • File never leaves browser memory</span>
      </div>

    </div>
  );
}
