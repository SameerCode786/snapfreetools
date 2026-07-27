"use client";

import React from "react";
import { Loader2, XCircle } from "lucide-react";

export default function ConversionProgress({ progress, stageText, onCancel }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
        <Loader2 size={32} className="animate-spin" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900">{stageText}</h3>
        <p className="text-xs text-slate-400 font-medium">Please wait while your PDF is being generated...</p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 px-1">
          <span>Processing</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Cancel Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors py-1 px-3 rounded-lg hover:bg-red-50"
        >
          <XCircle size={14} /> Cancel Conversion
        </button>
      </div>
    </div>
  );
}
