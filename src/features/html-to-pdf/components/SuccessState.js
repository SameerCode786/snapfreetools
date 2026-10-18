"use client";

import React from "react";
import { CheckCircle2, Download, RotateCcw, FileCheck, ShieldCheck } from "lucide-react";

export default function SuccessState({
  pdfUrl,
  pdfFilename,
  pdfSizeBytes,
  onReset
}) {
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="py-8 sm:py-12 space-y-8 max-w-lg mx-auto text-center">
      {/* Success Animated Badge */}
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900">
          PDF Ready for Download!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Your HTML document has been successfully rendered into a high-quality PDF.
        </p>
      </div>

      {/* PDF Card Preview Details */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
            <FileCheck size={22} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
              {pdfFilename || "html-to-pdf.pdf"}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {formatFileSize(pdfSizeBytes)} • PDF Document
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-extrabold uppercase shrink-0">
          <ShieldCheck size={12} />
          Ready
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <a
          href={pdfUrl}
          download={pdfFilename || "html-to-pdf.pdf"}
          id="btn-download-pdf"
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Download size={20} />
          <span>Download PDF Document</span>
        </a>

        <button
          type="button"
          id="btn-convert-another"
          onClick={onReset}
          className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>Convert Another HTML Document</span>
        </button>
      </div>
    </div>
  );
}
