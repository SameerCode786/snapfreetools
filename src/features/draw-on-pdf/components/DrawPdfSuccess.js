"use client";

import React from "react";
import { Download, CheckCircle2, RotateCcw, FileCheck, ShieldCheck } from "lucide-react";

export default function DrawPdfSuccess({ result, onReset }) {
  const { downloadUrl, filename, totalPages, totalAnnotationsPlaced, pdfBytes } = result || {};

  const sizeKb = pdfBytes ? Math.round(pdfBytes.length / 1024) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 sm:px-10 bg-white border border-slate-200/80 rounded-3xl shadow-xl text-center space-y-8 animate-in fade-in zoom-in-95">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-md shadow-emerald-100">
        <CheckCircle2 size={40} />
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          Your PDF is Ready!
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
          Annotations and drawings have been vector-embedded into your original PDF document.
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output File</p>
          <p className="text-sm font-bold text-slate-800 truncate" title={filename}>{filename || "annotated.pdf"}</p>
        </div>
        <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pages</p>
          <p className="text-sm font-bold text-slate-800">{totalPages || 1} Pages</p>
        </div>
        <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annotations</p>
          <p className="text-sm font-bold text-emerald-600">{totalAnnotationsPlaced || 0} Placed</p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={filename || "annotated.pdf"}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Download size={18} />
            <span>Download Annotated PDF</span>
          </a>
        )}

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200/80 flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={18} />
          <span>Draw Another PDF</span>
        </button>
      </div>

      {/* Privacy Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
        <ShieldCheck size={14} className="text-emerald-600" />
        <span>Processed locally on your device without server uploads.</span>
      </div>
    </div>
  );
}
