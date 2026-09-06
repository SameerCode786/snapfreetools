import React from "react";
import { Loader2, Scissors } from "lucide-react";

export default function ProcessingState({ progress }) {
  const percent = progress.percent || 0;
  const message = progress.message || "Processing PDF pages...";

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
      <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm relative">
        <Scissors size={28} className="animate-bounce" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">
          Splitting Your PDF Document
        </h3>
        <p className="text-xs font-semibold text-slate-500">
          {message}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Processing</span>
          <span className="text-amber-600 font-extrabold">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
