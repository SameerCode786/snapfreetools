"use client";

import React from "react";
import { CheckCircle, Download, RefreshCw, FileText, Shield } from "lucide-react";

export default function ConversionSuccess({
  originalFilename,
  pdfUrl,
  metrics,
  onReset
}) {
  const outputFilename = originalFilename.replace(/\.docx$/i, "") + ".pdf";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle size={32} />
      </div>

      <div className="space-y-1">
        <span className="inline-block text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Conversion Complete
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 pt-1">Your PDF is Ready!</h3>
        <p className="text-xs text-slate-500 font-medium">Processed locally in your browser.</p>
      </div>

      {/* Output Details Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto text-left space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{outputFilename}</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              {metrics.pdfSizeMb} MB • {metrics.totalPages} page{metrics.totalPages > 1 ? "s" : ""} • {metrics.durationSec}s
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
        <a
          href={pdfUrl}
          download={outputFilename}
          className="w-full sm:flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Download size={18} /> Download PDF
        </a>

        <button
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> Convert Another File
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 pt-2">
        <Shield size={14} className="text-emerald-500" />
        <span>Processed locally — 0 bytes uploaded to any server</span>
      </div>
    </div>
  );
}
