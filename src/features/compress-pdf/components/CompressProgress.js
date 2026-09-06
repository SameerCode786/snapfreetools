import React from "react";
import { Loader2, FileDown } from "lucide-react";

export default function CompressProgress({ progressInfo }) {
  const { step = "Compressing PDF...", percent = 0 } = progressInfo || {};

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-xs">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <Loader2 className="animate-spin text-amber-500" size={48} />
        <FileDown className="absolute text-slate-400" size={22} />
      </div>

      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
          {step}
        </h3>
        <p className="text-slate-400 text-xs font-semibold">
          Processing document locally in your browser...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Optimizing Objects</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
