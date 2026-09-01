import React from "react";
import { Loader2, XCircle } from "lucide-react";

export default function ConversionProgress({ progress, currentPage, totalPages, onCancel }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
      
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated loader */}
        <div className="relative flex items-center justify-center">
          <Loader2 size={36} className="text-amber-500 animate-spin" />
        </div>
        
        <h3 className="text-lg font-extrabold text-slate-800">
          Converting PDF pages...
        </h3>
        
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Converting page <span className="text-amber-600 font-bold">{currentPage}</span> of <span className="text-slate-800 font-bold">{totalPages}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
          <span>PROGRESS</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Cancel button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 py-2.5 px-6 border border-slate-200 hover:border-red-200 text-slate-650 hover:text-red-500 hover:bg-red-50/20 text-xs font-bold rounded-xl transition-all"
        >
          <XCircle size={14} /> Cancel Conversion
        </button>
      </div>

    </div>
  );
}
