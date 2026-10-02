"use client";

import React from "react";
import { ArrowUpDown, RefreshCw, XCircle } from "lucide-react";

export default function ProcessingState({ progress, onCancel }) {
  const { stage = "initializing", currentPage = 0, totalPages = 0, percentage = 0 } = progress || {};

  const stageLabels = {
    initializing: "Initializing PDF Document...",
    reversing: "Calculating Reversed Page Sequence...",
    copying: `Copying Page ${currentPage} of ${totalPages} in Reverse Order...`,
    assembling: "Assembling Final Reversed PDF Document...",
    complete: "Finalizing Conversion..."
  };

  const currentLabel = stageLabels[stage] || "Reversing PDF Page Order...";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 shadow-xs">
      {/* Animated Icon */}
      <div className="relative w-16 h-16 mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 animate-pulse">
          <ArrowUpDown size={32} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
          <RefreshCw size={12} className="animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 text-base">Reversing PDF Pages</h3>
        <p className="text-xs text-slate-500 font-medium">{currentLabel}</p>

        {totalPages > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold mt-1">
            <span>{totalPages} Pages Document</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>Processing</span>
          <span>{percentage}%</span>
        </div>
      </div>

      {/* Cancel Action */}
      {onCancel && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
          >
            <XCircle size={14} />
            <span>Cancel Processing</span>
          </button>
        </div>
      )}

      <p className="text-[11px] text-slate-400 font-semibold pt-1">
        Your document is processed locally inside your web browser.
      </p>
    </div>
  );
}
