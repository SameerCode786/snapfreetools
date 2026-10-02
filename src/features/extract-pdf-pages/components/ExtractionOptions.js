"use client";

import React from "react";
import { ArrowRight, FileCheck2, AlertCircle, Layers } from "lucide-react";

export default function ExtractionOptions({
  selectedCount = 0,
  totalPages = 0,
  selectedPages = [],
  onExecuteExtraction,
  isProcessing = false
}) {
  const isNoneSelected = selectedCount === 0;

  // Format summary of selected pages
  const sortedPages = [...selectedPages].sort((a, b) => a - b);
  let summaryText = "";
  if (isNoneSelected) {
    summaryText = "Please select at least 1 page above to enable extraction.";
  } else if (selectedCount === totalPages) {
    summaryText = `All ${totalPages} pages selected. (Entire document will be extracted)`;
  } else if (sortedPages.length <= 6) {
    summaryText = `Extracting ${selectedCount} ${selectedCount === 1 ? "page" : "pages"}: ${sortedPages.join(", ")}`;
  } else {
    summaryText = `Extracting ${selectedCount} pages: ${sortedPages.slice(0, 5).join(", ")} ... ${sortedPages[sortedPages.length - 1]}`;
  }

  return (
    <div className="sticky bottom-6 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 max-w-5xl mx-auto">
      {/* Left Summary info */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-black text-slate-900">
          <FileCheck2 size={18} className="text-amber-500 shrink-0" />
          <span>Extraction Ready</span>
          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
            isNoneSelected ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
          }`}>
            {selectedCount} {selectedCount === 1 ? "Page" : "Pages"} Selected
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xl">
          {summaryText}
        </p>
      </div>

      {/* Right Primary CTA Button */}
      <button
        type="button"
        disabled={isNoneSelected || isProcessing}
        onClick={onExecuteExtraction}
        className={`w-full sm:w-auto px-8 py-4 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0 ${
          isNoneSelected || isProcessing
            ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60 shadow-none"
            : "bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white shadow-amber-500/20"
        }`}
      >
        <Layers size={18} />
        <span>Extract PDF {selectedCount > 0 ? `(${selectedCount} ${selectedCount === 1 ? "Page" : "Pages"})` : ""}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
