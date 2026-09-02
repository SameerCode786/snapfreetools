import React from "react";
import { Loader2 } from "lucide-react";

export default function MergeProgress({ progressInfo }) {
  const { currentFileIndex = 1, totalFiles = 1, filename = "", percent = 0 } = progressInfo || {};

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 size={36} className="text-amber-500 animate-spin" />
        </div>
        
        <h3 className="text-lg font-extrabold text-slate-800">
          Merging PDF Files...
        </h3>
        
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Processing file <span className="text-amber-600 font-bold">{currentFileIndex}</span> of <span className="text-slate-800 font-bold">{totalFiles}</span>
          {filename && <span className="block text-[11px] text-slate-400 font-medium truncate max-w-xs mx-auto mt-1" title={filename}>{filename}</span>}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
          <span>COMPILING NATIVE PDF OBJECTS</span>
          <span>{percent}%</span>
        </div>
      </div>

    </div>
  );
}
