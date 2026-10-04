"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import ShareSystem from "@/components/share";

export default function PageSorterSuccess({ result, onReset }) {
  const handleDownload = () => {
    if (!result?.downloadUrl) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = result.outputFilename || result.filename || "document-sorted.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Success Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            PDF Page Order Updated!
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
            Your PDF document pages have been reordered and compiled cleanly into native vector PDF format.
          </p>
        </div>

        {/* File Stats Summary */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 grid grid-cols-2 gap-4 text-left max-w-md mx-auto text-xs">
          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
              Output File
            </span>
            <span className="font-extrabold text-slate-800 truncate block mt-0.5" title={result.outputFilename}>
              {result.outputFilename}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
              Page Sequence
            </span>
            <span className="font-extrabold text-emerald-600 block mt-0.5">
              {result.sortedPageCount} Pages Sorted
            </span>
          </div>
        </div>

        {/* Download Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-sm hover:shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={18} />
            <span>Download Sorted PDF</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Sort Another PDF</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>100% Private Client-Side Processing</span>
        </div>
      </div>

      {/* Centralized Share System */}
      <ShareSystem
        title="PDF Page Sorter — SnapFreeTools"
        text="Easily sort, reorder, and arrange PDF pages online for free with private client-side processing!"
        url="https://www.snapfreetools.com/pdf-page-sorter"
      />
    </div>
  );
}
